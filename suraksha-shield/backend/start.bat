@echo off
python -m venv venv
call venv\Scripts\activate
pip install fastapi uvicorn pydantic sqlalchemy
uvicorn app.main:app --reload --port 8000
