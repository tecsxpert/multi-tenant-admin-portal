# Multi-Tenant Admin Portal

A full-stack application featuring a Spring Boot backend, a Flask AI service, and a React frontend.

## Project Structure

```text
multi-tenant-admin-portal/
|-- backend/               <- Spring Boot project
|   |-- src/main/java/com/internship/tool/
|   |   |-- controller/    <- REST endpoints
|   |   |-- service/       <- Business logic
|   |   |-- repository/    <- DB queries
|   |   |-- entity/        <- JPA table models
|   |   |-- config/        <- Security, Redis, Mail
|   |   +-- exception/     <- Custom exceptions
|   |-- src/main/resources/
|   |   |-- db/migration/  <- V1__init.sql, V2__...
|   |   +-- application.yml <- All config (env variable references)
|   +-- pom.xml
|
|-- ai-service/            <- Flask Python microservice
|   |-- routes/            <- endpoint files
|   |-- services/          <- groq_client.py
|   |-- prompts/           <- prompt template text files
|   |-- app.py
|   |-- Dockerfile
|   +-- requirements.txt
|
|-- frontend/              <- React + Vite frontend
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|   |   +-- App.jsx
|   +-- package.json
|
|-- docker-compose.yml
|-- .env.example
+-- README.md
```

## Getting Started

### Prerequisites
- Java 17
- Node.js & npm
- Python 3.9+
- Docker & Docker Compose

### Setup

1. **Backend:**
   ```bash
   cd backend
   mvn clean install
   ```

2. **AI Service:**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```