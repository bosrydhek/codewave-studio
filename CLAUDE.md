# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**codewave-studio** is a Next.js web application in early setup — source code has not yet been scaffolded. The repo currently contains only deployment config and a `.gitignore`.

The deployed service is named `codewave-studio-validation-landing` and is hosted on [Render](https://render.com).

## Deployment

Deployment is managed via `render.yaml` (Render.com infrastructure-as-code):

- **Platform**: Render, service type `web`, environment `next`
- **Plan**: Free tier
- **Build command**: `npm install`
- **Start command**: `npm start`
- **`NODE_ENV`**: `production` (set via Render env var)

## Expected Stack

Based on the `.gitignore`, this project will be a standard Next.js app using npm. Once scaffolded, the typical commands will be:

```bash
npm install        # install dependencies
npm run dev        # start local dev server (default: http://localhost:3000)
npm run build      # production build
npm start          # serve the production build
npm run lint       # run ESLint
```

To run a single Jest test file:
```bash
npx jest path/to/test.file.test.ts
```

## Development Branch

Active development happens on `claude/add-claude-documentation-gNiMb`; `main` is the production branch that Render deploys from.
