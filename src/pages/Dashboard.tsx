import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Truck, Package, AlertTriangle } from "lucide-react";
import { receipts, deliveries, products } from "@/lib/mock-data";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Receipts",
    icon: ClipboardList,
    value: `${receipts.filter((r) => r.status === "draft").length} to validate`,
    sub: `${receipts.length} operations`,
    color: "text-primary",
    href: "/receipts",
  },
  {
    title: "Delivery",
    icon: Truck,
    value: `${deliveries.filter((d) => d.status === "draft").length} to validate`,
    sub: `${deliveries.length} operations`,
    color: "text-primary",
    href: "/delivery",
  },
  {
    title: "Products",
    icon: Package,
    value: `${products.length} items`,
    sub: `${products.reduce((a, p) => a + p.onHand, 0)} total on hand`,
    color: "text-primary",
    href: "/products",
  },
];

const alerts = [
  { message: "Copper Wire receipt pending validation", type: "warning" as const },
  { message: "Bearing 6205 delivery awaiting confirmation", type: "warning" as const },
  { message: "Low stock: Tube A approaching reorder level", type: "destructive" as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-description">Today's overview and operational alerts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="stat-value">{stat.value.split(" ")[0]}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.value.split(" ").slice(1).join(" ")} · {stat.sub}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Operational Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <Badge variant={alert.type === "destructive" ? "destructive" : "secondary"}>
                {alert.type === "destructive" ? "Critical" : "Info"}
              </Badge>
              <span>{alert.message}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {receipts.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{r.reference}</span>
                    <span className="text-muted-foreground ml-2">{r.contact}</span>
                  </div>
                  <Badge variant={r.status === "done" ? "default" : r.status === "validated" ? "secondary" : "outline"}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliveries.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{d.reference}</span>
                    <span className="text-muted-foreground ml-2">{d.contact}</span>
                  </div>
                  <Badge variant={d.status === "done" ? "default" : d.status === "validated" ? "secondary" : "outline"}>
                    {d.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
