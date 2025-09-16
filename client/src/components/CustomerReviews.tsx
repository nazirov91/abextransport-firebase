import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import testimonial1 from '@assets/generated_images/Customer_testimonial_headshot_1_bd1965d6.png'
import testimonial2 from '@assets/generated_images/Customer_testimonial_headshot_2_a33f3340.png'
import testimonial3 from '@assets/generated_images/Customer_testimonial_headshot_3_af38de3d.png'

const reviews = [
  {
    name: 'Michael Chen',
    location: 'Los Angeles, CA to Miami, FL',
    rating: 5,
    review: 'Outstanding service! They picked up my BMW exactly on time and delivered it in perfect condition. The driver was professional and the price was very competitive. Highly recommend!',
    image: testimonial1,
    shipment: 'BMW 3 Series'
  },
  {
    name: 'Sarah Johnson',
    location: 'Chicago, IL to Phoenix, AZ', 
    rating: 5,
    review: 'I was nervous about shipping my car across the country, but AutoShip Pro made it so easy. Excellent communication throughout, and my vehicle arrived exactly when promised.',
    image: testimonial2,
    shipment: 'Honda Accord'
  },
  {
    name: 'David Rodriguez',
    location: 'New York, NY to Seattle, WA',
    rating: 5,
    review: 'Needed to transport my truck for a job relocation. The team was incredibly helpful, the price was fair, and everything went smoothly. Will definitely use again!',
    image: testimonial3,
    shipment: 'Ford F-150'
  }
]

// TODO: remove mock functionality - integrate with real review system
const additionalStats = [
  { label: 'Google Reviews', value: '4.9/5', count: '2,300+' },
  { label: 'Transport Reviews', value: '4.8/5', count: '5,100+' },
  { label: 'BBB Rating', value: 'A+', count: 'Accredited' },
  { label: 'Repeat Customers', value: '89%', count: 'Return Rate' }
]

export default function CustomerReviews() {
  return (
    <section id="reviews" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what thousands of satisfied customers 
            have to say about their auto transport experience with us.
          </p>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {additionalStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.count}</div>
            </div>
          ))}
        </div>

        {/* Customer Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="hover-elevate transition-all duration-200 border-card-border">
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-chart-1 text-chart-1" />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  "{review.review}"
                </p>
                
                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {review.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {review.location}
                    </div>
                    <div className="text-xs text-primary font-medium">
                      {review.shipment}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-chart-1/10 px-6 py-3 rounded-full">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-chart-1 text-chart-1" />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">4.8 out of 5</span>
            <span className="text-muted-foreground">from 7,400+ verified reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}