from sqlalchemy.orm import Session
from ..models import User
from ..schemas import UserCreate

def create_user(db: Session, user: UserCreate):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    return db_user

def update_user(db: Session, user_id: int, updated_user: UserCreate):
    db_user = db.query(User).filter(User.id == user_id).first()
    for key, value in updated_user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    db.delete(db_user)
    db.commit()
