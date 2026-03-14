import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(products);

  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.name.toLowerCase().includes(query.toLowerCase()) ||
          row.sku.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="page-header">Products</h1>
          <p className="page-description">Manage your product catalog</p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="md:w-72"
          />
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              toast.success("Search reset");
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Unit Cost</TableHead>
                <TableHead className="text-right">On Hand</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                  <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                  <TableCell className="text-right">{p.unitCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{p.onHand}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRows((previous) =>
                          previous.map((row) =>
                            row.id === p.id ? { ...row, onHand: row.onHand + 1 } : row,
                          ),
                        );
                        toast.success(`Increased ${p.name} stock by 1`);
                      }}
                    >
                      +1 Stock
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
