from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base

class Flashcards(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True)
    set_id = Column(Integer, ForeignKey("card_sets.id", ondelete="CASCADE"))
    front = Column(String)
    back = Column(String)

class CardSet(Base):
    __tablename__ = "card_sets"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)