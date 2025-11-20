import { useNavigate } from 'react-router-dom'
import { Users, Settings, FileText, TrendingUp, Search, MessageSquare, Home } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Back to HPLM Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg border border-gray-200"
        title="HPLM 시스템으로 돌아가기"
      >
        <Home className="w-4 h-4" />
        <span className="text-sm font-medium">HPLM 시스템</span>
      </button>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 pt-12">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <FileText className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
            문서박사
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-3">
            Enterprise Document Management System
          </p>
          <p className="text-base text-gray-500">
            AI 기반 지능형 문서 검색 및 관리 플랫폼
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* User Mode Card */}
            <div 
              onClick={() => navigate('/user')}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
            >
              <Card className="h-full hover:shadow-xl border-2 hover:border-primary-300">
                <CardContent className="p-8">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">사용자 모드</h2>
                    <p className="text-gray-600 mb-6 flex-1">
                      문서를 검색하고 AI와 대화하며 건의사항을 제출하세요
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Search className="w-4 h-4 mr-2 text-primary-500" />
                        <span>AI 기반 문서 검색</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4 mr-2 text-primary-500" />
                        <span>실시간 질문 & 답변</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2 text-primary-500" />
                        <span>건의사항 제출</span>
                      </div>
                    </div>
                    
                    <div className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-md text-center font-medium group-hover:bg-primary-600 transition-colors">
                      시작하기
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Mode Card */}
            <div 
              onClick={() => navigate('/admin')}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
            >
              <Card className="h-full hover:shadow-xl border-2 hover:border-purple-300">
                <CardContent className="p-8">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Settings className="w-8 h-8 text-white" />
                      </div>
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">관리자 모드</h2>
                    <p className="text-gray-600 mb-6 flex-1">
                      문서를 관리하고 사용자 피드백을 확인하세요
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2 text-purple-500" />
                        <span>문서 업로드 & 관리</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                        <span>VOC 현황 분석</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Settings className="w-4 h-4 mr-2 text-purple-500" />
                        <span>시스템 설정</span>
                      </div>
                    </div>
                    
                    <div className="w-full mt-6 px-6 py-3 bg-purple-600 text-white rounded-md text-center font-medium group-hover:bg-purple-700 transition-colors">
                      관리 시작
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">주요 기능</h3>
            <p className="text-gray-600">최신 AI 기술로 구동되는 강력한 문서 관리 시스템</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">지능형 검색</h4>
                <p className="text-sm text-gray-600">AI 기반 시맨틱 검색으로 정확한 정보를 빠르게 찾습니다</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">대화형 AI</h4>
                <p className="text-sm text-gray-600">자연어로 질문하고 즉시 답변을 받으세요</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">실시간 분석</h4>
                <p className="text-sm text-gray-600">사용자 피드백을 실시간으로 모니터링하고 분석합니다</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © 2024 문서박사. 모든 권리 보유.
          </p>
        </div>
      </div>
    </div>
  )
}

