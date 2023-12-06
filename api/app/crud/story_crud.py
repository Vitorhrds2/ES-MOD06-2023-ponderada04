from sqlalchemy.orm import Session
from ..models import Story
from ..schemas import StoryCreate

def create_story(db: Session, story: StoryCreate):
    db_story = Story(**story.model_dump())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

def get_stories(db: Session):
    return db.query(Story).all()

def get_story(db: Session, story_id: int):
    return db.query(Story).filter(Story.id == story_id).first()

def update_story(db: Session, story_id: int, updated_story: StoryCreate):
    db_story = db.query(Story).filter(Story.id == story_id).first()
    for key, value in updated_story.dict(exclude_unset=True).items():
        setattr(db_story, key, value)
    db.commit()
    db.refresh(db_story)
    return db_story

def delete_story(db: Session, story_id: int):
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story:
        db.delete(db_story)
        db.commit()
    return db_story
