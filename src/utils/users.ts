export interface ResponseUsers {
  status: string
  message: string
  business: boolean
  error: boolean
  transactionId: string
  content: Content[]
}

export interface Content {
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  profile: Profile
  financial?: Financial | null
}

export interface Profile {
  firstName: string
  lastName: string
  gender: string
  birthday: string
  phone: string
}

export interface Financial {
  accounts: Account[]
}

export interface Account {
  accountId: string
  balance: number
  accountType: string
  transactions: Transaction[]
}

export interface Transaction {
  transactionId: string
  amount: number
  timestamp: string
}
