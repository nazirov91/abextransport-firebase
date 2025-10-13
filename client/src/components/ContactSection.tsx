import contactTrustImage from '@/assets/happy_customer.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Clock, Headset, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'Call Dispatch',
    details: '+1 (281) 220-1799',
    description: 'Speak directly with an Abex transport strategist.',
    buttonLabel: 'Call now',
    buttonHref: 'tel:+12812201799',
  },
  {
    icon: Mail,
    title: 'Email Logistics Desk',
    details: 'contact@abextransport.com',
    description: 'Priority inbox monitored by senior coordinators.',
    buttonLabel: 'Email dispatch',
    buttonHref: 'mailto:contact@abextransport.com',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: '8 AM – 7 PM EST (Mon – Fri)',
    description: 'Saturday coverage 10 AM – 4. Sunday Closed.',
  },
  {
    icon: MapPin,
    title: 'National Coverage',
    details: 'All 50 states',
    description: 'Door-to-door enclosed & open carrier network.',
  },
];

const guaranteeHighlights = [
  'Dedicated dispatcher assigned once we receive your pickup details.',
  'Route-specific pricing forecasts in under 10 minutes.',
  'Carrier insurance and background verification handled for you.',
  'Rapid status notifications by SMS, phone, or email—your choice.',
];

export default function ContactSection() {
  return (
    <section id='contact' className='bg-muted/30 py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <span className='inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'>
            Humans ready to help 7 days a week
          </span>
          <h2 className='mt-6 text-3xl font-bold text-foreground md:text-4xl'>
            White-glove transport without the guesswork
          </h2>
          <p className='mx-auto mt-4 max-w-3xl text-lg text-muted-foreground mb-4'>
            Start with a quick conversation—no phone trees, no sales scripts. Get real pricing, real
            timeline guidance, and a dedicated coordinator who tracks your shipment from dispatch to
            delivery.
          </p>
        </div>

        <div className='mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card className='border-card-border'>
              <CardHeader>
                <CardTitle className='text-2xl'>Talk to a transport strategist</CardTitle>
                <CardDescription>
                  Choose the channel that fits your day—our core team handles every quote and live
                  shipment adjustment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 sm:grid-cols-2 px-10 sm:px-0'>
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className='flex h-full flex-col gap-4 rounded-xl border border-card-border/70 bg-card/70 shadow-sm transition hover:-translate-y-1 hover:shadow-lg px-6 py-6'
                      >
                        <span className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                          <Icon className='h-5 w-5' />
                        </span>
                        <div>
                          <h3 className='text-base font-semibold text-foreground'>{item.title}</h3>
                          <div className='text-lg font-semibold text-primary'>{item.details}</div>
                          <p className='mt-1 text-sm text-muted-foreground'>{item.description}</p>
                        </div>
                        {item.buttonHref && item.buttonLabel && (
                          <Button variant='outline' size='sm' className='mt-auto w-full'>
                            {item.buttonLabel}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='relative overflow-hidden rounded-3xl border border-primary/40 bg-black/5 shadow-xl'>
            <img
              src={contactTrustImage}
              alt='Happy Abex Transport customers celebrating a successful vehicle delivery'
              className='h-full w-full object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
