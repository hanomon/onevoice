"""
엑셀 데이터 분석 서비스
구조화된 엑셀 데이터를 분석하고 인사이트를 제공합니다.
"""

import pandas as pd
from typing import Dict, List, Any
from pathlib import Path


class ExcelAnalyzer:
    """엑셀 파일 분석 클래스"""
    
    @staticmethod
    def analyze_excel(file_path: str) -> Dict[str, Any]:
        """
        엑셀 파일을 분석하여 메타데이터와 통계 정보 반환
        
        Returns:
            {
                "sheets": [시트 정보 리스트],
                "total_rows": 전체 행 수,
                "total_columns": 전체 열 수,
                "summary": 요약 정보
            }
        """
        try:
            # 엑셀 파일 읽기 (모든 시트)
            excel_file = pd.ExcelFile(file_path)
            
            analysis = {
                "file_name": Path(file_path).name,
                "sheet_count": len(excel_file.sheet_names),
                "sheets": [],
                "total_rows": 0,
                "total_columns": 0
            }
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                
                sheet_info = {
                    "name": sheet_name,
                    "rows": len(df),
                    "columns": len(df.columns),
                    "column_names": df.columns.tolist(),
                    "data_types": df.dtypes.astype(str).to_dict(),
                    "has_empty_cells": df.isnull().sum().sum() > 0,
                    "empty_cell_count": int(df.isnull().sum().sum())
                }
                
                # 숫자 열 통계
                numeric_columns = df.select_dtypes(include=['number']).columns.tolist()
                if numeric_columns:
                    sheet_info["numeric_stats"] = {}
                    for col in numeric_columns:
                        sheet_info["numeric_stats"][col] = {
                            "mean": float(df[col].mean()) if not df[col].isnull().all() else None,
                            "min": float(df[col].min()) if not df[col].isnull().all() else None,
                            "max": float(df[col].max()) if not df[col].isnull().all() else None,
                            "count": int(df[col].count())
                        }
                
                analysis["sheets"].append(sheet_info)
                analysis["total_rows"] += len(df)
                analysis["total_columns"] = max(analysis["total_columns"], len(df.columns))
            
            return analysis
            
        except Exception as e:
            raise Exception(f"엑셀 분석 중 오류 발생: {str(e)}")
    
    @staticmethod
    def extract_structured_data(file_path: str, sheet_name: str = None) -> List[Dict[str, Any]]:
        """
        엑셀 데이터를 구조화된 딕셔너리 리스트로 변환
        
        Args:
            file_path: 엑셀 파일 경로
            sheet_name: 시트 이름 (None이면 첫 번째 시트)
        
        Returns:
            [{"column1": value1, "column2": value2, ...}, ...]
        """
        try:
            if sheet_name:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
            else:
                df = pd.read_excel(file_path)
            
            # NaN을 None으로 변환
            df = df.where(pd.notnull(df), None)
            
            # 딕셔너리 리스트로 변환
            return df.to_dict('records')
            
        except Exception as e:
            raise Exception(f"구조화된 데이터 추출 중 오류 발생: {str(e)}")
    
    @staticmethod
    def search_in_excel(file_path: str, keyword: str) -> List[Dict[str, Any]]:
        """
        엑셀 파일 내에서 키워드 검색
        
        Args:
            file_path: 엑셀 파일 경로
            keyword: 검색할 키워드
        
        Returns:
            검색 결과 리스트 (시트명, 행번호, 매칭 내용)
        """
        try:
            excel_file = pd.ExcelFile(file_path)
            results = []
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)
                
                # 모든 열에서 키워드 검색
                for idx, row in df.iterrows():
                    for col_name, value in row.items():
                        if value is not None and keyword.lower() in str(value).lower():
                            results.append({
                                "sheet": sheet_name,
                                "row": int(idx) + 2,  # +2 because Excel starts at 1 and header is 1
                                "column": col_name,
                                "value": str(value),
                                "full_row": row.to_dict()
                            })
            
            return results
            
        except Exception as e:
            raise Exception(f"엑셀 검색 중 오류 발생: {str(e)}")
    
    @staticmethod
    def generate_summary(file_path: str) -> str:
        """
        엑셀 파일의 요약 정보를 텍스트로 생성
        
        Returns:
            엑셀 파일 요약 텍스트
        """
        try:
            analysis = ExcelAnalyzer.analyze_excel(file_path)
            
            summary_lines = []
            summary_lines.append(f"📊 엑셀 파일 분석 결과: {analysis['file_name']}")
            summary_lines.append("=" * 80)
            summary_lines.append(f"\n전체 시트 수: {analysis['sheet_count']}개")
            summary_lines.append(f"전체 데이터 행 수: {analysis['total_rows']:,}개")
            summary_lines.append("")
            
            for sheet in analysis["sheets"]:
                summary_lines.append(f"\n[시트: {sheet['name']}]")
                summary_lines.append(f"  • 행 수: {sheet['rows']:,}개")
                summary_lines.append(f"  • 열 수: {sheet['columns']}개")
                summary_lines.append(f"  • 열 이름: {', '.join(sheet['column_names'])}")
                
                if sheet.get('empty_cell_count', 0) > 0:
                    summary_lines.append(f"  • 빈 셀: {sheet['empty_cell_count']}개")
                
                if 'numeric_stats' in sheet and sheet['numeric_stats']:
                    summary_lines.append(f"  • 숫자 데이터 통계:")
                    for col, stats in sheet['numeric_stats'].items():
                        if stats['mean'] is not None:
                            summary_lines.append(f"    - {col}: 평균 {stats['mean']:.2f}, 최소 {stats['min']:.2f}, 최대 {stats['max']:.2f}")
            
            summary_lines.append("\n" + "=" * 80)
            
            return "\n".join(summary_lines)
            
        except Exception as e:
            return f"요약 생성 중 오류 발생: {str(e)}"

