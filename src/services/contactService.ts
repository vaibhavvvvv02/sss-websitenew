import http from './http'

/** Contact Us — /website/contact-us
 *  Payload: { firstName, lastName, email, message }
 */
export async function submitContact(data: {
  name: string
  email?: string
  message?: string
}) {
  const nameParts = data.name.trim().split(' ')
  const firstName = nameParts[0] || data.name
  const lastName  = nameParts.slice(1).join(' ') || ''
  const response = await http.post('/website/contact-us', {
    firstName,
    lastName,
    email:   data.email   || '',
    message: data.message || '',
  })
  return response.data
}

/** Career — /website/career
 *  Payload: FormData { fullName, email, mobileNumber, yearsOfExperience, resume? }
 */
export async function submitCareer(data: {
  name: string
  phone: string
  email?: string
  exp?: string
  role?: string
  message?: string
  resume?: File | null
}) {
  const payload = new FormData()
  payload.append('fullName',          data.name)
  payload.append('email',             data.email || '')
  payload.append('mobileNumber',      data.phone)
  payload.append('yearsOfExperience', data.exp   || '')
  if (data.role)    payload.append('role',    data.role)
  if (data.message) payload.append('message', data.message)
  if (data.resume)  payload.append('resume',  data.resume)
  const response = await http.post('/website/career', payload)
  return response.data
}

/** Get Quote / POSP / Products — /website/get-quote
 *  Payload: { name, phone, email }
 */
export async function submitGetQuote(data: {
  name: string
  phone: string
  email?: string
}) {
  const response = await http.post('/website/get-quote', {
    name:  data.name,
    phone: data.phone,
    email: data.email || '',
  })
  return response.data
}

/** Claim — reuses /website/contact-us */
export async function submitClaim(data: {
  name: string
  phone?: string
  email?: string
  type?: string
  desc?: string
}) {
  const nameParts = data.name.trim().split(' ')
  const response = await http.post('/website/contact-us', {
    firstName: nameParts[0] || data.name,
    lastName:  nameParts.slice(1).join(' ') || '',
    email:     data.email || '',
    message:   `Claim Type: ${data.type || ''}. ${data.desc || ''}`.trim(),
  })
  return response.data
}

/** Legacy alias — used by GetQuote, POSP, Products pages */
export async function submitQuote(data: {
  name: string
  phone: string
  email?: string
  type?: string
  message?: string
  source?: string
}) {
  return submitGetQuote({ name: data.name, phone: data.phone, email: data.email })
}

// Legacy types kept for backward compatibility
export interface QuoteFormData {
  name: string; phone: string; email?: string; type: string; message?: string; source?: string
}
export interface ClaimFormData {
  name: string; phone: string; email?: string; type: string; desc?: string; source?: string
}
