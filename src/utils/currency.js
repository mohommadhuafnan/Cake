export function formatPrice(amount, locale = 'en') {
  return `QAR ${amount.toLocaleString('en-QA')}`
}

export const CURRENCIES = {
  QAR: { code: 'QAR', symbol: 'QAR', locale: 'en-QA' },
}
