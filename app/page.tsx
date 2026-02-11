import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Globe, CreditCard, Bell, QrCode } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DM</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Digital Menu System</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                EN
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Scan Table
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Professional Digital Menu System</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enhance your restaurant experience with our comprehensive digital menu system featuring multi-language
            support, real-time ordering, and seamless payment integration.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <a href="/menu">View Menu</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/menu">Start Order</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <CardTitle>Multi-Language Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Full support for English, Italian, and Amharic with easy language switching
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">English</Badge>
                  <Badge variant="secondary">Italiano</Badge>
                  <Badge variant="secondary">አማርኛ</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <CardTitle>Real-Time Availability</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Live inventory tracking with automatic menu updates and "Almost Sold Out" alerts
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Available
                  </Badge>
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    Low Stock
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle>Group Ordering</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Multiple people can order from their devices with unified billing and table management
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Table QR</Badge>
                  <Badge variant="secondary">Split Bill</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle>Payment Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Multiple payment options including cards, PayPal, and local gateways like Telebirr
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Cards</Badge>
                  <Badge variant="secondary">PayPal</Badge>
                  <Badge variant="secondary">Telebirr</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-6 w-6 text-primary" />
                  <CardTitle>Order Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time status updates from preparation to delivery with push notifications
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    Preparing
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <QrCode className="h-6 w-6 text-primary" />
                  <CardTitle>QR Code Integration</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamless table-based ordering with QR code scanning for contactless experience
                </CardDescription>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Contactless</Badge>
                  <Badge variant="secondary">Table Link</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Digital Menu System - Built with modern technology for the restaurant industry
          </p>
        </div>
      </footer>
    </div>
  )
}
