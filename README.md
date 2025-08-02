# Setup

`pnpm install`

`pnpm build` or `pnpm dev`

# Architecture

This is a [monorepo](https://monorepo.tools) - a single repository containing multiple projects with shared tooling and dependencies.

## Directories

### `/apps/`

Entry points for applications. Apps are the actual build outputs.

Can depend on `packages/`, `utilities/`, and external modules.

### `/packages/`

Feature-rich libraries/projects/applications with dependencies.

Can depend on `utilities/` and external modules.

### `/utilities/`

Atomic, independent modules.

Should not have dependencies. Should be self-contained.
