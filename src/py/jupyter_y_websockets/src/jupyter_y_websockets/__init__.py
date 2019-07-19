from ._version import __version__


def _jupyter_server_extension_paths():
    return [{"module": "jupyter_y_websockets.nbserverextension"}]
