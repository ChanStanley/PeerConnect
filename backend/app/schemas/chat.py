from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

class MessageIn(BaseModel):
    content: str = Field(default=None, max_length=4000)

class MessageOut(BaseModel):
    id: int
    study_group_id: int
    user_id: int
    content: str
    created_at: datetime
    model_config = {"from_attributes": True}

class WSEvent(BaseModel):
    type: Literal["message", "error"]
    data: dict

class TicketResponse(BaseModel):
    ticket: str