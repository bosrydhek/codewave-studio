import {
  Activity,
  CreditCard,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react'

export const DemoWidget = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center p-8">
      {/* Dark overlay for contrast */}
      <div className="pointer-events-none absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="animate-in fade-in slide-in-from-bottom-8 relative z-10 grid w-full max-w-4xl grid-cols-1 gap-6 duration-700 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Balance Card (Glassmorphism) */}
        <div className="rounded-modal bg-bg-surface/40 border-border-low shadow-primary/10 group hover:bg-bg-surface/60 relative overflow-hidden border p-8 font-sans shadow-2xl backdrop-blur-xl transition-all duration-500 lg:col-span-2">
          <div className="bg-primary/20 group-hover:bg-primary/30 pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full blur-3xl transition-colors" />

          <div className="mb-8 flex items-start justify-between">
            <div className="bg-bg-sunken border-border-low rounded-pill flex items-center gap-3 border px-4 py-2 backdrop-blur-md">
              <Sparkles size={16} className="text-primary" />
              <span className="text-text-primary font-display text-[10px] font-black tracking-[0.2em] uppercase">
                Total Balance
              </span>
            </div>
            <button className="rounded-full bg-white/5 p-2 text-white transition-colors hover:bg-white/20">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-text-primary font-display text-6xl font-normal tracking-tighter">
                $124,592<span className="text-text-muted/40 font-sans text-3xl">.00</span>
              </h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="rounded-pill flex items-center gap-1 border border-green-500/20 bg-green-400/10 px-2 py-1 text-[10px] font-black tracking-widest text-green-400 uppercase">
                  <ArrowUpRight size={14} />
                  <span>+14.5%</span>
                </div>
                <span className="text-text-muted text-xs italic">vs last month</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-3">
              <button className="btn-primary-gradient text-text-on-primary rounded-pill flex-1 py-4 text-xs font-bold tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                Transfer
              </button>
              <button className="bg-bg-sunken text-text-primary border-border-low rounded-pill hover:bg-bg-surface flex-1 border py-4 text-xs font-bold tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]">
                Request
              </button>
            </div>
          </div>
        </div>

        {/* Small Metric Card 1 */}
        <div className="rounded-modal bg-bg-surface/40 border-border-low hover:bg-bg-surface group flex flex-col justify-between border p-6 font-sans shadow-xl backdrop-blur-xl transition-all duration-300">
          <div className="bg-bg-sunken border-border-low text-primary group-hover:bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-sm border shadow-inner transition-all group-hover:scale-110">
            <Users size={24} />
          </div>
          <div>
            <p className="text-text-muted font-display mb-1 text-[10px] font-black tracking-widest uppercase">
              Active Users
            </p>
            <h3 className="text-text-primary font-display text-3xl font-normal tracking-tight">
              8,234
            </h3>
          </div>
        </div>

        {/* Small Metric Card 2 */}
        <div className="rounded-modal from-primary/10 to-secondary/10 border-primary/20 hover:border-primary/40 group flex flex-col justify-between border bg-gradient-to-br p-6 font-sans shadow-xl backdrop-blur-xl transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="bg-bg-surface border-border-low text-secondary ring-border-low mb-6 flex h-12 w-12 items-center justify-center rounded-sm border shadow-lg ring-1 transition-all group-hover:scale-110">
              <CreditCard size={24} />
            </div>
            <div className="rounded-pill flex items-center gap-1 border border-red-500/20 bg-red-400/10 px-2 py-1 text-[10px] font-black tracking-widest text-red-400 uppercase">
              <ArrowDownRight size={14} />
              <span>-2.4%</span>
            </div>
          </div>
          <div>
            <p className="text-primary font-display mb-1 text-[10px] font-black tracking-widest uppercase">
              Expenses
            </p>
            <h3 className="text-text-primary font-display text-3xl font-normal tracking-tight">
              $4,091
            </h3>
          </div>
        </div>

        {/* Small Metric Card 3 */}
        <div className="rounded-modal bg-bg-surface/40 border-border-low hover:bg-bg-surface relative flex items-center justify-between overflow-hidden border p-6 font-sans shadow-xl backdrop-blur-xl transition-all duration-300 lg:col-span-2">
          <div className="from-secondary/10 pointer-events-none absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l to-transparent" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="from-primary to-secondary text-text-on-primary shadow-primary/20 flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br shadow-lg">
              <Activity size={28} />
            </div>
            <div>
              <h4 className="text-text-primary font-display text-xl font-normal">
                System Health Normal
              </h4>
              <p className="text-text-muted mt-1 text-sm italic">
                All services are running smoothly across 4 regions.
              </p>
            </div>
          </div>
          <button className="bg-bg-sunken text-text-muted border-border-low rounded-pill hover:text-text-primary hover:bg-bg-surface relative z-10 hidden border px-6 py-3 text-[10px] font-black tracking-widest uppercase transition-all md:block">
            View Logs
          </button>
        </div>
      </div>
    </div>
  )
}
