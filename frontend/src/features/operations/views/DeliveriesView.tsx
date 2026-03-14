import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function DeliveriesView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliveries (Outbound)</h1>
          <p className="text-muted-foreground">Manage stock being shipped to customers.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Delivery
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Deliveries</CardTitle>
          <CardDescription>Currently processing outward shipments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Delivery ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">DEL-2024-089</TableCell>
                <TableCell>Acme Corp</TableCell>
                <TableCell>2024-05-20</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                    Picking
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
