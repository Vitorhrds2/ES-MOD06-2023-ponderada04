from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from app import crud, models, schemas, database
from app.crud.user_crud import create_user
from app.crud.story_crud import create_story
from app.utils.chatgpt import generate_story_part

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/stories/", response_model=schemas.Story)
def create_story(story: schemas.StoryCreate, db: Session = Depends(get_db)):
    return crud.create_story(db=db, story=story)

@app.get("/stories/{story_id}", response_model=schemas.Story)
def read_story(story_id: int, db: Session = Depends(get_db)):
    return crud.get_story(db=db, story_id=story_id)

@app.put("/stories/{story_id}", response_model=schemas.Story)
def update_story(story_id: int, story: schemas.StoryCreate, db: Session = Depends(get_db)):
    return crud.update_story(db=db, story_id=story_id, updated_story=story)

@app.delete("/stories/{story_id}", response_model=schemas.Story)
def delete_story(story_id: int, db: Session = Depends(get_db)):
    return crud.delete_story(db=db, story_id=story_id)

from fastapi import HTTPException, status

@app.post("/stories/{story_id}/add_part", response_model=schemas.Story)
def add_story_part(story_id: int, prompt: str, db: Session = Depends(get_db)):
    story = crud.get_story(db=db, story_id=story_id)
    if story:
        new_part = generate_story_part(prompt)
        if new_part:
            story.content += "\n" + new_part
            db.commit()
            db.refresh(story)
            return story
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    return crud.get_user(db=db, user_id=user_id)

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.update_user(db=db, user_id=user_id, updated_user=user)

@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return crud.delete_user(db=db, user_id=user_id)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
