import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function MovementHistoryView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Movement History</h1>
          <p className="text-muted-foreground">Complete audit trail of all inventory changes.</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Filtering and searching coming soon.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Transaction Type</TableHead>
                <TableHead>Qty Change</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-05-17 14:32:01</TableCell>
                <TableCell>Laptop Pro 14"</TableCell>
                <TableCell>Main Warehouse</TableCell>
                <TableCell>Adjustment</TableCell>
                <TableCell className="font-medium text-green-600">+2</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell className="text-right text-muted-foreground">ADJ-291</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-05-17 10:15:44</TableCell>
                <TableCell>Wireless Mouse</TableCell>
                <TableCell>Retail Store A</TableCell>
                <TableCell>Internal Transfer</TableCell>
                <TableCell className="font-medium text-red-600">-50</TableCell>
                <TableCell>System</TableCell>
                <TableCell className="text-right text-muted-foreground">TRF-2024-001</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-05-17 10:15:44</TableCell>
                <TableCell>Wireless Mouse</TableCell>
                <TableCell>Main Warehouse</TableCell>
                <TableCell>Internal Transfer</TableCell>
                <TableCell className="font-medium text-green-600">+50</TableCell>
                <TableCell>System</TableCell>
                <TableCell className="text-right text-muted-foreground">TRF-2024-001</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
