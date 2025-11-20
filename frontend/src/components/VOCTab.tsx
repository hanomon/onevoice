import { useQuery } from '@tanstack/react-query'
import { vocAPI } from '../api/client'

export default function VOCTab() {
  const { data: vocs, isLoading } = useQuery({
    queryKey: ['vocs'],
    queryFn: vocAPI.getAll
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '프로세스 문의':
        return 'bg-blue-100 text-blue-800'
      case '시스템 문의':
        return 'bg-purple-100 text-purple-800'
      case '기타':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">VOC 현황</h2>
      
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">로딩 중...</div>
      ) : vocs && vocs.length > 0 ? (
        <div className="space-y-4">
          {vocs.map((voc: any) => (
            <div
              key={voc.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{voc.user_name}</p>
                    <p className="text-sm text-gray-500">{formatDate(voc.created_at)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(voc.category)}`}>
                  {voc.category}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{voc.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500">등록된 VOC가 없습니다</p>
        </div>
      )}
    </div>
  )
}

