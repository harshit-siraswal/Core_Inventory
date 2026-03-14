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

export function ReceiptsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Receipts (Inbound)</h1>
          <p className="text-muted-foreground">Manage expected incoming stock from suppliers.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Receipt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Shipments</CardTitle>
          <CardDescription>Purchase orders currently awaiting reception.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">REC-2024-102</TableCell>
                <TableCell>Global Tech Supplies</TableCell>
                <TableCell>2024-05-18</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                    Expected
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Receive</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
