import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
              <svg className="w-20 h-20 text-doctor-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-3">문서박사</h1>
          <p className="text-xl text-gray-600">AI 기반 문서 검색 및 관리 시스템</p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* User Mode Card */}
          <button
            onClick={() => navigate('/user')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">사용자 모드</h2>
              <p className="text-gray-600 text-center">
                문서 검색 및 질문하기<br/>
                건의사항 제출
              </p>
            </div>
          </button>

          {/* Admin Mode Card */}
          <button
            onClick={() => navigate('/admin')}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="flex flex-col items-center">
              <div className="mb-6 p-4 bg-gray-700 rounded-full group-hover:bg-gray-800 transition-colors">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">관리자 모드</h2>
              <p className="text-gray-600 text-center">
                문서 업로드 및 관리<br/>
                VOC 현황 조회
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>AI 기반 문서 검색 시스템으로 빠르고 정확한 정보를 찾아보세요</p>
        </div>
      </div>
    </div>
  )
}

