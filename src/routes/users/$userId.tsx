import { createFileRoute } from '@tanstack/react-router'
import useUserManagement from '../../hooks/useUserManagement'
import { Avatar, Space, Typography } from 'antd'
import { balanceReducer, currency } from '../../utils'

const { Text } = Typography

const UserDetailComponent = () => {
  const params = Route.useParams()
  const { getUser } = useUserManagement()
  const user = getUser(params.userId)
  const getInitialName = (firstName: string, lastName: string): string => {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase()
  }

  return (
    <>
      <fieldset
        style={{
          borderRadius: '16px',
          border: '2px solid green',
          width: 'fit-content',
        }}
      >
        <legend>
          <Text strong>Detail Information</Text>
        </legend>
        <Space>
          <Avatar
            size={80}
            style={{
              backgroundColor: '#fde3cf',
              color: '#f56a00',
              fontWeight: 'bold',
              fontSize: '36px',
            }}
          >
            {getInitialName(user.profile.firstName, user.profile.lastName)}
          </Avatar>
          <div className="">
            <table>
              <tr>
                <td>
                  <Text type="secondary" strong>
                    Full Name
                  </Text>
                </td>
                <td>
                  <Text
                    strong
                  >{`${user.profile.firstName} ${user.profile.lastName}`}</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text type="secondary" strong>
                    E-mail
                  </Text>
                </td>
                <td>
                  <Text strong>{user.email}</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text type="secondary" strong>
                    Phone Number
                  </Text>
                </td>
                <td>
                  <Text strong>+62{user.profile.phone}</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text type="secondary" strong>
                    Total Balance
                  </Text>
                </td>
                <td>
                  <Text strong>
                    {currency(balanceReducer(user.financial?.accounts || []))}
                  </Text>
                </td>
              </tr>
            </table>
          </div>
        </Space>
      </fieldset>
    </>
  )
}

export const Route = createFileRoute('/users/$userId')({
  params: {
    parse: ({ userId }) => ({ userId }),
    stringify: ({ userId }) => ({ userId: `${userId}` }),
  },
  component: UserDetailComponent,
})
