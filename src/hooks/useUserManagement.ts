import { useQuery } from '@tanstack/react-query'
import { Content, ResponseUsers, User } from '../utils/users'
import { queryClient } from '../main'

const useUserManagement = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_BASE_URL}/users/`).then(async (res) => {
        const data: ResponseUsers = await res.json()
        localStorage.setItem('users', JSON.stringify(data))
        return data.content.map((content) => content.user)
      }),
    staleTime: 300000,
    initialData: () => {
      const savedUsers = localStorage.getItem('users')

      if (!savedUsers) {
        return undefined
      }

      const parsed: ResponseUsers = JSON.parse(savedUsers)
      return parsed.content.map((content) => content.user)
    },
  })

  const addUser = (newUser: User) => {
    queryClient.setQueryData(['users'], (old: User[] | undefined) => {
      const updatedUsers = old ? [...old, newUser] : [newUser]
      updateLocalStorage(updatedUsers)
      return updatedUsers
    })
  }

  const updateUser = (updatedUser: User) => {
    queryClient.setQueryData(['users'], (old: User[] | undefined) => {
      const updatedUsers = old
        ? old.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        : []
      updateLocalStorage(updatedUsers)
      return updatedUsers
    })
  }

  const deleteUser = (userId: string) => {
    queryClient.setQueryData(['users'], (old: User[] | undefined) => {
      const updatedUsers = old ? old.filter((user) => user.id !== userId) : []
      updateLocalStorage(updatedUsers)
      return updatedUsers
    })
  }

  const getUser = async (userId: string): Promise<User> => {
    const users: User[] | undefined = queryClient.getQueryData(['users'])

    if (users) {
      const user = users.find((user) => user.id === userId)
      if (user) return user
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/`,
      {
        referrerPolicy: 'unsafe-url',
      }
    )
    const data: { user: User } = await response.json()
    return data.user
  }

  const searchUsers = (query: string): User[] => {
    const users: User[] = queryClient.getQueryData(['users']) || []
    return users.filter((user) =>
      user.email.toLowerCase().includes(query.toLowerCase())
    )
  }

  const updateLocalStorage = (updatedUsers: User[]) => {
    const localUsers: ResponseUsers = JSON.parse(
      localStorage.getItem('users') ?? ''
    )

    const res: Content[] = []
    updatedUsers.map((users) => {
      const user = {
        user: users,
      }
      res.push(user)
    })
    localUsers.content = res
    localStorage.setItem('users', JSON.stringify(localUsers))
  }

  return {
    data,
    error,
    isLoading,
    addUser,
    updateUser,
    deleteUser,
    getUser,
    searchUsers,
  }
}

export default useUserManagement
