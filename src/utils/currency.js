export function formatPrice(amount, locale = 'en') {
  if (locale === 'ar') {
    return `${amount.toLocaleString('ar-QA')} ر.ق`
  }
  return `QAR ${amount.toLocaleString('en-QA')}`
}

export const CURRENCIES = {
  QAR: { code: 'QAR', symbol: 'QAR', locale: 'en-QA', arSymbol: 'ر.ق' },
}
