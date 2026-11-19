export interface TeamMember {
  id: string
  name: string
  role: string
  photo: string
  bio: string
  linkedinUrl?: string
}

export interface Testimonial {
  id: string
  name: string
  company?: string
  rating: 1 | 2 | 3 | 4 | 5
  text: string
  photo?: string
}

export interface InsuranceProduct {
  id: string
  name: string
  category: 'individual' | 'health' | 'life' | 'corporate' | 'surety'
  description: string
  icon?: string
  slug: string
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
