import io
import os
from typing import Tuple, Optional
from PIL import Image, ImageOps, ImageEnhance

# Check if paddleocr is available
_paddle_ocr_instance = None
_ocr_initialization_attempted = False

def get_ocr_engine():
    global _paddle_ocr_instance, _ocr_initialization_attempted
    if not _ocr_initialization_attempted:
        _ocr_initialization_attempted = True
        try:
            from paddleocr import PaddleOCR
            # Initialize with English / Indic support where available
            _paddle_ocr_instance = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
        except Exception as e:
            # Documented fallback if paddleocr binary or model is unavailable
            _paddle_ocr_instance = None
    return _paddle_ocr_instance

# Known magic bytes for file signatures
ALLOWED_SIGNATURES = {
    b"\x89PNG\r\n\x1a\n": "png",
    b"\xff\xd8\xff": "jpeg",
    b"RIFF": "webp"
}

def validate_image_file(file_bytes: bytes, filename: str) -> Tuple[bool, str]:
    if len(file_bytes) > 5 * 1024 * 1024:
        return False, "File exceeds maximum 5MB size limit."
    
    # Check magic bytes
    valid_sig = False
    for sig in ALLOWED_SIGNATURES:
        if file_bytes.startswith(sig):
            valid_sig = True
            break
        # WEBP signature has "WEBP" at byte offset 8
        if file_bytes.startswith(b"RIFF") and len(file_bytes) >= 12 and file_bytes[8:12] == b"WEBP":
            valid_sig = True
            break

    if not valid_sig:
        return False, "Invalid image format. Allowed formats: PNG, JPEG, WebP."

    return True, "Valid"

def preprocess_and_extract_text(file_bytes: bytes) -> Tuple[str, str, Optional[float], str]:
    """
    Re-encodes image with Pillow, strips EXIF/metadata, corrects orientation,
    enhances contrast, and executes OCR without ever persisting the image to disk.
    Returns: (extracted_text, engine_used, confidence, status_message)
    """
    try:
        image = Image.open(io.BytesIO(file_bytes))
        
        # 1. Auto-rotate based on EXIF orientation if present
        image = ImageOps.exif_transpose(image)
        
        # 2. Convert to RGB (strips alpha channel and EXIF when exported)
        image = image.convert("RGB")
        
        # 3. Enhance contrast to improve OCR detection on SMS screens
        enhancer = ImageEnhance.Contrast(image)
        enhanced_image = enhancer.enhance(1.4)
        
        # In-memory buffer
        img_byte_arr = io.BytesIO()
        enhanced_image.save(img_byte_arr, format='JPEG', quality=95)
        clean_bytes = img_byte_arr.getvalue()
        
    except Exception as e:
        return "", "pillow", None, f"Failed to process image: {str(e)}"

    ocr_engine = get_ocr_engine()
    if ocr_engine is not None:
        try:
            import numpy as np
            np_img = np.array(enhanced_image)
            result = ocr_engine.ocr(np_img, cls=True)
            lines = []
            confidences = []
            if result and result[0]:
                for line in result[0]:
                    text = line[1][0]
                    conf = line[1][1]
                    lines.append(text)
                    confidences.append(conf)
            avg_conf = sum(confidences) / len(confidences) if confidences else 0.0
            return "\n".join(lines), "PaddleOCR", round(avg_conf, 2), "success"
        except Exception as e:
            return "", "PaddleOCR (Fallback)", None, f"OCR processing encountered an error: {str(e)}"
    else:
        # Documented fallback when PaddleOCR native binaries are unavailable
        return (
            "",
            "None (PaddleOCR unavailable in current environment)",
            None,
            "PaddleOCR native models are not loaded in this environment. Please enter or review the message text manually in the scanner box."
        )
