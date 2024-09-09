import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Input, Flex, Space, Table, Popover, Form } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'

import type { TableProps } from 'antd'
import useUserManagement from '../../hooks/useUserManagement'
import { User } from '../../utils/users'
import UserForm, { FieldType } from '../../components/UserForm'
import { balanceReducer, currency, generateUUID } from '../../utils'
import moment from 'moment'

const UsersRootComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [initialData, setInitialData] = useState<FieldType | undefined>(
    undefined
  )
  const [editId, setEditId] = useState<string | null>(null)
  const { data, isLoading, deleteUser, addUser, getUser, updateUser } =
    useUserManagement()
  const [form] = Form.useForm()

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Fullname',
      key: 'fullname',
      render: (_, record) => (
        <span>
          {record.profile.firstName} {record.profile.lastName}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      key: 'phone',
      render: (_, record) => <span>0{record.profile.phone}</span>,
    },
    {
      title: 'Total Balance',
      key: 'total',
      render: (_, record) => {
        const formattedBalance = currency(
          balanceReducer(record?.financial?.accounts ?? [])
        )
        return <span>{formattedBalance}</span>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Popover
            placement="right"
            arrow={false}
            content={
              <Space direction="vertical" size="small">
                <Button
                  size="small"
                  type="text"
                  icon={<EyeOutlined color="blue" />}
                >
                  <Link
                    to={`/users/$userId`}
                    params={{
                      userId: record.id,
                    }}
                  >
                    View Detail
                  </Link>
                </Button>
                <Button
                  size="small"
                  style={{ fontWeight: 'bold' }}
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    handleEdit(record.id)
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  style={{ fontWeight: 'bold' }}
                  type="text"
                  icon={<DeleteOutlined color="red" />}
                  onClick={() => {
                    deleteUser(record.id)
                  }}
                >
                  Delete
                </Button>
              </Space>
            }
          >
            <Button
              icon={
                <EllipsisOutlined
                  size={20}
                  rotate={90}
                  style={{ cursor: 'pointer' }}
                />
              }
            />
          </Popover>
        </>
      ),
    },
  ]

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      form.resetFields()
      setInitialData(undefined)
      setEditId(null)
    }
    setIsDrawerOpen((prev) => !prev)
  }

  useEffect(() => {
    if (editId) {
      const user: User = getUser(editId)
      const initialData: FieldType = {
        id: user.id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        username: user.username,
        email: user.email,
        phone: user.profile.phone,
        gender: user.profile.gender,
        birthdate: moment(user.profile.birthday),
      }
      setInitialData(initialData)
    }
  }, [editId])

  const handleEdit = (id: string) => {
    setEditId(id)
    toggleDrawer()
  }

  const onFinish = (values: FieldType) => {
    const date = moment(values.birthdate).format('DD/MM/YY')
    const formData: User = {
      id: values.id ?? generateUUID(),
      username: values.username,
      email: values.email,
      profile: {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        birthday: date,
        phone: values.phone,
      },
      financial: null,
    }

    if (values.id) {
      updateUser(formData)
    } else {
      addUser(formData)
    }

    toggleDrawer()
  }

  return (
    <>
      <UserForm
        isOpen={isDrawerOpen}
        toggle={toggleDrawer}
        onFinish={onFinish}
        form={form}
        data={initialData}
      />
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center">
          <Input
            size="middle"
            placeholder="search..."
            prefix={<SearchOutlined />}
            style={{ width: '230px' }}
            allowClear
            // onChange={}
          />
          <Button
            type="primary"
            size="middle"
            icon={<PlusOutlined />}
            onClick={toggleDrawer}
          >
            Add
          </Button>
        </Flex>
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
          rowKey="id"
        />
      </Space>
    </>
  )
}

export const Route = createFileRoute('/users/')({
  component: UsersRootComponent,
})
