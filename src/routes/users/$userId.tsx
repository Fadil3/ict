import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import dayjs from 'dayjs'
import {
  Avatar,
  Card,
  Col,
  Row,
  Space,
  Spin,
  Table,
  TableProps,
  Typography,
} from 'antd'

import useUserManagement from '../../hooks/useUserManagement'
import { balanceReducer, currency } from '../../utils'
import { Transaction } from '../../utils/users'
import DetailRow from '../../components/table/DetailRow'

const { Text } = Typography

const UserDetailComponent = () => {
  const params = Route.useParams()
  const { getUser } = useUserManagement()
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', params.userId],
    queryFn: () => getUser(params.userId),
  })
  const getInitialName = (firstName: string, lastName: string): string => {
    return firstName[0].toUpperCase() + lastName[0].toUpperCase()
  }

  const columns: TableProps<Transaction>['columns'] = [
    {
      title: 'No.',
      key: 'index',
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      hidden: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => {
        const formattedAmount = currency(Math.abs(amount)).replace('Rp', '')
        return amount < 0 ? (
          <Text type="danger">{`(Rp${formattedAmount},-)`}</Text>
        ) : (
          <Text>{`Rp${formattedAmount},-`}</Text>
        )
      },
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => dayjs(timestamp).format('DD/MM/YYYY'),
    },
  ]

  if (isLoading) return <Spin size="large" />
  if (error) return <Text type="danger">Error loading user data</Text>
  if (!user) return <Text>User not found</Text>

  return (
    <>
      <fieldset
        style={{
          borderRadius: '8px',
          border: '1px solid #B3B3B3',
          width: 'fit-content',
          marginBottom: '20px',
        }}
      >
        <legend>
          <Text strong style={{ color: '#4B7273' }}>
            Detail Information
          </Text>
        </legend>
        <Space>
          <Avatar
            size={108}
            style={{
              background: '#D9D9D9',
              color: '#4B7273',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '60px',
            }}
          >
            {getInitialName(user.profile.firstName, user.profile.lastName)}
          </Avatar>
          <div className="">
            <table cellPadding="8" cellSpacing="0">
              <tbody>
                <DetailRow
                  label="Full Name"
                  value={`${user.profile.firstName} ${user.profile.lastName}`}
                />
                <DetailRow label="E-mail" value={user.email} />
                <DetailRow
                  label="Phone Number"
                  value={`+62${user.profile.phone}`}
                />
                <DetailRow
                  label="Total Balance"
                  value={currency(
                    balanceReducer(user.financial?.accounts || [])
                  )}
                />
              </tbody>
            </table>
          </div>
        </Space>
      </fieldset>
      {user.financial?.accounts && user.financial.accounts.length > 0 ? (
        <Row gutter={[8, 8]}>
          {user.financial.accounts.map((account, index) => (
            <Col key={account.accountId} span={8}>
              <Card
                style={{
                  marginBottom: '20px',
                  background:
                    'linear-gradient(180deg, #E7EDEB 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              >
                <table style={{ width: '60%', marginBottom: '16px' }}>
                  <tbody>
                    <DetailRow label="Account ID" value={account.accountId} />
                    <DetailRow
                      label="Balance"
                      value={currency(account.balance)}
                    />
                  </tbody>
                </table>
                <Table
                  className="transparent-table"
                  columns={columns}
                  dataSource={account.transactions}
                  pagination={false}
                  size="small"
                  scroll={{ y: 240 }}
                  rowKey={(record) => record.transactionId}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <Text type="secondary">
            No account information available for this user.
          </Text>
        </Card>
      )}
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
