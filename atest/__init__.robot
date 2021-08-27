*** Settings ***
Documentation     Test alternative editors in JupyterLab
Library           JupyterLibrary
Suite Setup       Prepare for testing outsource
Suite Teardown    Clean up after testing outsource

*** Keywords ***
Prepare for testing outsource
    ${py} =    Evaluate    __import__("sys").version.split(" ")[0]
    ${platform} =    Evaluate    __import__("platform").system()
    Set Global Variable    ${PY}    ${py}
    Set Global Variable    ${PLATFORM}    ${platform}
    Set Tags    py:${PY}    os:${platform}
    Wait for New Jupyter Server to be Ready    stdout=${OUTPUT DIR}${/}lab.log
    Open JupyterLab
    Set Window Size    1366    768
    Disable JupyterLab Modal Command Palette

Clean up after testing outsource
    Terminate All Jupyter Servers
    Close All Browsers
