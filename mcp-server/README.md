# Designwave Unified MCP Server

A secure, free MCP server for managing Supabase, Neon, Netlify, and local PRDs.

## Setup

1. Install dependencies:

   ```bash
   cd mcp-server
   npm install
   ```

2. Configure environment variables in `.env`:
   - `SUPABASE_PERSONAL_ACCESS_TOKEN`: Your Supabase Personal Access Token.
   - `PRD_DIRECTORY`: Directory for PRDs (default: ../prds).

3. Build and run:
   ```bash
   npm run build
   npm start
   ```

## Tools

- `supabase_get_project`: Check Supabase project status.
- `prd_search`: Search local markdown PRDs.
- `prd_read`: Read a specific PRD file.
