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

export function AdjustmentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Adjustments</h1>
          <p className="text-muted-foreground">Log physical counts and adjust inventory.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Adjustment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Adjustments</CardTitle>
          <CardDescription>Log of manual changes to stock quantities.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-05-17</TableCell>
                <TableCell>Laptop Pro 14"</TableCell>
                <TableCell>Main Warehouse</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                    Audit (Add)
                  </span>
                </TableCell>
                <TableCell className="font-medium">+2</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-05-17</TableCell>
                <TableCell>Wireless Mouse</TableCell>
                <TableCell>Retail Store A</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                    Damage (Remove)
                  </span>
                </TableCell>
                <TableCell className="font-medium text-red-600">-1</TableCell>
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
