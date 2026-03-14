import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const alerts = [
  { sku: 'LTP-14P', name: 'Laptop Pro 14"', current: 4, min: 10, location: 'Main Warehouse' },
  { sku: 'KBD-MCH', name: 'Mechanical Keyboard', current: 6, min: 12, location: 'Store A' },
  { sku: 'HDMI-2M', name: 'HDMI Cable 2m', current: 11, min: 20, location: 'Store B' },
];

export function LowStockAlertsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Low-Stock Alerts</h1>
          <p className="text-muted-foreground">Phase 6 placeholder for alerting workflow.</p>
        </div>
        <Button variant="outline">Export Alert List</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Products below minimum stock threshold.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Min Level</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a) => (
                <TableRow key={a.sku}>
                  <TableCell className="font-medium">{a.sku}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell className="text-red-600">{a.current}</TableCell>
                  <TableCell>{a.min}</TableCell>
                  <TableCell>{a.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
