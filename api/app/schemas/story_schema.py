from typing import List
from pydantic import BaseModel

class StoryBase(BaseModel):
    title: str
    description: str
    category: str
    content: str

class StoryCreate(StoryBase):
    id: int
    pass

class Story(StoryBase):

    class Config:
        orm_mode = True