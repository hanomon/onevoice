import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadAPI } from '../api/client'

export default function UploadTab() {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: files, isLoading } = useQuery({
    queryKey: ['uploadedFiles'],
    queryFn: uploadAPI.getFiles
  })

  const uploadMutation = useMutation({
    mutationFn: uploadAPI.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadedFiles'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: uploadAPI.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadedFiles'] })
    }
  })

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    uploadMutation.mutate(file)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR')
  }

  const getProcessingStatus = (processed: number) => {
    switch (processed) {
      case 1:
        return <span className="text-green-600 text-sm">✓ 완료</span>
      case -1:
        return <span className="text-red-600 text-sm">✗ 실패</span>
      default:
        return <span className="text-yellow-600 text-sm">⏳ 처리 중</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">문서 업로드</h2>
        
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? 'border-gray-600 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg text-gray-700 mb-2">
            파일을 드래그하거나 클릭하여 업로드
          </p>
          <p className="text-sm text-gray-500 mb-6">
            지원 형식: TXT, PDF, PPTX, XLSX, DOCX
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept=".txt,.pdf,.pptx,.ppt,.xlsx,.xls,.docx,.doc"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? '업로드 중...' : '파일 선택'}
          </button>
        </div>

        {uploadMutation.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            업로드 실패: {(uploadMutation.error as any)?.response?.data?.detail || (uploadMutation.error as any)?.message}
          </div>
        )}

        {uploadMutation.isSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            파일이 성공적으로 업로드되었습니다!
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">업로드된 파일 목록</h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : files && files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-gray-100 rounded">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(file.upload_date)} • {file.file_type}
                    </p>
                  </div>
                  {getProcessingStatus(file.processed)}
                </div>
                <button
                  onClick={() => deleteMutation.mutate(file.id)}
                  disabled={deleteMutation.isPending}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            업로드된 파일이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}

