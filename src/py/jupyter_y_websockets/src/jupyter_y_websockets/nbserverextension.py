from .manager import YWebSocketsManager


def load_jupyter_server_extension(nbapp):
    nbapp.y_websocket_manager = YWebSocketsManager(parent=nbapp)
    y_websocket_manager.init()
