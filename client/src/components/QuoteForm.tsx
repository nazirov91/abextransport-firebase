import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Calendar, MapPin, Truck, CheckCircle } from 'lucide-react'

interface QuoteFormData {
  origin: string
  destination: string
  pickupDate: string
  trailerType: string
  name: string
  phone: string
  email: string
}

export default function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>({
    origin: '',
    destination: '',
    pickupDate: '',
    trailerType: '',
    name: '',
    phone: '',
    email: ''
  })

  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Quote form submitted:', formData)
    
    // Show success dialog
    setShowSuccessDialog(true)
  }

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-primary">Get Your Free Quote</CardTitle>
        <CardDescription>Instant estimate in under 60 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Origin */}
          <div className="space-y-2">
            <Label htmlFor="origin" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Pickup City, State
            </Label>
            <Input
              id="origin"
              placeholder="e.g., Los Angeles, CA"
              value={formData.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              data-testid="input-origin"
              required
            />
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery City, State
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Miami, FL"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              data-testid="input-destination"
              required
            />
          </div>

          {/* Pickup Date */}
          <div className="space-y-2">
            <Label htmlFor="pickupDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pickup Date
            </Label>
            <Input
              id="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={(e) => handleInputChange('pickupDate', e.target.value)}
              data-testid="input-pickup-date"
              required
            />
          </div>

          {/* Trailer Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Trailer Type
            </Label>
            <Select value={formData.trailerType} onValueChange={(value) => handleInputChange('trailerType', value)}>
              <SelectTrigger data-testid="select-trailer-type">
                <SelectValue placeholder="Select trailer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open (Most Popular - Saves $200)</SelectItem>
                <SelectItem value="enclosed">Enclosed (Premium Protection)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                data-testid="input-name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (713) 344-4668"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                data-testid="input-phone"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Bon999@yahoo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                data-testid="input-email"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-chart-1 hover:bg-chart-1/90 text-white text-lg py-6"
            data-testid="button-submit-quote"
          >
            Get My Free Quote Now
          </Button>
        </form>
      </CardContent>

      {/* Success Alert Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <AlertDialogTitle className="text-green-800">Quote Request Submitted!</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-green-700">
              Thank you {formData.name || 'for your interest'}! We'll send your personalized quote to {formData.email} within 1 hour.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-close-quote-success-dialog"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
