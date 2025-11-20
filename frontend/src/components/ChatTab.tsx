import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { chatAPI } from '../api/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
}

export default function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const mutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          sources: data.sources
        }
      ])
    },
    onError: (error: any) => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `오류가 발생했습니다: ${error.response?.data?.detail || error.message}`
        }
      ])
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    mutation.mutate(input)
    setInput('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Google Search Style Header */}
      {messages.length === 0 && (
        <div className="text-center mb-8 pt-12">
          <h2 className="text-4xl font-light text-gray-700 mb-8">무엇이든 질문하세요</h2>
          <p className="text-gray-500 mb-12">업로드된 문서를 기반으로 정확한 답변을 제공합니다</p>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="mb-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gray-700 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">출처:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.sources.map((source, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          📄 {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {mutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력하세요..."
            className="w-full px-6 py-4 pr-14 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-lg"
            disabled={mutation.isPending}
          />
          <button
            type="submit"
            disabled={mutation.isPending || !input.trim()}
            className="absolute right-2 p-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

