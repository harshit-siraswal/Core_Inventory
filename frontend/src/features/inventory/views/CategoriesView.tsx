import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function CategoriesView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Prototype CRUD for product categories.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
          <CardDescription>UI placeholder for create/update category lifecycle.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Category name" />
          <Input placeholder="Description" />
          <div className="flex justify-end">
            <Button>Save Category</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Electronics</li>
            <li>Accessories</li>
            <li>Office Supplies</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
