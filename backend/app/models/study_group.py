import enum

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, text, Enum, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .availability_block import AvailabilityBlock

from app.database import Base

class StudyGroup(Base):
    __tablename__ = "study_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[String] = mapped_column(String, default="group")
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"))
    open: Mapped[bool] = mapped_column(Boolean, default=True, server_default=text("true"))

    availability_blocks: Mapped[list[AvailabilityBlock]] = relationship(uselist=True)

    __table_args__ = (
        UniqueConstraint("course_id", name="unique_course_group"),
    )


class StudyGroupMember(Base):
    __tablename__ = "study_group_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    study_group_id: Mapped[int] = mapped_column(Integer, ForeignKey("study_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)


class RequestType(enum.Enum):
    JOIN = "join"
    INVITE = "invite"

class StudyGroupRequest(Base):
    __tablename__ = "study_group_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("study_groups.id"), nullable=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    request_type: Mapped[RequestType] = mapped_column(Enum(RequestType), nullable=False)

    __table_args__ = (
            CheckConstraint(
                "user_id IS NOT NULL OR group_id IS NOT NULL",
                name="require_request_reciever_id"
            ),
        )


class StudySession(Base):
    __tablename__ = "study_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    day: Mapped[int] = mapped_column(Integer, nullable=False)
    time_start: Mapped[int] = mapped_column(Integer, nullable=False)
    time_end: Mapped[int] = mapped_column(Integer, nullable=False)


class StudyGroupMessage(Base):
    __tablename__ = "study_group_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    study_group_id: Mapped[int] = mapped_column(Integer, ForeignKey("study_groups.id"), nullable=False)
    message: Mapped[str] = mapped_column(String, nullable=False)