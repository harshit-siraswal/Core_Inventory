import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { warehouses, type Warehouse } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function WarehousePage() {
  const [warehouseRows, setWarehouseRows] = useState<Warehouse[]>(warehouses);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [address, setAddress] = useState("");

  const resetForm = () => {
    setName("");
    setShortCode("");
    setAddress("");
  };

  const handleAddWarehouse = () => {
    const trimmedName = name.trim();
    const trimmedCode = shortCode.trim().toUpperCase();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedCode || !trimmedAddress) {
      toast.error("Please fill in warehouse name, short code, and address.");
      return;
    }

    const alreadyExists = warehouseRows.some(
      (warehouse) =>
        warehouse.name.toLowerCase() === trimmedName.toLowerCase() ||
        warehouse.shortCode.toLowerCase() === trimmedCode.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error("Warehouse name or short code already exists.");
      return;
    }

    const newWarehouse: Warehouse = {
      id: `${Date.now()}`,
      name: trimmedName,
      shortCode: trimmedCode,
      address: trimmedAddress,
    };

    setWarehouseRows((previous) => [newWarehouse, ...previous]);
    toast.success(`Warehouse ${trimmedName} added.`);
    resetForm();
    setOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="page-header">Warehouse</h1>
          <p className="page-description">Warehouse details and locations</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Short Code</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouseRows.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{w.shortCode}</TableCell>
                  <TableCell>{w.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Warehouse</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warehouse-name">Warehouse Name</Label>
              <Input
                id="warehouse-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. North Hub"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse-code">Short Code</Label>
              <Input
                id="warehouse-code"
                value={shortCode}
                onChange={(event) => setShortCode(event.target.value)}
                placeholder="e.g. NH"
                maxLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse-address">Address</Label>
              <Input
                id="warehouse-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="e.g. 9 Harbor Way, Port Harcourt"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddWarehouse}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
