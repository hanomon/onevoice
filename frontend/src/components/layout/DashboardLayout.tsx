import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, LogOut } from 'lucide-react'
import { Button } from '../ui/Button'

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  mode: 'user' | 'admin'
}

export function DashboardLayout({ children, title, mode }: DashboardLayoutProps) {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">문서박사</h1>
                  <p className="text-xs text-gray-500">Document Management System</p>
                </div>
              </div>
              
              <div className="hidden md:block h-8 w-px bg-gray-200 mx-2"></div>
              
              <span className={`hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === 'admin' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {mode === 'admin' ? '관리자 모드' : '사용자 모드'}
              </span>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">홈으로</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

