import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail({ to, token }: { to: string; token: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alliedhealthjobs.au'
  const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`
  return resend.emails.send({
    from: 'contact@alliedhealthjobs.au',
    to,
    subject: 'Verify your email address',
    html: `<p>Thank you for signing up! Please verify your email by clicking the link below:</p>
           <p><a href="${verifyUrl}">Verify Email</a></p>
           <p>If you did not sign up, you can ignore this email.</p>`
  })
} 