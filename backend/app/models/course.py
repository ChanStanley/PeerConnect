from pydantic import BaseModel, Field

class CourseIn(BaseModel):
    name: str = Field(min_length=1, max_length=30)

class CourseMatchOut(BaseModel):
    pass