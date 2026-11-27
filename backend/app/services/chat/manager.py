import asyncio
from collections import defaultdict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.groups: dict[int, set[WebSocket]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def connect(self, group_id: int, ws: WebSocket):
        await ws.accept()
        async with self._lock:
            self.groups[group_id].add(ws)

    async def disconnect(self, group_id: int, ws: WebSocket):
        async with self._lock:
            self.groups[group_id].discard(ws)
            if not self.groups[group_id]:
                del self.groups[group_id]

    async def broadcast_local(self, group_id: int, payload: dict):
        """Send to sockets connected to THIS process."""
        dead = []
        for ws in list(self.groups.get(group_id, ())):
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            await self.disconnect(group_id, ws)

manager = ConnectionManager()
