from typing import List
from pydantic import BaseModel

class StoryBase(BaseModel):
    title: str
    description: str
    category: str
    content: str

class StoryCreate(StoryBase):
    pass

class Story(StoryBase):
    id: int

    class Config:
        orm_mode = True
