import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { deliveries, type Delivery } from "@/lib/mock-data";
import { Eye } from "lucide-react";
import { toast } from "sonner";

export default function DeliveryPage() {
  const [deliveryRows, setDeliveryRows] = useState<Delivery[]>(deliveries);
  const [selected, setSelected] = useState<Delivery | null>(null);

  const updateSelectedStatus = (status: Delivery["status"]) => {
    if (!selected) {
      return;
    }

    setDeliveryRows((previous) =>
      previous.map((row) => (row.id === selected.id ? { ...row, status } : row)),
    );
    setSelected((previous) => (previous ? { ...previous, status } : previous));

    toast.success(`Delivery ${selected.reference} marked as ${status}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Delivery</h1>
        <p className="page-description">Manage outgoing deliveries</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryRows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium font-mono text-sm">{d.reference}</TableCell>
                  <TableCell>{d.date}</TableCell>
                  <TableCell>{d.contact}</TableCell>
                  <TableCell>{d.destinationAddr}</TableCell>
                  <TableCell>
                    <Badge variant={d.status === "done" ? "default" : d.status === "validated" ? "secondary" : "outline"}>
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelected(d)}>
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
            <DialogTitle>Delivery — {selected?.reference}</DialogTitle>
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
                  <span className="text-muted-foreground">Operation Type</span>
                  <p className="font-medium">{selected.operationType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Destination</span>
                  <p className="font-medium">{selected.destinationAddr}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p><Badge variant={selected.status === "done" ? "default" : "secondary"}>{selected.status}</Badge></p>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!selected) {
                      return;
                    }
                    toast.success(`Print queued for ${selected.reference}`);
                  }}
                >
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateSelectedStatus("draft")}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => updateSelectedStatus("validated")}>
                  Validate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
