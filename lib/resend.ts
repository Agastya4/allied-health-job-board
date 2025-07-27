import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'no-reply@yourdomain.com',
    to,
    subject: 'Verify your email address',
    html: `<p>Thank you for signing up! Please verify your email by clicking the link below:</p>
           <p><a href="${verificationUrl}">Verify Email</a></p>
           <p>If you did not sign up, you can ignore this email.</p>`
  })
} 