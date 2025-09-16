# Auto Transport Broker Website

## Overview

This is a professional auto transport broker website that connects customers with vehicle shipping services nationwide. The application provides a comprehensive platform for users to get quotes, learn about services, and contact the company for vehicle transportation needs. The site features a modern design with trust-building elements similar to professional service platforms like Airbnb and Booking.com, combined with clean B2B aesthetics for the auto transport industry.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Static Website
- **Purely static** - website that can be hosted on any static web hosting service including Vercel or Decap CMS
- **No Backend Dependancy** - It does not depend on backend. It executes all http calls on the front end

### Design System
- **Component Library**: Custom implementation of shadcn/ui components
- **Typography**: Inter font family from Google Fonts
- **Color Scheme**: Professional blue primary colors with orange accents for CTAs
- **Layout**: Responsive grid system using Tailwind CSS utilities
- **Icons**: Lucide React icon library for consistent iconography

### Page Structure
- **Single Page Application**: All content on homepage with smooth scrolling navigation
- **Sections**: Hero with quote form, services overview, trust signals, process explanation, testimonials, FAQ, and contact
- **Quote Form**: Multi-step form with vehicle selection, route planning, and contact information
- **Vehicle Data**: NHTSA API integration for vehicle make/model lookup

## External Dependencies

### Third-Party Services
- **NHTSA API**: Vehicle make and model data for quote form
- **Google Fonts**: Inter font family for typography
- **Replit**: Development environment with specific vite plugins

### Key Libraries
- **UI Framework**: React 18 with TypeScript
- **Form Handling**: React Hook Form with Hookform resolvers
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icon library
- **Components**: Radix UI primitives for accessible components
- **Carousel**: Embla Carousel for image/content sliders
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript compiler for type checking
- **Session Storage**: connect-pg-simple for PostgreSQL session management

### Asset Management
- **Images**: Static assets stored in attached_assets directory
- **Vehicle Data**: JSON file with vehicle makes for form dropdowns
- **Design Guidelines**: Markdown documentation for design system consistency
