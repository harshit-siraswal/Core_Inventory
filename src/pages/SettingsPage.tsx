import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("CoreInventory Demo");
  const [defaultWarehouse, setDefaultWarehouse] = useState("Main Warehouse (MW)");
  const [currency, setCurrency] = useState("NGN (₦)");
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Settings</h1>
        <p className="page-description">Application configuration</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Company Name</span>
            <Input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="max-w-[240px]"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Default Warehouse</span>
            <Input
              value={defaultWarehouse}
              onChange={(event) => setDefaultWarehouse(event.target.value)}
              className="max-w-[240px]"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Currency</span>
            <Input value={currency} onChange={(event) => setCurrency(event.target.value)} className="max-w-[240px]" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email Alerts</span>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono text-muted-foreground">1.0.0-prototype</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setCompanyName("CoreInventory Demo");
                setDefaultWarehouse("Main Warehouse (MW)");
                setCurrency("NGN (₦)");
                setEmailAlerts(true);
                toast.success("Settings reset");
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                toast.success("Settings saved", {
                  description: `${companyName} · ${defaultWarehouse} · ${currency}`,
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
