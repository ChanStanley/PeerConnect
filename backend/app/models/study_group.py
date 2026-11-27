import enum

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, text, Enum, UniqueConstraint, CheckConstraint, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .availability_block import AvailabilityBlock

from app.database import Base

class StudyGroup(Base):
    __tablename__ = "study_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, default="group")
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"))
    open: Mapped[bool] = mapped_column(Boolean, default=True, server_default=text("true"))

    availability_blocks: Mapped[list[AvailabilityBlock]] = relationship(uselist=True)

    __table_args__ = (
        UniqueConstraint("course_id", name="unique_course_group"),
    )


class StudyGroupMember(Base):
    __tablename__ = "study_group_members"

    id: Mapped[int] = mapped_column(primary_key=True)
    study_group_id: Mapped[int] = mapped_column(Integer, ForeignKey("study_groups.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (
        UniqueConstraint("study_group_id", "user_id", name="uq_group_member"),
    )

class RequestType(enum.Enum):
    JOIN = "join"
    INVITE = "invite"

class RequestStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"

class StudyGroupRequest(Base):
    __tablename__ = "study_group_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(Integer, ForeignKey("study_groups.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    request_type: Mapped[RequestType] = mapped_column(Enum(RequestType), nullable=False)
    status: Mapped[RequestStatus] = mapped_column(Enum(RequestStatus), default=RequestStatus.PENDING, nullable=False)

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
    study_group_id: Mapped[int] = mapped_column(Integer, ForeignKey("study_groups.id", ondelete="CASCADE"), nullable=False)


class StudyGroupMessage(Base):
    __tablename__ = "study_group_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    study_group_id: Mapped[int] = mapped_column(Integer, ForeignKey("study_groups.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    