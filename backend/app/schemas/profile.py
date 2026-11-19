from typing import Literal
from pydantic import BaseModel, Field, model_validator

from .course import CourseIn

class BlockIn(BaseModel):
    day: int = Field(ge=0, le=6) # 0 = Sunday | ge -> greater or equal to
    preferred: int = Field(ge=0, lt=16777215) # 2^24-1
    possible: int = Field(ge=0, lt=16777215)

    # ensure that users input their time slots correctly
    @model_validator(mode="after")
    def end_after_start(self):
        if self.time_end <= self.time_start:
            raise ValueError("time_end must be after time_start")
        return self

class OnboardingIn(BaseModel):
    campus: str = Field(min_length=1)
    year: str = ""
    major: str = ""
    courses: list[CourseIn] = Field(min_length=1, max_length=30)
    goals: list[str] = []
    style: list[str] = []
    availability: list[BlockIn] = Field(min_length=1, max_length=91)
    session_length: str = ""
    group_size: str = ""
    places: list[str] = []