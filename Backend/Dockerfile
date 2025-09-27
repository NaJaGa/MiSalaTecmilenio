FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /Backend

COPY requirements.txt /Backend/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /Backend/