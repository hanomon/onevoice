import { useState, useEffect } from 'react'
import { X, Sparkles, FileText, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { chatAPI } from '../api/client'

interface VOCAnalysisModalProps {
  voc: {
    id: number
    user_name: string
    category: string
    content: string
    created_at: string
  }
  onClose: () => void
}

export default function VOCAnalysisModal({ voc, onClose }: VOCAnalysisModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<string>('')
  const [sources, setSources] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // 모달이 열리면 자동으로 분석 시작
    analyzeVOC()
  }, [])

  const analyzeVOC = async () => {
    setIsAnalyzing(true)
    setError('')
    
    try {
      // AI에게 VOC 내용 기반 해결책 요청
      const prompt = `다음 고객 건의사항(VOC)을 분석하고 해결책을 제시해주세요.

[고객 건의사항]
카테고리: ${voc.category}
작성자: ${voc.user_name}
내용: ${voc.content}

[분석 지침]
1. VOC 내용에서 핵심 키워드를 정확히 파악하세요
2. 업로드된 문서에서 해당 키워드와 관련된 내용을 검색하세요
3. 문서에 관련 내용이 있으면 구체적인 해결책을 제시하세요
4. 문서에 해당 키워드나 관련 내용이 없다면 "죄송하지만, 업로드된 문서에서 이 건의사항과 관련된 내용을 찾을 수 없습니다. 관련 매뉴얼이나 문서를 추가로 업로드해주세요."라고 답변하세요
5. 답변은 반드시 한글로만 작성하세요

[답변 형식]
## 분석 요약
(핵심 키워드와 문제점 요약)

## 해결 방안
(문서 기반의 구체적인 해결책, 없으면 위 안내 메시지)

## 추가 참고사항
(추가로 참고할 정보, 없으면 생략)`

      const result = await chatAPI.sendMessage(prompt)
      
      setAnalysis(result.answer)
      setSources(result.sources || [])
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || '분석 중 오류가 발생했습니다')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">VOC 분석 결과</CardTitle>
                <p className="text-sm text-gray-600 mt-1">AI 기반 해결책 제시</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          {/* VOC 정보 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="info">{voc.category}</Badge>
                <span className="text-sm text-gray-600">{voc.user_name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(voc.created_at).toLocaleString('ko-KR')}
              </span>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border border-gray-100">
              {voc.content}
            </div>
          </div>

          {/* 분석 결과 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>AI 분석 결과</span>
            </div>

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 mb-2">문서를 분석하고 있습니다...</p>
                <p className="text-sm text-gray-500">업로드된 문서를 검색하여 최적의 해결책을 찾고 있습니다</p>
              </div>
            )}

            {error && (
              <Card className="bg-red-50 border-2 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <X className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isAnalyzing && analysis && (
              <>
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed" style={{ 
                        wordBreak: 'keep-all',
                        lineHeight: '1.8'
                      }}>
                        {analysis.split('\n').map((line, idx) => {
                          // 제목 스타일 (【】로 감싸진 텍스트 또는 ##로 시작)
                          if ((line.includes('【') && line.includes('】')) || line.startsWith('##')) {
                            return (
                              <div key={idx} className="font-bold text-lg text-primary-700 mt-4 mb-2 pb-2 border-b border-primary-200">
                                {line.replace(/^##\s*/, '')}
                              </div>
                            )
                          }
                          // 번호 매기기 (1., 2., 3. 등)
                          if (/^\d+\./.test(line.trim())) {
                            return (
                              <div key={idx} className="font-semibold text-gray-900 mt-3 mb-2">
                                {line}
                              </div>
                            )
                          }
                          // 불릿 포인트 (- 로 시작)
                          if (line.trim().startsWith('-')) {
                            return (
                              <div key={idx} className="ml-6 text-gray-700 mb-1 flex items-start">
                                <span className="mr-2 text-primary-500">•</span>
                                <span>{line.trim().substring(1).trim()}</span>
                              </div>
                            )
                          }
                          // 빈 줄
                          if (line.trim() === '') {
                            return <div key={idx} className="h-3"></div>
                          }
                          // 일반 텍스트
                          return (
                            <div key={idx} className="text-gray-800 mb-2">
                              {line}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {sources.length > 0 && (
                  <Card className="bg-blue-50 border border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-blue-700" />
                        <span className="text-sm font-semibold text-blue-900">참조 문서</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sources.map((source, idx) => (
                          <Badge key={idx} variant="info" className="text-xs">
                            📄 {source}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-green-50 border border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <p className="text-sm font-medium">
                        분석이 완료되었습니다. 위 내용을 참고하여 VOC를 처리해주세요.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-end gap-2 flex-shrink-0">
          {!isAnalyzing && analysis && (
            <Button
              variant="outline"
              onClick={analyzeVOC}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              재분석
            </Button>
          )}
          <Button onClick={onClose}>
            닫기
          </Button>
        </div>
      </Card>
    </div>
  )
}

