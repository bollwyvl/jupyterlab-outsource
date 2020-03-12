# jupyterlab-outsource

> Alternate editors for JupyterLab text sources

[![binder][]][demo]

![screenshot showing JupyterLab with Rich Text editing and Visual Programming][screenshot]

## Features

- Rich text editing for Markdown cells in the notebook
  - powered by [ProseMirror][]
- Visual Code editing
  - powered by [Blockly][]

## Installation

- install JupyterLab >1.0.0 and NodeJS, such as with `conda`:

```bash
conda install -c conda-forge jupyterlab nodejs
# TBD: jupyter labextension install \
#       @deathbeds/jupyterlab-outsource
#       @deathbeds/jupyterlab-outsource-prosemirror \
#       @deathbeds/jupyterlab-outsource-blockly
jupyter lab
```

## Usage

- In JupyterLab
  - Open a notebook
  - Click the ![magic wand icon][icon]

## Roadmap

- Add MIME renderers, too
- Rich text
  - Inline [CodeMirror][]
  - Tables
  - Todo lists
  - LaTeX Math
- Visual Code editing
  - Block mime type
- Get these into core (or at least first-party extensions)

[demo]: https://mybinder.org/v2/gh/deathbeds/jupyterlab-outsource/master?urlpath=lab/tree/notebooks/index.ipynb
[binder]: https://mybinder.org/badge.svg
[blockly]: https://github.com/google/blockly
[codemirror]: https://prosemirror.net/examples/codemirror/
[prosemirror]: https://prosemirror.net
[screenshot]: ./docs/img/jupyterlab-outsource.png
[icon]: ./src/_core/style/img/outsource.svg
