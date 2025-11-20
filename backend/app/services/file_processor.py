import os
from typing import List
from pathlib import Path
import PyPDF2
from pptx import Presentation
from openpyxl import load_workbook
from docx import Document


class FileProcessor:
    """파일에서 텍스트를 추출하는 클래스"""
    
    @staticmethod
    def extract_text(file_path: str) -> str:
        """파일 확장자에 따라 텍스트 추출"""
        extension = Path(file_path).suffix.lower()
        
        try:
            if extension == '.txt':
                return FileProcessor._extract_from_txt(file_path)
            elif extension == '.pdf':
                return FileProcessor._extract_from_pdf(file_path)
            elif extension in ['.pptx', '.ppt']:
                return FileProcessor._extract_from_pptx(file_path)
            elif extension in ['.xlsx', '.xls']:
                return FileProcessor._extract_from_xlsx(file_path)
            elif extension in ['.docx', '.doc']:
                return FileProcessor._extract_from_docx(file_path)
            else:
                raise ValueError(f"지원하지 않는 파일 형식: {extension}")
        except Exception as e:
            raise Exception(f"파일 처리 중 오류 발생: {str(e)}")
    
    @staticmethod
    def _extract_from_txt(file_path: str) -> str:
        """TXT 파일에서 텍스트 추출"""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    
    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        """PDF 파일에서 텍스트 추출"""
        text = []
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page in pdf_reader.pages:
                text.append(page.extract_text())
        return '\n'.join(text)
    
    @staticmethod
    def _extract_from_pptx(file_path: str) -> str:
        """PPTX 파일에서 텍스트 추출"""
        prs = Presentation(file_path)
        text = []
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text.append(shape.text)
        return '\n'.join(text)
    
    @staticmethod
    def _extract_from_xlsx(file_path: str) -> str:
        """XLSX 파일에서 텍스트 추출"""
        wb = load_workbook(file_path, data_only=True)
        text = []
        for sheet in wb:
            for row in sheet.iter_rows(values_only=True):
                row_text = [str(cell) for cell in row if cell is not None]
                if row_text:
                    text.append(' '.join(row_text))
        return '\n'.join(text)
    
    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        """DOCX 파일에서 텍스트 추출"""
        doc = Document(file_path)
        text = [paragraph.text for paragraph in doc.paragraphs]
        return '\n'.join(text)

