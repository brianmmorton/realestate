import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-foreground">
          Welcome to RealEstate App
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find your dream property with our comprehensive real estate platform. 
          Browse listings, connect with agents, and make your property dreams come true.
        </p>
        
        <div className="flex justify-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              <Link to="/calculator">
                <Button variant="outline" size="lg">Investment Calculator</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/calculator">
                <Button variant="outline" size="lg">Investment Calculator</Button>
              </Link>
            </>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl text-primary-foreground">🏠</span>
            </div>
            <h3 className="text-xl font-semibold">Find Properties</h3>
            <p className="text-muted-foreground">
              Search through thousands of properties in your area
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl text-primary-foreground">👥</span>
            </div>
            <h3 className="text-xl font-semibold">Connect with Agents</h3>
            <p className="text-muted-foreground">
              Work with experienced real estate professionals
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl text-primary-foreground">🔑</span>
            </div>
            <h3 className="text-xl font-semibold">Get Keys</h3>
            <p className="text-muted-foreground">
              Complete your property purchase with confidence
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 