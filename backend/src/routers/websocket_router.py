import fastapi
import src.websocket_connection_manager

router = fastapi.APIRouter()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: fastapi.WebSocket, user_id: int):
  await src.websocket_connection_manager.manager.connect(user_id, websocket)

  try:
    while True:
      await websocket.receive_text()
  except fastapi.WebSocketDisconnect:
    src.websocket_connection_manager.manager.disconnect(user_id)
