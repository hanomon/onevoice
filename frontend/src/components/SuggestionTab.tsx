import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, Lightbulb, User, Tag, MessageSquare } from 'lucide-react'
import { vocAPI } from '../api/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'

const CATEGORIES = ['프로세스 문의', '시스템 문의', '기타']

const CATEGORY_COLORS: Record<string, any> = {
  '프로세스 문의': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  '시스템 문의': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  '기타': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
}

export default function SuggestionTab() {
  const [userName, setUserName] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: vocAPI.create,
    onSuccess: () => {
      setSubmitted(true)
      setTimeout(() => {
        setUserName('')
        setCategory('')
        setContent('')
        setSubmitted(false)
      }, 3000)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !category || !content.trim()) return

    mutation.mutate({
      user_name: userName,
      category: category,
      content: content
    })
  }

  if (submitted) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">건의사항이 제출되었습니다</h3>
            <p className="text-sm text-gray-600 mb-4">소중한 의견 감사합니다!</p>
            <Badge variant="success" className="text-xs px-3 py-1">
              관리자가 검토 후 반영하겠습니다
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-primary-50 to-blue-50 p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg">건의사항 제출</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                개선사항을 작성해주세요
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Name */}
            <div>
              <label htmlFor="userName" className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-2">
                <User className="w-3 h-3 text-primary-600" />
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="이름을 입력하세요"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-2">
                <Tag className="w-3 h-3 text-primary-600" />
                카테고리 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const colors = CATEGORY_COLORS[cat]
                  const isSelected = category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${colors.bg} ${colors.border} ring-2 ring-primary-300`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <p className={`text-xs font-medium ${isSelected ? colors.text : 'text-gray-700'}`}>
                        {cat}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-2">
                <MessageSquare className="w-3 h-3 text-primary-600" />
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
                placeholder="건의사항을 상세히 작성해주세요"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length} / 1000자
              </p>
            </div>

            {/* Error Message */}
            {mutation.isError && (
              <Card className="bg-red-50 border-2 border-red-200">
                <CardContent className="p-2">
                  <p className="text-xs text-red-700 font-medium">
                    ⚠️ 오류: {(mutation.error as any)?.response?.data?.detail || (mutation.error as any)?.message}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setUserName('')
                  setCategory('')
                  setContent('')
                }}
              >
                초기화
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || !userName.trim() || !category || !content.trim()}
                size="sm"
                className="flex-1 text-xs"
              >
                {mutation.isPending ? '제출 중...' : '제출하기'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

