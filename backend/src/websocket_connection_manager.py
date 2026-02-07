import fastapi

class ConnectionManager:
  def __init__(self):
    self.active_connections: dict[int, fastapi.WebSocket] = {}

  async def connect(self, user_id: int, websocket: fastapi.WebSocket):
    await websocket.accept()
    self.active_connections[user_id] = websocket

  def disconnect(self, user_id: int):
    if user_id in self.active_connections:
      del self.active_connections[user_id]

  async def send_unread_sightings_count(self, receiver_id: int, count: int):
    if receiver_id in self.active_connections:
      await self.active_connections[receiver_id].send_text(str(count))

manager = ConnectionManager()
