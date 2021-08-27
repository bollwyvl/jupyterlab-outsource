"""basic metadata tests"""


def test_version():
    from .. import _version

    assert _version.__version__ == _version.__js__["version"]


def test_extensions():
    from .. import _jupyter_labextension_paths

    assert len(_jupyter_labextension_paths()) == 3
