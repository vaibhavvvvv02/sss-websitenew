import http from './http'

export interface QuoteFormData {
  name: string
  phone: string
  email?: string
  type: string
  message?: string
  source?: string
}

export interface ClaimFormData {
  name: string
  phone: string
  email?: string
  type: string
  desc?: string
  source?: string
}

/** Generic quote / contact submission */
export async function submitQuote(data: QuoteFormData) {
  const response = await http.post('/api/quote', data)
  return response.data
}

/** Claim registration submission */
export async function submitClaim(data: ClaimFormData) {
  const response = await http.post('/api/claim', data)
  return response.data
}
