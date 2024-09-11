import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

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
import type { TableProps } from 'antd'

import useUserManagement from '../../hooks/useUserManagement'
import { Financial, User } from '../../utils/users'
import UserForm, { FieldType } from '../../components/UserForm'
import { balanceReducer, currency, generateUUID } from '../../utils'
import DeleteUserModal from '../../components/DeleteUserModal'

const UsersRootComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [initialData, setInitialData] = useState<FieldType | undefined>(
    undefined
  )
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const {
    data,
    isLoading,
    deleteUser,
    addUser,
    getUser,
    updateUser,
    searchUsers,
  } = useUserManagement()

  const filteredData = searchQuery ? searchUsers(searchQuery) : data
  const [form] = Form.useForm()

  const columns: TableProps<User>['columns'] = [
    {
      title: 'No',
      key: 'no',
      render: (_, __, index) => <span>{index + 1}</span>,
    },
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
      render: (_, record) => <span>+62{record.profile.phone}</span>,
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
                  icon={<EyeOutlined />}
                  style={{ color: '#1677ff' }}
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
                  type="text"
                  icon={<EditOutlined />}
                  style={{ color: '#fa8c16' }}
                  onClick={() => {
                    handleEdit(record.id)
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleDelete(record.id)
                  }}
                  danger
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
      setSelectedUser(null)
    }
    setIsDrawerOpen((prev) => !prev)
  }

  useEffect(() => {
    if (selectedUser) {
      const initialData: FieldType = {
        id: selectedUser.id,
        firstName: selectedUser.profile.firstName,
        lastName: selectedUser.profile.lastName,
        username: selectedUser.username,
        email: selectedUser.email,
        phone: selectedUser.profile.phone,
        gender: selectedUser.profile.gender,
        birthdate: dayjs(selectedUser.profile.birthday, 'DD/MM/YY'),
      }
      setInitialData(initialData)
      form.setFieldsValue(initialData)
    }
  }, [selectedUser, form])

  const handleEdit = (id: string) => {
    getUser(id).then((user) => {
      setSelectedUser(user)
      toggleDrawer()
    })
  }

  const handleDelete = (id: string) => {
    getUser(id).then((user) => {
      setSelectedUser(user)
      setIsModalOpen(true)
    })
  }

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id)
      setIsModalOpen(false)
      setSelectedUser(null)
    }
  }

  const onFinish = (values: FieldType, financial: Financial | null) => {
    const date = values.birthdate
      ? dayjs(values.birthdate).format('DD/MM/YY')
      : ''
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
      financial: financial,
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
        financial={selectedUser?.financial}
      />
      <DeleteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteConfirm}
        user={selectedUser}
      />
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Flex justify="space-between" align="center">
          <Input
            size="middle"
            placeholder="search..."
            prefix={<SearchOutlined />}
            style={{ width: '230px' }}
            allowClear
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
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
        <div
          className=""
          style={{
            marginBottom: '20px',
            borderRadius: '8px',
            background:
              'linear-gradient(180deg, #E7EDEB 0%, rgba(255, 255, 255, 0) 100%)',
          }}
        >
          <Table
            className="transparent-table"
            columns={columns}
            dataSource={filteredData}
            loading={isLoading}
            rowKey="id"
            pagination={false}
          />
        </div>
      </Space>
    </>
  )
}

export const Route = createFileRoute('/users/')({
  component: UsersRootComponent,
})
