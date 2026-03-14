import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function EditProductView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <Button variant="outline" asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Prototype update form for edit flow demonstration.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input defaultValue="LTP-14P" />
          <Input defaultValue={'Laptop Pro 14"'} />
          <Input defaultValue="Electronics" />
          <Input defaultValue="10" />
          <div className="md:col-span-2">
            <Input defaultValue="High-performance business laptop" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button variant="outline">Archive</Button>
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
