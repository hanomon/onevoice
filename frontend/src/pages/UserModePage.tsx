import { useState } from 'react'
import { MessageSquare, Lightbulb } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import ChatTab from '../components/ChatTab'
import SuggestionTab from '../components/SuggestionTab'

export default function UserModePage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestion'>('chat')

  return (
    <DashboardLayout title="사용자 모드" mode="user">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">사용자 대시보드</h2>
        <p className="text-gray-600">AI 기반 문서 검색 및 건의사항 제출</p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <Card className="p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'chat'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI 질문하기</span>
            </button>
            <button
              onClick={() => setActiveTab('suggestion')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'suggestion'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>건의하기</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {activeTab === 'chat' ? <ChatTab /> : <SuggestionTab />}
      </div>
    </DashboardLayout>
  )
}

