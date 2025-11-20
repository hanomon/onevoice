import { useState } from 'react'
import { Upload, MessageCircle, FileText, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import UploadTab from '../components/UploadTab'
import VOCTab from '../components/VOCTab'
import { useQuery } from '@tanstack/react-query'
import { uploadAPI, vocAPI } from '../api/client'

export default function AdminModePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'voc'>('upload')
  
  const { data: files } = useQuery({
    queryKey: ['uploadedFiles'],
    queryFn: uploadAPI.getFiles
  })
  
  const { data: vocs } = useQuery({
    queryKey: ['vocs'],
    queryFn: vocAPI.getAll
  })

  const totalFiles = files?.length || 0
  const processedFiles = files?.filter((f: any) => f.processed === 1).length || 0
  const totalVocs = vocs?.length || 0

  return (
    <DashboardLayout title="관리자 모드" mode="admin">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">관리자 대시보드</h2>
        <p className="text-gray-600">문서 관리 및 사용자 피드백 분석</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="총 문서 수"
          value={totalFiles}
          icon={<FileText className="w-6 h-6" />}
        />
        <StatCard
          title="처리 완료"
          value={processedFiles}
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: `${totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0}%`, isPositive: true }}
        />
        <StatCard
          title="VOC 접수"
          value={totalVocs}
          icon={<MessageCircle className="w-6 h-6" />}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <Card className="p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>문서 업로드</span>
            </button>
            <button
              onClick={() => setActiveTab('voc')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200 ${
                activeTab === 'voc'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>VOC 현황</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="transition-all duration-300">
        {activeTab === 'upload' ? <UploadTab /> : <VOCTab />}
      </div>
    </DashboardLayout>
  )
}

