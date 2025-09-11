import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            RealEstate App
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-foreground hover:text-primary">
              Home
            </Link>
            <Link to="/calculator/new" className="text-foreground hover:text-primary">
              Calculator
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/properties" className="text-foreground hover:text-primary">
                  Properties
                </Link>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
    </div>
  )
} 