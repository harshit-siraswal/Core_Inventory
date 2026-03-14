import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function UserProfileView() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">Phase 6 placeholder for account preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Editable profile info for prototype walkthrough.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input defaultValue={user?.name ?? 'Demo User'} />
          <Input defaultValue={user?.email ?? 'demo@coreinventory.app'} />
          <Input defaultValue={user?.role ?? 'MANAGER'} disabled />
          <Input defaultValue="UTC+05:30" />
          <div className="md:col-span-2 flex justify-end">
            <Button>Update Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
