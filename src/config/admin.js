/** Admin access — only this email is routed to /admin after login */
export const ADMIN_EMAIL = 'mohommadhuafnan756@gmail.com'

export function isAdminEmail(email) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
}
