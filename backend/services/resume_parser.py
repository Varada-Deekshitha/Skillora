try:
    import fitz  # PyMuPDF
    _HAS_FITZ = True
except ImportError:
    _HAS_FITZ = False

try:
    from pypdf import PdfReader
    _HAS_PYPDF = True
except ImportError:
    _HAS_PYPDF = False


def extract_text(file) -> str:
    data = file.file.read()

    # Try PyMuPDF first
    if _HAS_FITZ:
        pdf = fitz.open(stream=data, filetype="pdf")
        return "".join(page.get_text() for page in pdf)

    # Fallback to pypdf
    if _HAS_PYPDF:
        import io
        reader = PdfReader(io.BytesIO(data))
        return "".join(p.extract_text() or "" for p in reader.pages)

    raise RuntimeError("No PDF library available. Install PyMuPDF or pypdf.")
