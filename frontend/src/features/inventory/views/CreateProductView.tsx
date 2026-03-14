import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CreateProductView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <Button variant="outline" asChild>
          <Link to="/products">Back to Products</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Product Form</CardTitle>
          <CardDescription>Prototype form for video demo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input placeholder="SKU" />
          <Input placeholder="Product Name" />
          <Input placeholder="Category" />
          <Input placeholder="Minimum Stock Level" />
          <div className="md:col-span-2">
            <Input placeholder="Description" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button>Create Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
