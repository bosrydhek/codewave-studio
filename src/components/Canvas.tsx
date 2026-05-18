'use client'

import React from 'react'
import { Layout, Smartphone, Globe, Code, Sparkles } from 'lucide-react'

interface CanvasProps {
  generatedCode: string | null
  onDeploy: (platform: string) => void
  onGithubSync: () => Promise<void>
}

const Canvas: React.FC<CanvasProps> = ({ generatedCode, onDeploy, onGithubSync }) => {
  return (
    <div className="bg-bg-base text-text-primary relative flex h-full flex-1 flex-col overflow-hidden font-sans md:h-screen">
      <div className="border-border-low bg-bg-base/80 z-20 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur-3xl md:px-6">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="bg-bg-sunken border-border-low rounded-pill hidden items-center gap-2 border p-1 shadow-inner sm:flex">
            <button className="rounded-pill bg-bg-surface text-text-primary ring-border-low p-2 shadow-lg ring-1">
              <Layout size={18} />
            </button>
            <button className="rounded-pill text-text-muted hover:text-text-primary p-2 transition-all">
              <Smartphone size={18} />
            </button>
          </div>
          <div className="bg-border-low mx-1 hidden h-6 w-px sm:block" />
          <div className="text-text-muted bg-bg-sunken rounded-pill border-border-low flex max-w-[150px] items-center gap-3 truncate border px-3 py-2 text-xs font-bold shadow-sm sm:max-w-none sm:px-4 sm:text-sm">
            <Globe size={14} className="text-text-muted/60 shrink-0" />
            <span className="text-text-muted/80 truncate text-[10px] tracking-tight italic sm:text-xs">
              designwave-preview.vercel.app
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button
            onClick={() => onDeploy('vercel')}
            className="xs:flex bg-bg-sunken hover:bg-bg-surface text-text-muted hover:text-text-primary rounded-pill border-border-low group hidden items-center gap-2 border px-3 py-2 text-xs font-bold shadow-sm transition-all active:scale-95 sm:px-4 sm:text-sm"
          >
            <Sparkles
              size={14}
              className="text-primary transition-transform group-hover:scale-125"
            />
            <span className="hidden tracking-widest uppercase sm:inline">Optimize</span>
          </button>
          <button
            onClick={onGithubSync}
            className="btn-primary-gradient text-text-on-primary rounded-pill flex items-center gap-2 px-4 py-2 text-xs font-bold shadow-[0_0_30px_rgba(var(--color-primary),0.1)] transition-all hover:opacity-90 active:scale-95 sm:px-5 sm:text-sm"
          >
            <Code size={16} />
            <span className="tracking-widest uppercase">Publish</span>
          </button>
        </div>
      </div>

      <div className="bg-bg-base flex flex-1 items-start justify-center overflow-auto p-4 sm:items-center sm:p-12">
        <div className="bg-bg-base/40 rounded-modal border-border-low group relative min-h-[500px] w-full max-w-6xl overflow-hidden border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] md:aspect-video">
          {generatedCode ? (
            <div className="absolute inset-0 flex flex-col">
              <div className="bg-bg-sunken border-border-low flex h-10 items-center gap-3 border-b px-6">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full border border-red-500/40 bg-red-500/20" />
                  <div className="h-3 w-3 rounded-full border border-yellow-500/40 bg-yellow-500/20" />
                  <div className="h-3 w-3 rounded-full border border-green-500/40 bg-green-500/20" />
                </div>
                <div className="flex flex-1 justify-center">
                  <span className="text-text-muted font-display text-[10px] font-black tracking-[0.2em] uppercase">
                    Live Preview
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-white">
                <iframe
                  title="Live Preview"
                  className="h-full w-full border-none"
                  srcDoc={`
                       <!DOCTYPE html>
                       <html>
                         <head>
                           <meta charset="UTF-8">
                           <meta name="viewport" content="width=device-width, initial-scale=1.0">
                           <script src="https://cdn.tailwindcss.com"></script>
                           <style>
                             body { margin: 0; padding: 0; min-height: 100vh; background: white; color: black; font-family: sans-serif; }
                           </style>
                         </head>
                         <body>
                           <div id="root"></div>
                           <script type="module">
                             const code = \`${generatedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
                             
                             if (code.includes('<!DOCTYPE html>') || code.includes('<body')) {
                               document.open();
                               document.write(code);
                               document.close();
                             } else {
                               document.getElementById('root').innerHTML = \`
                                 <div class="p-8">
                                   <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded relative mb-4" role="alert">
                                     <strong class="font-bold">Rendering Note:</strong>
                                     <span class="block sm:inline"> This code snippet is being rendered as a visual preview.</span>
                                   </div>
                                   <pre class="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto">\${code}</pre>
                                 </div>
                               \`;
                             }
                           </script>
                         </body>
                       </html>
                     `}
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-bg-sunken/40">
              <div className="bg-bg-surface/50 border border-border-low/60 p-10 rounded-modal max-w-lg shadow-2xl backdrop-blur-md">
                <div className="mx-auto w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Sparkles className="text-primary animate-pulse" size={24} />
                </div>
                <h3 className="text-text-primary text-xl font-bold tracking-tight">Ready for Generation</h3>
                <p className="text-text-muted mt-3 text-sm leading-relaxed">
                  Designwave&apos;s AI pipeline will synthesize production-ready Payload CMS sites, premium styles, and workflows directly inside this canvas.
                </p>
                <div className="mt-8 flex flex-col gap-2.5 text-left text-xs bg-bg-sunken/60 rounded-sm border border-border-low/40 p-5 font-mono text-text-secondary">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
                    <span>RAG Memory: Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
                    <span>Onboarding Brief: Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" />
                    <span>Current Pipeline: Ready to synthesize code</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      <div className="absolute right-8 bottom-8 flex items-center gap-3">
        <div className="bg-bg-base/80 border-border-mid rounded-pill flex items-center gap-1.5 border p-1.5 shadow-2xl backdrop-blur-2xl">
          <button className="rounded-pill bg-bg-surface text-text-primary ring-border-low p-3 shadow-lg ring-1 transition-transform hover:scale-110">
            <Code size={20} />
          </button>
          <button className="rounded-pill text-text-muted hover:text-text-primary p-3 transition-colors">
            <Globe size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Canvas
