import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const locations = [
  { code: 'WH-MAIN', name: 'Main Warehouse', type: 'WAREHOUSE', status: 'ACTIVE' },
  { code: 'STR-A', name: 'Retail Store A', type: 'STORE', status: 'ACTIVE' },
  { code: 'INT-HOLD', name: 'Internal Holding', type: 'INTERNAL', status: 'INACTIVE' },
];

export function LocationsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouses & Locations</h1>
          <p className="text-muted-foreground">Phase 4/6: Warehouse + Location CRUD prototype.</p>
        </div>
        <Button>Add Location</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Location Directory</CardTitle>
          <CardDescription>Table placeholder for location lifecycle operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((loc) => (
                <TableRow key={loc.code}>
                  <TableCell className="font-medium">{loc.code}</TableCell>
                  <TableCell>{loc.name}</TableCell>
                  <TableCell>{loc.type}</TableCell>
                  <TableCell>{loc.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
