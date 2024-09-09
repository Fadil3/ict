import { Account } from './users'

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const currency = (balance: number): string => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })

  return formatter.format(balance)
}

export const balanceReducer = (accounts: Account[]): number => {
  return (
    accounts?.reduce((total: number, account: Account) => {
      return total + account.balance
    }, 0) || 0
  )
}
