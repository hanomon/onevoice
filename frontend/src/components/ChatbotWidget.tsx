import { useState } from 'react'
import { X, MessageSquare, Lightbulb, Minimize2, Maximize2 } from 'lucide-react'
import { Card } from './ui/Card'
import ChatTab from './ChatTab'
import SuggestionTab from './SuggestionTab'

interface ChatbotWidgetProps {
  onClose: () => void
}

export default function ChatbotWidget({ onClose }: ChatbotWidgetProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestion'>('chat')
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <div 
      className={`fixed transition-all duration-300 ${
        isMinimized 
          ? 'bottom-8 right-8 w-80 h-16' 
          : 'bottom-8 right-8 w-[480px] h-[700px]'
      } z-50`}
    >
      <Card className="h-full flex flex-col shadow-2xl border-2 border-primary-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">문서박사</h3>
              <p className="text-xs text-white/80">AI 문서 검색 어시스턴트</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Minimize/Maximize Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={isMinimized ? "확대" : "최소화"}
            >
              {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Only show when not minimized */}
        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white">
              <div className="flex p-2 gap-2">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === 'chat'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>AI 질문하기</span>
                </button>
                <button
                  onClick={() => setActiveTab('suggestion')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === 'suggestion'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>건의하기</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className={activeTab === 'chat' ? 'block' : 'hidden'}>
                <ChatTab />
              </div>
              <div className={activeTab === 'suggestion' ? 'block' : 'hidden'}>
                <SuggestionTab />
              </div>
            </div>
          </>
        )}
        
        {/* Minimized View */}
        {isMinimized && (
          <div className="flex-1 flex items-center px-4">
            <p className="text-sm text-gray-600">문서박사 챗봇</p>
          </div>
        )}
      </Card>
    </div>
  )
}

