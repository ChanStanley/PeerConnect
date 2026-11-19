from typing import Literal
from pydantic import BaseModel, Field, model_validator, field_validator

from .course import CourseIn

class BlockIn(BaseModel):
    day: int = Field(ge=0, le=6) # 0 = Sunday | ge -> greater or equal to
    preferred: int = Field(ge=0, le=16777215) # 2^24-1
    possible: int = Field(ge=0, le=16777215)

    # ensure that users input their time slots correctly
    @model_validator(mode="after")
    def check_bits(self):
        if self.preferred & self.possible:
            raise ValueError("An hour can't be both preferred and possible")
        if not (self.preferred | self.possible):
            raise ValueError("Pick at least one hour for each day listed")
        return self

class OnboardingIn(BaseModel):
    campus: str = Field(min_length=1)
    year: str = ""
    major: str = ""
    courses: list[CourseIn] = Field(min_length=1, max_length=30)
    goals: list[str] = Field(min_length=1)
    style: list[str] = Field(min_length=1)
    availability: list[BlockIn] = Field(min_length=1, max_length=7)
    session_length: str = ""
    group_size: str = ""
    places: list[str] = []

    @field_validator("availability")
    @classmethod
    def one_row_per_day(cls, blocks):
        days = [b.day for b in blocks]
        if len(days) != len(set(days)):
            raise ValueError("Each day can only appear once")
        return blocks