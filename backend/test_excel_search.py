"""
엑셀 검색 테스트 스크립트
업로드된 엑셀 파일에서 특정 키워드가 제대로 검색되는지 테스트
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.services.file_processor import FileProcessor
from app.services.rag_service import RAGService
from dotenv import load_dotenv

load_dotenv()

def test_excel_search():
    print("=" * 80)
    print("🔍 엑셀 파일 검색 테스트")
    print("=" * 80)
    
    # 테스트할 엑셀 파일 경로 입력
    excel_path = input("\n엑셀 파일 경로를 입력하세요 (또는 Enter로 샘플 사용): ").strip()
    
    if not excel_path:
        # 샘플 파일 사용
        excel_path = "../test_data/프로젝트_관리_데이터.xlsx"
        print(f"샘플 파일 사용: {excel_path}")
    
    if not os.path.exists(excel_path):
        print(f"❌ 파일을 찾을 수 없습니다: {excel_path}")
        return
    
    print(f"\n📄 파일 처리 중: {excel_path}")
    
    try:
        # 1. 텍스트 추출
        print("\n1️⃣ 엑셀 → 텍스트 변환 중...")
        text = FileProcessor.extract_text(excel_path)
        
        print(f"✅ 추출된 텍스트 길이: {len(text)} 글자")
        print(f"\n📝 추출된 텍스트 샘플 (처음 500자):")
        print("-" * 80)
        print(text[:500])
        print("-" * 80)
        
        # 2. 키워드 검색 테스트
        keyword = input("\n검색할 키워드를 입력하세요 (예: TOMMS): ").strip() or "TOMMS"
        
        print(f"\n2️⃣ '{keyword}' 키워드 검색 중...")
        
        # 대소문자 구분 없이 검색
        if keyword.lower() in text.lower():
            # 키워드가 포함된 줄 찾기
            lines = text.split('\n')
            matching_lines = []
            for i, line in enumerate(lines, 1):
                if keyword.lower() in line.lower():
                    matching_lines.append((i, line.strip()))
            
            print(f"✅ '{keyword}' 키워드 발견! ({len(matching_lines)}개 위치)")
            print("\n매칭된 줄:")
            for line_num, line in matching_lines[:10]:  # 처음 10개만 표시
                print(f"  줄 {line_num}: {line[:100]}...")
        else:
            print(f"❌ '{keyword}' 키워드를 찾을 수 없습니다.")
            print("\n💡 Tip: 엑셀 파일에 해당 키워드가 정확히 포함되어 있는지 확인하세요.")
        
        # 3. RAG 시스템에 추가 테스트
        print(f"\n3️⃣ RAG 시스템에 문서 추가 테스트...")
        rag = RAGService()
        
        filename = os.path.basename(excel_path)
        rag.add_documents(text, filename)
        print(f"✅ 문서가 벡터 DB에 추가되었습니다.")
        
        # 4. RAG 검색 테스트
        print(f"\n4️⃣ RAG 시스템으로 '{keyword}' 검색...")
        search_results = rag.search_documents(keyword, k=5)
        
        if search_results:
            print(f"✅ 검색 결과: {len(search_results)}개 발견")
            for i, result in enumerate(search_results, 1):
                print(f"\n결과 {i}:")
                print(f"  출처: {result['source']}")
                print(f"  유사도: {result['score']:.4f}")
                print(f"  내용: {result['content'][:200]}...")
        else:
            print(f"❌ RAG 검색 결과 없음")
        
        # 5. 전체 질의응답 테스트
        print(f"\n5️⃣ 전체 질의응답 테스트...")
        question = f"{keyword} 프로젝트 테스트과제에 대해 설명해줘"
        print(f"질문: {question}")
        
        result = rag.query(question)
        print(f"\n답변:\n{result['answer']}")
        print(f"\n출처: {', '.join(result['sources'])}")
        
    except Exception as e:
        print(f"❌ 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_excel_search()

