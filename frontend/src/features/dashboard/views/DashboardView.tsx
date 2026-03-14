import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Truck, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardView() {
  const kpiCards = [
    {
      title: 'Total Products',
      value: '1,248',
      note: '+24 from last month',
      icon: Package,
      iconClass: 'text-slate-700 dark:text-slate-200',
    },
    {
      title: 'Active Deliveries',
      value: '12',
      note: '4 arriving today',
      icon: Truck,
      iconClass: 'text-slate-700 dark:text-slate-200',
    },
    {
      title: 'Pending Transfers',
      value: '3',
      note: 'Action required',
      icon: ArrowRightLeft,
      iconClass: 'text-slate-700 dark:text-slate-200',
    },
    {
      title: 'Low Stock Alerts',
      value: '8',
      note: 'Items below threshold',
      icon: AlertTriangle,
      iconClass: 'text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Overview of current stock health, movement, and operational pressure points.
          </p>
        </div>
        <Button className="skeuo-btn">Download Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="skeuo-shell card-hover border-slate-300/40 dark:border-slate-600/40">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {item.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${item.iconClass}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {item.value}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="skeuo-shell col-span-4 border-slate-300/40 dark:border-slate-600/40">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Inventory Valuation</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Value trend over the last 8 weeks
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] rounded-xl border-t border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-900/30">
            <svg viewBox="0 0 760 280" className="h-full w-full" aria-label="Inventory valuation chart">
              <defs>
                <linearGradient id="valuationFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.35)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.02)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="240" x2="760" y2="240" stroke="rgba(148,163,184,0.4)" />
              <line x1="0" y1="170" x2="760" y2="170" stroke="rgba(148,163,184,0.2)" />
              <line x1="0" y1="100" x2="760" y2="100" stroke="rgba(148,163,184,0.2)" />
              <path
                d="M20 210 C 85 195, 145 160, 220 170 C 300 182, 360 120, 450 132 C 530 145, 600 95, 730 80 L 730 240 L 20 240 Z"
                fill="url(#valuationFill)"
              />
              <path
                d="M20 210 C 85 195, 145 160, 220 170 C 300 182, 360 120, 450 132 C 530 145, 600 95, 730 80"
                stroke="rgba(37, 99, 235, 0.9)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </CardContent>
        </Card>
        <Card className="skeuo-shell col-span-3 border-slate-300/40 dark:border-slate-600/40">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Latest inventory movements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-800 dark:text-slate-100">
                      Stock Adjusted
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Laptop Pro 14" (+5)</p>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">10m ago</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
