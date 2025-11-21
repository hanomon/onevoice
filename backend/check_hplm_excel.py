"""
HPLM 솔루션 과제정보.xlsx 파일 검증 스크립트
"물류향 BCR 카메라" 키워드가 제대로 추출되는지 확인
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.services.file_processor import FileProcessor

def check_hplm_excel():
    print("=" * 80)
    print("🔍 HPLM 솔루션 과제정보.xlsx 파일 검증")
    print("=" * 80)
    
    excel_path = "uploads/HPLM 솔루션 과제정보.xlsx"
    
    if not os.path.exists(excel_path):
        print(f"❌ 파일을 찾을 수 없습니다: {excel_path}")
        return
    
    print(f"\n📄 파일 경로: {excel_path}")
    print(f"📦 파일 크기: {os.path.getsize(excel_path) / 1024:.2f} KB")
    
    try:
        # 1. 텍스트 추출
        print("\n1️⃣ 엑셀 → 텍스트 변환 중...")
        text = FileProcessor.extract_text(excel_path)
        
        print(f"✅ 추출된 텍스트 길이: {len(text):,} 글자")
        
        # 2. 전체 텍스트 샘플 출력
        print(f"\n📝 추출된 텍스트 샘플 (처음 1000자):")
        print("-" * 80)
        print(text[:1000])
        print("-" * 80)
        
        # 3. "물류향 BCR 카메라" 키워드 검색
        keywords = ["물류향 BCR 카메라", "물류향", "BCR", "카메라", "물류"]
        
        print(f"\n2️⃣ 키워드 검색 테스트")
        print("-" * 80)
        
        for keyword in keywords:
            if keyword in text:
                # 키워드가 포함된 줄 찾기
                lines = text.split('\n')
                matching_lines = []
                for i, line in enumerate(lines, 1):
                    if keyword in line:
                        matching_lines.append((i, line.strip()))
                
                print(f"\n✅ '{keyword}' 키워드 발견! ({len(matching_lines)}개 위치)")
                print("\n매칭된 줄 (최대 5개):")
                for line_num, line in matching_lines[:5]:
                    if len(line) > 100:
                        print(f"  줄 {line_num}: {line[:100]}...")
                    else:
                        print(f"  줄 {line_num}: {line}")
            else:
                print(f"❌ '{keyword}' 키워드를 찾을 수 없습니다.")
        
        # 4. 시트 구조 확인
        print(f"\n3️⃣ 시트 구조 확인")
        print("-" * 80)
        
        # "시트명:"으로 시작하는 줄 찾기
        lines = text.split('\n')
        sheet_names = []
        for line in lines:
            if line.strip().startswith("시트명:"):
                sheet_name = line.strip().replace("시트명:", "").strip()
                sheet_names.append(sheet_name)
        
        if sheet_names:
            print(f"발견된 시트: {len(sheet_names)}개")
            for i, name in enumerate(sheet_names, 1):
                print(f"  {i}. {name}")
        else:
            print("시트명 정보를 찾을 수 없습니다.")
        
        # 5. 특정 키워드 주변 컨텍스트 찾기
        print(f"\n4️⃣ '물류' 키워드 주변 내용 (500자)")
        print("-" * 80)
        
        if "물류" in text:
            index = text.find("물류")
            start = max(0, index - 250)
            end = min(len(text), index + 250)
            context = text[start:end]
            print(context)
        else:
            print("'물류' 키워드를 찾을 수 없습니다.")
        
        # 6. 결론 및 권장사항
        print(f"\n5️⃣ 진단 결과 및 권장사항")
        print("=" * 80)
        
        if "물류향 BCR 카메라" in text:
            print("✅ 상태: 정상 - 키워드가 정확히 존재합니다.")
            print("\n💡 권장사항:")
            print("   1. 질문 시 정확한 키워드 사용:")
            print('      "물류향 BCR 카메라 과제에 대해 설명해줘"')
            print("   2. 파일 재업로드 후 1~2분 대기")
            print("   3. 더 구체적으로 질문:")
            print('      "물류향 BCR 카메라의 목적은?"')
        elif "물류" in text or "BCR" in text or "카메라" in text:
            print("⚠️ 상태: 부분 매칭 - 일부 키워드만 존재합니다.")
            print("\n💡 권장사항:")
            print("   1. 엑셀 파일에서 정확한 표기 확인")
            print('      예: "물류용 BCR 카메라" vs "물류향 BCR 카메라"')
            print("   2. 질문 시 실제 표기된 키워드 사용")
            print("   3. 여러 키워드로 질문:")
            print('      "물류 관련 카메라 과제", "BCR 카메라 프로젝트"')
        else:
            print("❌ 상태: 키워드 없음 - 해당 키워드가 존재하지 않습니다.")
            print("\n💡 권장사항:")
            print("   1. 엑셀 파일 내용 재확인 필요")
            print("   2. 시트 이름이나 다른 열에 정보가 있는지 확인")
            print("   3. 올바른 엑셀 파일이 업로드되었는지 확인")
        
        print("\n" + "=" * 80)
        
    except Exception as e:
        print(f"❌ 오류 발생: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_hplm_excel()

