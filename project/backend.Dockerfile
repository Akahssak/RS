# Backend Dockerfile for Flask API
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY api/ ./api/
COPY attt-f09c4-firebase-adminsdk-fbsvc-644355e9cb.json ./

ENV FLASK_APP=api/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=production

EXPOSE 5000

CMD ["flask", "run"]
