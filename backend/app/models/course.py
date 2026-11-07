from pydantic import BaseModel, Field

class CourseIn(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    description: str

class CourseMatchOut(BaseModel):
    pass