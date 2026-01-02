from app.websocket_connection_manager import manager
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
  await manager.connect(user_id, websocket)

  try:
    while True:
      await websocket.receive_text()
  except WebSocketDisconnect:
    manager.disconnect(user_id)
