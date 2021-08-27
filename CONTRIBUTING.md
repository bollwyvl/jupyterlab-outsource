# Contributing

We would love to have contributions of

- additional sources
- additional supported editors

## Development

### Before

Install:

- [Mambaforge](https://github.com/conda-forge/miniforge)

### Setup

```bash
mamba env update --file .binder/environment.yml --prefix .venv/
conda activate ./.venv
doit lab
```

## Build Once

```bash
doit build
```

## Always Be Building

```bash
doit watch
```

Starts:

- a JSON schema to typescript process
- a typescript build process
- jupyterlab in build mode

## Thinking about Committing

```bash
doit lint
doit test # tbd
```

## Design Principles

> Note: PRs will be reviewed on a time-permitting basis!
