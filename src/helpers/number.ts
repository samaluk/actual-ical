const {
  LOCALE = 'en-US',
  CURRENCY = 'USD',
} = process.env

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  signDisplay: 'always',
})

export const formatCurrency = (value: number, amountInCents = true) => {
  const amount = amountInCents ? value / 100 : value
  return currencyFormatter.format(amount)
}
