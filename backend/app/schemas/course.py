from pydantic import BaseModel, Field

class CourseIn(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    description: str

class CourseUserMatchOut(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    description: str
    username: str
    user_id: int
    preferred_match: bool
    possible_match: bool


class CourseGroupMatchOut(BaseModel):
    name: str = Field(min_length=1, max_length=30)
    description: str
    group_name: str
    group_id: int
    preferred_match: bool
    possible_match: bool