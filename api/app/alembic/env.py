# api/app/alembic/env.py

from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import sys
from pathlib import Path

# Adicione o diretório do seu aplicativo ao caminho do sistema
sys.path.append(str(Path(__file__).resolve().parents[2]))

# Ajuste o caminho para importar os modelos da sua aplicação
from app.database import Base  # Substitua isso pelo caminho correto

# Configuração do logger
try:
    fileConfig(context.config.config_file_name, disable_existing_loggers=False)
except KeyError:
    pass

# Isso é necessário para que o Alembic saiba onde encontrar os modelos
# Caso você tenha outros modelos, importe-os aqui
from app.models.user import User  # Substitua isso pelo caminho correto

# Adicione seus modelos ao target_metadata
target_metadata = [User.metadata]  # Substitua isso pelo caminho correto

# Configuração do contexto do Alembic
context.configure(
    target_metadata=target_metadata,
    # outros ajustes...
    url="sqlite:///./test.db"  # Adicione esta linha
)
