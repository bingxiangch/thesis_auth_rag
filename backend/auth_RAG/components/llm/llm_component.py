import logging

from injector import inject, singleton
from llama_index import set_global_tokenizer
from llama_index.llms import MockLLM
from llama_index.llms.base import LLM
from transformers import AutoTokenizer  # type: ignore

from auth_RAG.components.llm.prompt_helper import get_prompt_style
from auth_RAG.paths import models_cache_path, models_path
from auth_RAG.settings.settings import Settings

logger = logging.getLogger(__name__)


@singleton
class LLMComponent:
    llm: LLM

    @inject
    def __init__(self, settings: Settings) -> None:
        llm_mode = settings.llm.mode
        if settings.llm.tokenizer:
            set_global_tokenizer(
                AutoTokenizer.from_pretrained(
                    pretrained_model_name_or_path=settings.llm.tokenizer,
                    cache_dir=str(models_cache_path),
                )
            )

        logger.info("Initializing the LLM in mode=%s", llm_mode)
        match settings.llm.mode:
            case "local":
                from llama_index.llms import LlamaCPP

                prompt_style = get_prompt_style(settings.local.prompt_style)

                self.llm = LlamaCPP(
                    model_path=str(models_path / settings.local.llm_hf_model_file),
                    temperature=0.1,
                    max_new_tokens=settings.llm.max_new_tokens,
                    context_window=settings.llm.context_window,
                    generate_kwargs={},
                    # All to GPU
                    model_kwargs={"n_gpu_layers": -1, "offload_kqv": True},
                    # transform inputs into Llama2 format
                    messages_to_prompt=prompt_style.messages_to_prompt,
                    completion_to_prompt=prompt_style.completion_to_prompt,
                    verbose=True,
                )

