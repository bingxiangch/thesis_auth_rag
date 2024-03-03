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
     - Alex Smith.docx
     - Mark Lee.docx
     - Sarah Davis.docx

**4. Example Questions:**

     - what symptoms does Alex Smith have?
     - what symptoms do Alex Smith and Mark Lee have
     - List all patients in the context

### Local Installation
If you want to run the application in your machine without using Docker, follw these steps:

*Prerequisites:* python3.11, macOS or Linux system, Node.js and npm
### Quickstart
1. Clone the project and navigate to project-folder
```bash
git clone https://github.com/bingxiangch/thesis_auth_rag.git
cd thesis_auth_rag
```
2. Run the Setup Script:
```bash
chmod +x setup_and_run.sh
./setup_and_run.sh
```

### Step-by-Step Setup:
#### Backend
*Prerequisites:* python3.11, macOS or Linux system
1. Backend Setup, you need to navigate to project folder first(thesis_auth_rag):
```bash
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup
```
2. Launch the Backend server:
```bash
poetry run python3.11 -m auth_RAG
```

#### Frontend
*Prerequisites:* Node.js and npm
1. Frontend Setup, you need to navigate to project folder first(thesis_auth_rag):
```bash
cd frontend
npm install
```
2. Start the frontend server
```bash
npm start
```
The backend server will be accessible at http://localhost:8001.
The API documentation is available at http://127.0.0.1:8001/docs/.

The frontend server will be accessible at http://localhost:3000.



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


