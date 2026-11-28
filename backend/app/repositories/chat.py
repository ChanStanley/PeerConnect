from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.study_group import StudyGroupMember, StudyGroupMessage

async def is_member(
    db: AsyncSession,
    group_id: int,
    user_id: int
) -> bool:
    res = await db.execute(
        select(StudyGroupMember)
            .where(StudyGroupMember.study_group_id == group_id, StudyGroupMember.user_id == user_id)
    )

    return res.scalar_one_or_none() is not None

async def create_message(
    db: AsyncSession,
    group_id: int,
    user_id: int,
    content: str
) -> StudyGroupMessage:
    msg = StudyGroupMessage(study_group_id=group_id, user_id=user_id, message=content)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

async def get_history(
        db: AsyncSession,
        group_id: int,
        before_id: int | None,
        limit: int = 50
):
    q = select(StudyGroupMessage).where(StudyGroupMessage.study_group_id == group_id)
    if before_id is not None:
        q = q.where(StudyGroupMessage.id < before_id)

    res = await db.execute(q.order_by(StudyGroupMessage.id.desc()).limit(limit))
    return list(reversed(res.scalars().all()))