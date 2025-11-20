import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MessageCircle, User, Calendar, Inbox, TrendingUp, Filter, Sparkles } from 'lucide-react'
import { vocAPI } from '../api/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import VOCAnalysisModal from './VOCAnalysisModal'

export default function VOCTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [selectedVOC, setSelectedVOC] = useState<any>(null)
  
  const { data: vocs, isLoading } = useQuery({
    queryKey: ['vocs'],
    queryFn: vocAPI.getAll
  })

  // 카테고리별 필터링
  const filteredVocs = selectedCategory === '전체' 
    ? vocs 
    : vocs?.filter((voc: any) => voc.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryBadgeVariant = (category: string): 'default' | 'success' | 'warning' | 'error' | 'info' => {
    switch (category) {
      case '프로세스 문의':
        return 'info'
      case '시스템 문의':
        return 'warning'
      case '기타':
        return 'default'
      default:
        return 'default'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '프로세스 문의':
        return '📋'
      case '시스템 문의':
        return '⚙️'
      case '기타':
        return '💬'
      default:
        return '💬'
    }
  }

  // 카테고리별 통계
  const categoryStats = vocs?.reduce((acc: any, voc: any) => {
    acc[voc.category] = (acc[voc.category] || 0) + 1
    return acc
  }, {})

  const categories = ['전체', '프로세스 문의', '시스템 문의', '기타']

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">전체 VOC</p>
                <p className="text-2xl font-bold text-gray-900">{vocs?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">프로세스 문의</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats?.['프로세스 문의'] || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">시스템 문의</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats?.['시스템 문의'] || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">기타</p>
                <p className="text-2xl font-bold text-gray-900">{categoryStats?.['기타'] || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">카테고리 필터:</span>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                  {category !== '전체' && categoryStats?.[category] && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded">
                      {categoryStats[category]}
                    </span>
                  )}
                  {category === '전체' && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded">
                      {vocs?.length || 0}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VOC List */}
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">VOC 현황</CardTitle>
                <CardDescription className="text-base mt-1">
                  사용자 건의사항 및 피드백
                </CardDescription>
              </div>
            </div>
            <Badge variant="info" className="text-sm px-3 py-1">
              {selectedCategory === '전체' ? '전체' : selectedCategory} {filteredVocs?.length || 0}건
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">로딩 중...</p>
            </div>
          ) : filteredVocs && filteredVocs.length > 0 ? (
            <div className="space-y-4">
              {filteredVocs.map((voc: any) => (
                <Card key={voc.id} hover className="border-l-4 border-l-primary-500">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-lg">{voc.user_name}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(voc.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getCategoryBadgeVariant(voc.category)} className="flex items-center gap-1 whitespace-nowrap">
                          <span>{getCategoryIcon(voc.category)}</span>
                          {voc.category}
                        </Badge>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSelectedVOC(voc)}
                          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>분석</span>
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{voc.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">등록된 VOC가 없습니다</h3>
              <p className="text-gray-500">아직 제출된 건의사항이 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* VOC Analysis Modal */}
      {selectedVOC && (
        <VOCAnalysisModal
          voc={selectedVOC}
          onClose={() => setSelectedVOC(null)}
        />
      )}
    </div>
  )
}

