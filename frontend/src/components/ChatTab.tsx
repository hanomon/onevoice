import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Send, FileText, Sparkles } from 'lucide-react'
import { chatAPI } from '../api/client'
import { Card, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

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
    <div className="h-full flex flex-col">
      {/* Empty State */}
      {messages.length === 0 && (
        <Card className="mb-4 border-dashed border-2">
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI에게 질문하세요</h3>
            <p className="text-sm text-gray-600">업로드된 문서를 기반으로 정확한 답변을 제공합니다</p>
          </CardContent>
        </Card>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 mb-4 space-y-3 overflow-y-auto pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary-600' 
                    : 'bg-gradient-to-br from-purple-500 to-purple-600'
                }`}>
                  {message.role === 'user' ? (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <Sparkles className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <Card className={`flex-1 ${message.role === 'user' ? 'bg-primary-50 border-primary-200' : ''}`}>
                  <CardContent className="p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {message.role === 'user' ? '나' : 'AI'}
                    </p>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed" style={{ 
                      wordBreak: 'keep-all',
                      lineHeight: '1.8'
                    }}>
                      {message.content.split('\n').map((line, idx) => {
                        // 제목 스타일 (【】로 감싸진 텍스트)
                        if (line.includes('【') && line.includes('】')) {
                          return (
                            <div key={idx} className="font-bold text-base text-primary-700 mt-3 mb-2">
                              {line}
                            </div>
                          )
                        }
                        // 번호 매기기 (1., 2., 3. 등)
                        if (/^\d+\./.test(line.trim())) {
                          return (
                            <div key={idx} className="font-semibold text-gray-900 mt-2 mb-1">
                              {line}
                            </div>
                          )
                        }
                        // 불릿 포인트 (- 로 시작)
                        if (line.trim().startsWith('-')) {
                          return (
                            <div key={idx} className="ml-4 text-gray-700 mb-1">
                              {line}
                            </div>
                          )
                        }
                        // 빈 줄
                        if (line.trim() === '') {
                          return <div key={idx} className="h-2"></div>
                        }
                        // 일반 텍스트
                        return (
                          <div key={idx} className="text-gray-800 mb-1">
                            {line}
                          </div>
                        )
                      })}
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          참조 문서
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {message.sources.map((source, idx) => (
                            <Badge key={idx} variant="info" className="text-xs px-2 py-0.5">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {mutation.isPending && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">AI</p>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <div className="mt-auto">
        <Card>
          <CardContent className="p-3">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="질문을 입력하세요..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={mutation.isPending}
              />
              <Button
                type="submit"
                disabled={mutation.isPending || !input.trim()}
                size="sm"
                className="px-4 flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>전송</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

