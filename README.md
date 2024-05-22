# Authorization-Based Data Access for RAG-Enabled Generative AI (On-Premises)

## Description
This project introduces a demo application that showcases the integration of access control mechanisms and retrieval augmented generation (RAG) for resttricting data between different users


## Usage Instructions
   <!-- - **Live Demo:** 

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
   - The system comes pre-loaded with five health profiles related to health issues, available in the /docs folder::
     - Anna Martinez.docx  Emily White.docx
     - Mark Lee.docx       John Carter.docx 
     - Lisa Nguyen.docx   
can be found on /docs folder

**4. Example Questions:**

     - what symptoms does Mark Lee have?
     - Provide Mark Lee's Family medical history
     - Provide the names of all patients that you can access
     - mitä oireita Matti Virtasella ja Anna Mäkelä on? (tested with GPT3.5 mode)
### Local Installation
If you want to run the application in your local machine without using Docker, follw these steps:

*Prerequisites:* python3.11, macOS or Linux system, Node.js and npm
### Quickstart
1. Clone the project and navigate to project-folder
```bash
git clone https://github.com/bingxiangch/thesis_auth_rag.git
cd thesis_auth_rag
```
2. Set huggingface access token (Set your hf_token):
```bash
./update_hf_token.sh hf_token
```

3. (Optional) if you want to use gpt3.5 mode for Finnish language testing, Run the script `set_llm_mode_api_key.sh` with the following arguments:
```bash
./set_llm_mode_api_key.sh llm_mode [api_key]
```
llm_mode: Desired Language Model (LLM) mode. Possible values are local, openai.
Presenting Mistral-7B and GPT3.5."

api_key: (Optional) API key for accessing OpenAI's GPT-3.5 model.


Or edit backend/settings.yaml file:
```bash
llm:
  mode: openai
openai:
  api_key: api_key
  model: gpt-3.5-turbo
```

To run the project using Azure OpenAI:
Edit the backend/settings.yaml file:
```bash
llm:
  mode: azureOpenai
azure:
  model: gpt-4
  deployment_name: YOUR_DEPLOYMENT_NAME
  api_key: API_KEY
  azure_endpoint: YOUR_AZURE_OPENAI
  api_version: '2024-02-15-preview'

```


4. Run Setup Script

On Mac
```bash
./setup_and_run.sh
```
On Linux with GPU Support
```bash
./setup_and_run_GPU.sh
```

To set up the project quickly, without reinstalling packages
```bash
./setup.sh
```

### Docker Installation 
Docker Installation with NVIDIA GPU Support(Running project on GPU)

tested on: Windows Subsystem Linux ( Ubuntu 22.04 )

*Prerequisites:* 
Install CUDA toolkit from [NVIDIA CUDA Downloads](https://developer.nvidia.com/cuda-downloads)
you can also run this command before running docker-compose
```bash
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```
Verify your installation is correct by running `nvidia-smi`, ensure your CUDA version is up to date and your GPU is detected.

To upgrade your Docker Engine on Ubuntu, please refer to the instructions
https://docs.docker.com/engine/install/ubuntu/

Steps:
1. Clone this repository to your local machine and navigate to the project.
```bash
git clone https://github.com/bingxiangch/thesis_auth_rag.git
cd thesis_auth_rag
```
2. Set huggingface access token (Set your hf_token):
```bash
./update_hf_token.sh hf_token
```
3. (Optional) (Optional) if you want to use gpt3.5 mode for Finnish language testing, Run the script `set_llm_mode_api_key.sh` with the following arguments:
```bash
./set_llm_mode_api_key.sh llm_mode [api_key]
```
llm_mode: Desired Language Model (LLM) mode. Possible values are local, openai

Or edit backend/settings.yaml file:
```bash
llm:
  mode: openai
openai:
  api_key: api_key
  model: gpt-3.5-turbo
```

To run the project using Azure OpenAI:
Edit the backend/settings.yaml file:
```bash
llm:
  mode: azureOpenai
azure:
  model: gpt-4
  deployment_name: YOUR_DEPLOYMENT_NAME
  api_key: API_KEY
  azure_endpoint: YOUR_AZURE_OPENAI
  api_version: '2024-02-15-preview'

```

4. Run the following Docker command for GPU support:
```bash
docker compose -f docker-compose.gpu.yaml up --build
```
5. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:8001


### Step-by-Step Setup:
#### Backend
*Prerequisites:* python3.11, macOS or Linux system
1. Set huggingface access token (Set your hf_token):
```bash
./update_hf_token.sh hf_token
```

2. (Optional) (Optional) if you want to use gpt3.5 mode for Finnish language testing, Run the script `set_llm_mode_api_key.sh` with the following arguments:
```bash
./set_llm_mode_api_key.sh llm_mode [api_key]
```
llm_mode: Desired Language Model (LLM) mode. Possible values are local, openai

Or edit backend/settings.yaml file:
```bash
llm:
  mode: openai
openai:
  api_key: api_key
  model: gpt-3.5-turbo
```

To run the project using Azure OpenAI:
Edit the backend/settings.yaml file:
```bash
llm:
  mode: azureOpenai
azure:
  model: gpt-4
  deployment_name: YOUR_DEPLOYMENT_NAME
  api_key: API_KEY
  azure_endpoint: YOUR_AZURE_OPENAI
  api_version: '2024-02-15-preview'

```
3. Backend Setup, you need to navigate to project folder first(thesis_auth_rag):
```bash
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && \
pip install --upgrade pip poetry && poetry install --with local && poetry install --extras chroma && ./scripts/setup.py
```
4. (Optional)Llama-CPP Linux NVIDIA GPU support(Linux Only) 
```bash
CMAKE_ARGS='-DLLAMA_CUBLAS=on' poetry run pip install --force-reinstall --no-cache-dir llama-cpp-python
```
5. Launch the Backend server:
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

