import { useState } from 'react'
import { MessageCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ChatbotWidget from '../components/ChatbotWidget'

export default function InitialPage() {
  const navigate = useNavigate()
  const [showChatbot, setShowChatbot] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="HPLM" className="h-8" onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }} />
            <div className="font-bold text-xl text-orange-600 hidden">HPLM</div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Admin Mode Button */}
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">관리자 모드</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <span className="text-sm font-medium">HPLM</span>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Logout</button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm">
              <option>KOREAN</option>
            </select>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-20 top-10">
            <svg className="w-32 h-32 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div className="absolute right-40 bottom-10">
            <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-light text-gray-800 mb-2">Hanwha HPLM System</h1>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Menu Sidebar */}
        <div className="flex gap-6">
          <aside className="w-64 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-orange-500 font-bold text-lg">Menu</h2>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <nav className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer">
                <span className="text-sm">📁 과제관리</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer">
                <span className="text-sm">📁 문서작성</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer">
                <span className="text-sm">📁 SW변경</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer">
                <span className="text-sm">📁 제품정보</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer">
                <span className="text-sm">📁 MONITORING</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer">
                <span className="text-sm">📁 ADM</span>
                <span className="text-xs text-gray-400">▼</span>
              </div>
            </nav>
          </aside>

          {/* Dashboard Grid */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {/* 개발자금 현황 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">개발자금 현황</h3>
                <button className="text-gray-400 hover:text-gray-600">⋯</button>
              </div>
              <div className="space-y-4">
                <div className="border rounded p-4">
                  <div className="text-xs text-gray-500 mb-2">25년 물량 MM</div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">구분</th>
                        <th className="text-center">1월</th>
                        <th className="text-center">2월</th>
                        <th className="text-center">3월</th>
                        <th className="text-center">...</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">개발목적</td>
                        <td className="text-center">0</td>
                        <td className="text-center">0</td>
                        <td className="text-center">0</td>
                        <td className="text-center">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="h-40 bg-gray-50 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-sm">차트 영역</span>
                </div>
              </div>
            </div>

            {/* 공지사항 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">공지사항</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-2 px-3">제목</th>
                    <th className="text-center py-2 px-3">공지유형</th>
                    <th className="text-center py-2 px-3">시작일</th>
                    <th className="text-center py-2 px-3">종료일</th>
                    <th className="text-center py-2 px-3">등록자</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">공지사항</td>
                    <td className="text-center py-2 px-3">시스템공지</td>
                    <td className="text-center py-2 px-3 text-xs">2022-09-13</td>
                    <td className="text-center py-2 px-3 text-xs">2022-10-21</td>
                    <td className="text-center py-2 px-3">HPLM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 결재현황 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">결재현황</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded">
                  <div className="text-3xl font-bold text-orange-500 mb-2">0</div>
                  <div className="text-xs text-gray-600">기안</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-3xl font-bold text-gray-800 mb-2">0</div>
                  <div className="text-xs text-gray-600">결재 대상</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-3xl font-bold text-gray-600 mb-2">2</div>
                  <div className="text-xs text-gray-600">완료</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div>• TOMMS 프로젝트 타스크 - SW변경 심의보고 결재</div>
                <div>• TNO-71806LP - SW변경 결재</div>
              </div>
            </div>

            {/* 나의과제(PL) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">나의과제(PL)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-center py-2 px-2">NO</th>
                      <th className="text-left py-2 px-2">과제명</th>
                      <th className="text-center py-2 px-2">과제유형</th>
                      <th className="text-center py-2 px-2">과제분류</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="text-center py-2 px-2">{i}</td>
                        <td className="py-2 px-2 text-blue-600">프로젝트 {i}</td>
                        <td className="text-center py-2 px-2">개발</td>
                        <td className="text-center py-2 px-2">PI</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          title="문서박사 챗봇"
        >
          <MessageCircle className="w-8 h-8" />
          <span className="absolute -top-12 right-0 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            문서박사 챗봇
          </span>
          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75"></span>
        </button>
      )}

      {/* Chatbot Widget */}
      {showChatbot && (
        <ChatbotWidget onClose={() => setShowChatbot(false)} />
      )}
    </div>
  )
}

