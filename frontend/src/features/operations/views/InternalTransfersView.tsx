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

export function InternalTransfersView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Internal Transfers</h1>
          <p className="text-muted-foreground">Manage stock moving between locations.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Transfer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>A list of recent internal stock transfers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">TRF-2024-001</TableCell>
                <TableCell>2024-05-15</TableCell>
                <TableCell>Main Warehouse</TableCell>
                <TableCell>Retail Store A</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                    Completed
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">TRF-2024-002</TableCell>
                <TableCell>2024-05-16</TableCell>
                <TableCell>Retail Store B</TableCell>
                <TableCell>Main Warehouse</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                    In Transit
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
