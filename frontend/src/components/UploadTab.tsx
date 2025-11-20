import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, FileText, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { uploadAPI } from '../api/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

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
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            처리완료
          </Badge>
        )
      case -1:
        return (
          <Badge variant="error" className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            처리실패
          </Badge>
        )
      default:
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            처리중
          </Badge>
        )
    }
  }

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase()
    if (type.includes('pdf')) return '📕'
    if (type.includes('doc')) return '📘'
    if (type.includes('xls')) return '📗'
    if (type.includes('ppt')) return '📙'
    if (type.includes('txt')) return '📄'
    return '📄'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">문서 업로드</CardTitle>
              <CardDescription className="text-base mt-1">
                새로운 문서를 시스템에 추가하세요
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-purple-500 bg-purple-50 scale-105'
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              파일을 여기로 드래그하세요
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              또는 아래 버튼을 클릭하여 파일을 선택하세요
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="default">TXT</Badge>
              <Badge variant="default">PDF</Badge>
              <Badge variant="default">DOCX</Badge>
              <Badge variant="default">PPTX</Badge>
              <Badge variant="default">XLSX</Badge>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept=".txt,.pdf,.pptx,.ppt,.xlsx,.xls,.docx,.doc"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {uploadMutation.isPending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  파일 선택
                </>
              )}
            </Button>
          </div>

          {uploadMutation.isError && (
            <Card className="mt-4 bg-red-50 border-2 border-red-200">
              <CardContent className="p-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700 font-medium">
                  업로드 실패: {(uploadMutation.error as any)?.response?.data?.detail || (uploadMutation.error as any)?.message}
                </p>
              </CardContent>
            </Card>
          )}

          {uploadMutation.isSuccess && (
            <Card className="mt-4 bg-green-50 border-2 border-green-200">
              <CardContent className="p-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700 font-medium">
                  파일이 성공적으로 업로드되었습니다!
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">업로드된 파일 목록</CardTitle>
              <CardDescription className="mt-1">
                {files?.length || 0}개의 파일이 등록되어 있습니다
              </CardDescription>
            </div>
            <Badge variant="info" className="text-sm px-3 py-1">
              총 {files?.length || 0}건
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : files && files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file: any) => (
                <Card key={file.id} hover className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-4xl">
                          {getFileIcon(file.file_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{file.filename}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-500">
                              {formatDate(file.upload_date)}
                            </p>
                            <span className="text-gray-300">•</span>
                            <Badge variant="default" className="text-xs">
                              {file.file_type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getProcessingStatus(file.processed)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(file.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">업로드된 파일이 없습니다</p>
              <p className="text-sm text-gray-400">첫 번째 문서를 업로드해보세요</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

