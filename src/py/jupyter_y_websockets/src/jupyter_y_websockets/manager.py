import traitlets as T
from traitlets.config import LoggingConfigurable

import socketio as S

from notebook.utils import url_path_join as ujoin



class YWebSocketsManager(LoggingConfigurable):
    sio = T.Instance(S.AsyncServer)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @T.default("sio")
        return S.AsyncServer(async_mode="tornado")

    @property
    def web_app(self):
        return self.parent.web_app

    def init(self):
        self.init_sio()
        self.init_routes()

    def init_sio(self):
        s = self.sio

        @s.event
        def connect(sid, environ): self._on_connect(sid, environ)

        @s.event
        def disconnect(sid): self._on_disconnect(sid)

        @s.on("joinRoom")
        def join(sid, data): self._on_join(sid, data)

        @s.event("yjsEvent")
        def y_event(sid, data): self._on_receive(sid, data)

        @s.event("leaveRoom")
        def leave(sid, data): self._on_leave(sid, data)


    def install_routes(self):
        app = self.web_app
        ns = ujoin(app.settings["base_url"], "/y/ws/")
        url = ujoin(ns, "vendor", "(.*)")
        app.add_handlers(".*$", [(url, S.get_tornado_handler(self.sio))])
        self.log.debug(f"y is listening on {url}")

    def _on_connection(self, sid):
        self.log.debug(f"Connected {sid}")

    def _on_disconnect(self, sid):
        self.log.debug(f"disconnect {sid}")

    def _on_join(self, sid, data):
        self.log.debug(f"{sid} joins {data}")
        self.sio.enter_root(sid, data["room"])

    def _on_receieve(self, sid, data):
        self.log.debug(f"{sid} broadcasts {data}")
        self.sio.emit("yjsEvent", data,  skip_sid=sid)
