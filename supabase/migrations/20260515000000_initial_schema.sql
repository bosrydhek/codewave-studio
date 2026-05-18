-- Enable pgvector extension for RAG memory
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Create Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'planning' NOT NULL,
    config JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Project Memory table for RAG
CREATE TABLE IF NOT EXISTS public.project_memory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('doc', 'asset', 'snippet', 'error')),
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Default OpenAI embedding size
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_memory ENABLE ROW LEVEL SECURITY;

-- Workspace Policies
CREATE POLICY "Users can view their own workspaces"
    ON public.workspaces FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workspaces"
    ON public.workspaces FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces"
    ON public.workspaces FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces"
    ON public.workspaces FOR DELETE
    USING (auth.uid() = user_id);

-- Project Policies
CREATE POLICY "Users can view projects in their workspaces"
    ON public.projects FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE workspaces.id = projects.workspace_id
        AND workspaces.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert projects in their workspaces"
    ON public.projects FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE workspaces.id = projects.workspace_id
        AND workspaces.user_id = auth.uid()
    ));

CREATE POLICY "Users can update projects in their workspaces"
    ON public.projects FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE workspaces.id = projects.workspace_id
        AND workspaces.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete projects in their workspaces"
    ON public.projects FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE workspaces.id = projects.workspace_id
        AND workspaces.user_id = auth.uid()
    ));

-- Project Memory Policies
CREATE POLICY "Users can view memory for their projects"
    ON public.project_memory FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects
        JOIN public.workspaces ON workspaces.id = projects.workspace_id
        WHERE projects.id = project_memory.project_id
        AND workspaces.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert memory for their projects"
    ON public.project_memory FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.projects
        JOIN public.workspaces ON workspaces.id = projects.workspace_id
        WHERE projects.id = project_memory.project_id
        AND workspaces.user_id = auth.uid()
    ));

CREATE POLICY "Users can update memory for their projects"
    ON public.project_memory FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.projects
        JOIN public.workspaces ON workspaces.id = projects.workspace_id
        WHERE projects.id = project_memory.project_id
        AND workspaces.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete memory for their projects"
    ON public.project_memory FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.projects
        JOIN public.workspaces ON workspaces.id = projects.workspace_id
        WHERE projects.id = project_memory.project_id
        AND workspaces.user_id = auth.uid()
    ));

-- Match documents function for RAG
CREATE OR REPLACE FUNCTION match_project_memory (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_project_id uuid
)
RETURNS TABLE (
  id uuid,
  project_id uuid,
  type text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    project_memory.id,
    project_memory.project_id,
    project_memory.type,
    project_memory.content,
    project_memory.metadata,
    1 - (project_memory.embedding <=> query_embedding) AS similarity
  FROM project_memory
  WHERE project_memory.project_id = p_project_id
  AND 1 - (project_memory.embedding <=> query_embedding) > match_threshold
  ORDER BY project_memory.embedding <=> query_embedding
  LIMIT match_count;
$$;
