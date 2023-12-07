from sqlalchemy.orm import Session
from ..crud import user_crud, story_crud
from ..schemas import user_schema, story_schema

def create_user(db: Session, user: user_schema.UserCreate):
    return user_crud.create_user(db=db, user=user)

# Implemente funções semelhantes para a história
