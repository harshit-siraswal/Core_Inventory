import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { receipts, type Receipt } from "@/lib/mock-data";
import { Eye } from "lucide-react";

export default function ReceiptsPage() {
  const [selected, setSelected] = useState<Receipt | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Receipts</h1>
        <p className="page-description">Manage incoming inventory receipts</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium font-mono text-sm">{r.reference}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.contact}</TableCell>
                  <TableCell>{r.effectiveDate}</TableCell>
                  <TableCell>{r.sourceLocation}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "done" ? "default" : r.status === "validated" ? "secondary" : "outline"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(r)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Receipt — {selected?.reference}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{selected.date}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Effective Date</span>
                  <p className="font-medium">{selected.effectiveDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Contact</span>
                  <p className="font-medium">{selected.contact}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p>
                    <Badge variant={selected.status === "done" ? "default" : "secondary"}>{selected.status}</Badge>
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Products</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.products.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.productName}</TableCell>
                        <TableCell className="text-right">{p.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm">Print</Button>
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Validate</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
