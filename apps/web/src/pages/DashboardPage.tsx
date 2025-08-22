import { useAuth } from '@/providers/auth-provider'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">My Properties</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Properties listed</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Saved Searches</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Active searches</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Messages</h3>
            <p className="text-2xl font-bold text-primary">0</p>
            <p className="text-sm text-muted-foreground">Unread messages</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display.</p>
            <p className="text-sm mt-2">
              Start by browsing properties or listing your own property.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 