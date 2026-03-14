import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const products = [
  { sku: 'LTP-14P', name: 'Laptop Pro 14"', category: 'Electronics', stock: 24 },
  { sku: 'MSE-WL-2', name: 'Wireless Mouse', category: 'Accessories', stock: 143 },
  { sku: 'KBD-MCH', name: 'Mechanical Keyboard', category: 'Accessories', stock: 37 },
];

export function ProductsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Phase 4 prototype: product catalog CRUD.</p>
        </div>
        <Button asChild>
          <Link to="/products/new">New Product</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog Snapshot</CardTitle>
          <CardDescription>Demo data to showcase list + edit flows.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/products/demo/edit">Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
