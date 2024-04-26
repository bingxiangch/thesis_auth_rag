# Authorization-Based Data Access for RAG-Enabled Generative AI (On-Premises)

## Description
This project introduces a demo application that showcases the integration of access control mechanisms and retrieval augmented generation (RAG) for resttricting data between different users


## Usage Instructions
   <!-- - **Live Demo:** http://34.72.240.55:3000/ 

The project is deployed on Google Compute Engine with a GPU machine type (1 x NVIDIA L4, 4 vCPU, 64GB memory, 128GB disk).


After a successful installation and launch of the project, follow the steps below to explore and interact with the system: -->

**1. Login Credentials:**
   - **Username:** root
   - **Password:** root

**2. System Features:**
   - **User Management:** Access and manage user accounts.
   - **Knowledge Management:** manage knowledge base and permissions.
   - **Chat with System:** Engage in conversations with the system for information retrieval.

**3. Pre-Loaded Knowledge based:**
   - The system comes pre-loaded with eight health profiles related to health issues, available in the /docs folder::
     - Anna Martinez.docx  Emily White.docx
     - Mark Lee.docx       Derek Johnson.docx
     - Kevin Brown.docx    Lisa Nguyen.docx
     - John Carter.docx    Rebecca Turner.docx
can be found on /docs folder

**4. Example Questions:**

     - what symptoms does Mark Lee have?
     - Provide Mark Lee's Family medical history
     - Provide the names of all patients that you can access

### Setting huggingface token
To set the Huggingface access token for downloading the model, add your token in the thesis_auth_rag/backend/settings.yaml file under the field local:access_token.


### Local Installation
If you want to run the application in your machine without using Docker, follw these steps:

*Prerequisites:* python3.11, macOS or Linux system, Node.js and npm
### Quickstart
1. Clone the project and navigate to project-folder
```bash
git clone https://github.com/bingxiangch/thesis_auth_rag.git
cd thesis_auth_rag
```
2. Run the Setup Script on MAC:
```bash
chmod +x setup_and_run.sh
./setup_and_run.sh
```
3. Run the Setup Script on Linux with GPU Support
```bash
chmod +x setup_and_run.sh
./setup_and_run_GPU.sh
```
### Docker Installation 
Docker Installation with NVIDIA GPU Support(Running project on GPU)

tested on: Windows Subsystem Linux ( Ubuntu 22.04 )

*Prerequisites:* 
Install CUDA toolkit from [NVIDIA CUDA Downloads](https://developer.nvidia.com/cuda-downloads)
run this command before running docker-compose
```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```
Verify your installation is correct by running `nvidia-smi`, ensure your CUDA version is up to date and your GPU is detected.
Steps:
1. Clone this repository to your local machine and navigate to the project.
```bash
git clone https://github.com/bingxiangch/thesis_auth_rag.git
cd thesis_auth_rag
```
2. Run the following Docker command for GPU support:
```bash
docker compose -f docker-compose.gpu.yaml up --build
```
3. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:8001

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

