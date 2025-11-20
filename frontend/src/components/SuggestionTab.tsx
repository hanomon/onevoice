import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { vocAPI } from '../api/client'

const CATEGORIES = ['프로세스 문의', '시스템 문의', '기타']

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
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">건의사항이 제출되었습니다</h3>
          <p className="text-gray-600">소중한 의견 감사합니다!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">무엇이든 건의하세요</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Name */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent resize-none"
              placeholder="건의사항을 상세히 작성해주세요"
              required
            />
          </div>

          {/* Error Message */}
          {mutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              오류가 발생했습니다: {(mutation.error as any)?.response?.data?.detail || (mutation.error as any)?.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {mutation.isPending ? '제출 중...' : '제출하기'}
          </button>
        </form>
      </div>
    </div>
  )
}

