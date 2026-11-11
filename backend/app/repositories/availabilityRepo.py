from sqlalchemy.orm import Session

from app.schemas.profile import BlockIn
from app.models.availability_block import AvailabilityBlock

class availabilityRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, block: BlockIn, user: int):
        self.db.add(AvailabilityBlock(user_id=user, day=block.day, preferred=block.preferred, possible=block.possible))