### IMPORTANT, THIS IMAGE CAN ONLY BE RUN IN LINUX DOCKER
### You will run into a segfault in mac
FROM python:3.11.6-slim-bookworm as base

# Install poetry
RUN pip install pipx
RUN python3 -m pipx ensurepath
RUN pipx install poetry
ENV PATH="/root/.local/bin:$PATH"
ENV PATH=".venv/bin/:$PATH"

# Dependencies to build llama-cpp
RUN apt update && apt install -y \
  libopenblas-dev\
  ninja-build\
  build-essential\
  pkg-config\
  wget

# https://python-poetry.org/docs/configuration/#virtualenvsin-project
ENV POETRY_VIRTUALENVS_IN_PROJECT=true

FROM base as dependencies
WORKDIR /home/worker/app
COPY pyproject.toml poetry.lock ./
# COPY sqlite.db ./
RUN poetry install --with local
RUN poetry install --extras chroma
# RUN chmod 777 sqlite.db

FROM base as app

ENV PYTHONUNBUFFERED=1
ENV PORT=8080
EXPOSE 8080

# Prepare a non-root user
RUN adduser worker
WORKDIR /home/worker/app

RUN mkdir local_data; chown worker local_data
RUN mkdir models; chown worker models
# RUN touch sqlite.db && chmod a+rw sqlite.db
# Set permissions for the working directory and SQLite database file
RUN chown -R worker:worker /home/worker/app
COPY sqlite.db ./
RUN chmod ugo+rw /home/worker/app/sqlite.db

COPY --chown=worker --from=dependencies /home/worker/app/.venv/ .venv
COPY --chown=worker auth_RAG/ auth_RAG
COPY --chown=worker *.yaml *.md ./
COPY --chown=worker scripts/ scripts
ENV PYTHONPATH="$PYTHONPATH:/auth_RAG/"

USER worker
ENTRYPOINT python -m auth_RAG 