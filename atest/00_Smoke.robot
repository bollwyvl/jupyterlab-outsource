*** Settings ***
Library           JupyterLibrary

*** Test Cases ***
Lab
    [Documentation]    Did we break lab?
    Capture Page Screenshot    lab.png
