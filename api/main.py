import uvicorn
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from app import crud, models, schemas, database
from app.crud.user_crud import create_user
from app.crud.story_crud import create_story
from app.utils.talktotransformer import generate_story_part

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:8000"],
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

#API de histórias
@app.post("/history/", response_model=schemas.Story)
def create_story(story: schemas.StoryCreate, db: Session = Depends(get_db)):
    return crud.create_story(db=db, story=story)

@app.get("/stories/", response_model=List[schemas.Story])
def list_stories(db: Session = Depends(get_db)):
    stories = crud.get_stories(db=db)
    return stories

@app.get("/stories/{story_id}", response_model=schemas.Story)
def read_story(story_id: int, db: Session = Depends(get_db)):
    return crud.get_story(db=db, story_id=story_id)

@app.put("/stories/{story_id}", response_model=schemas.Story)
def update_story(story_id: int, story: schemas.StoryCreate, db: Session = Depends(get_db)):
    return crud.update_story(db=db, story_id=story_id, updated_story=story)

@app.delete("/stories/{story_id}", response_model=schemas.Story)
def delete_story(story_id: int, db: Session = Depends(get_db)):
    return crud.delete_story(db=db, story_id=story_id)


@app.post("/stories/{story_id}/add_part", response_model=schemas.Story)
async def add_story_part(story_id: int, prompt: str,  request: Request, db: Session = Depends(get_db)):
    if request.method == "POST":
        story = crud.get_story(db=db, story_id=story_id)
        if story:
                    new_part = await generate_story_part(prompt)
                    if new_part:
                        story.content += new_part
                        db.commit()
                        db.refresh(story)
                        return story

    raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED, detail="Method Not Allowed")


#API de usuários
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user:
        return {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        }
    raise HTTPException(status_code=404, detail="User not found")

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.update_user(db=db, user_id=user_id, updated_user=user)

@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return crud.delete_user(db=db, user_id=user_id)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)