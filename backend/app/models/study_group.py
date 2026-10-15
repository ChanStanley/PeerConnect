from sqlalchemy import Column, Integer, String, ForeignKey

from app.database import Base

class StudyGroup(Base):
    __tablename__ = "study_groups"

    id = Column(Integer, primary_key=True)
    course = Column(String, ForeignKey("users.course"))



class StudyGroupMember(Base):
    __tablename__ = "study_group_members"

    id = Column(Integer, primary_key=True)
    study_group_id = Column(Integer, ForeignKey("study_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    day = Column(Integer, nullable=False)
    time_start = Column(Integer, nullable=False)
    time_end = Column(Integer, nullable=False)


class StudyGroupMessage(Base):
    __tablename__ = "study_group_messages"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    study_group_id = Column(Integer, ForeignKey("study_groups.id"), nullable=False)
    message = Column(String, nullable=False)