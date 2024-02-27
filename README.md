# Authorization-Based Data Access for RAG-Enabled Generative AI (On-Premises)

## Description
This project introduces a demo application that showcases the integration of access control mechanisms and retrieval augmented generation (RAG) for a Generative AI system dealing with substance data. xxxx


## Usage Instructions

After a successful installation and launch of the project, follow the steps below to explore and interact with the system:

**1. Login Credentials:**
   - **Username:** root
   - **Password:** root

**2. System Features:**
   - **User Management:** Access and manage user accounts.
   - **Knowledge Management:** manage knowledge base and permissions.
   - **Chat with System:** Engage in conversations with the system for information retrieval.

**3. Pre-Loaded Knowledge based:**
   - The system comes pre-loaded with three health profiles related to heart issues:
     - **Ava Thompson:** Valvular Heart Disease (*Ava Thompson - Valvular Heart Disease.docx*)
     - **Ethan Rodriguez:** Diseased Heart Muscle (Cardiomyopathy) (*Ethan Rodriguez - Diseased Heart Muscle (Cardiomyopathy).docx*)
     - **Olivia Turner:** Congenital Heart Defects (*Olivia Turner - Congenital Heart Defects.docx*)

**4. Example Questions:**

     - What symptoms does Ava Thompson have?
     - What symptoms does Olivia Turner have?
     - What symptoms do Ava Thompson and Olivia Turner have?



## Installation
### Docker Installation
1. Clone this repository to your local machine and navigate to the project.
```bash
git clone https://github.com/bingxiangch/thesis_auth_rag.git
cd thesis_auth_rag
```
2. Build image:
```bash
docker-compose build
```

3. Run setup in service script to download local models
```bash
docker compose run --rm --entrypoint="bash -c '[ -f scripts/setup ] && scripts/setup'" backend
```
4. Run the service:
```bash
docker-compose up
```
This will start both the frontend and backend services.
5. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:8001

### Local Installation
If you want to run the application in your machine without using Docker, follw these steps:
#### Frontend
*Prerequisites:* Node.js and npm installed on your system.
1. Navigate to frontend directory and Install project dependencies
```bash
cd frontend
npm install
```
2. Start the application
```bash
npm start
```
The server will be accessible at http://localhost:3000.

#### Backend
*Prerequisites:* python3.11, macOS or Linux system
#### quickstart in few lines: 
```bash
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup
#Laucn the server
poetry run python3.11 -m auth_RAG
```
#### Step-by-Step Setup:
1. Navigate to backend directory
```bash
cd backend
```
2. Set Up Virtual Environment
```bash
python3.11 -m venv .venv
source .venv/bin/activate
```
3. Install Dependencies with Poetry
```bash
pip install --upgrade pip poetry
poetry install --with local
poetry install --extras chroma
```
4. Run Setup Script
```bash
./scripts/setup
```
5. Launch Server
```bash
poetry run python3.11 -m auth_RAG
```
The server will be accessible at http://localhost:8001.

The API documentation is available at http://127.0.0.1:8001/docs/. Explore the endpoints and interact with the API using the Swagger documentation.
