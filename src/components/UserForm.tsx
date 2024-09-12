import { useEffect, useState, useRef, useCallback } from 'react'

import {
  Button,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Popconfirm,
} from 'antd'
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { FormInstance } from 'antd'
import type { Dayjs } from 'dayjs'

import { Account, Financial } from '../utils/users'
import { currency } from '../utils'
import DetailRow from './table/DetailRow'

const { Text } = Typography

export interface FieldType {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  gender: string
  birthdate?: Dayjs
  id?: string
}

interface UserFormProps {
  isOpen: boolean
  toggle: () => void
  values?: FieldType
  onFinish: (values: FieldType, financial: Financial | null) => void
  form: FormInstance
  data?: FieldType
  financial?: Financial | null
}

const UserForm = ({
  isOpen,
  toggle,
  onFinish,
  form,
  data,
  financial,
}: UserFormProps) => {
  const [accounts, setAccounts] = useState<Account[]>(financial?.accounts || [])
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null)
  const [accountForm] = Form.useForm()
  const accountFormRef = useRef<HTMLDivElement>(null)
  const resetAccountForm = useCallback(() => {
    setIsAddingAccount(false)
    setEditingAccountId(null)
    accountForm.resetFields()
  }, [accountForm])

  useEffect(() => {
    if (isOpen) {
      if (data) {
        form.setFieldsValue(data)
      }
      setAccounts(financial?.accounts || [])
    } else {
      resetAccountForm()
      form.resetFields()
    }
  }, [isOpen, data, form, financial, resetAccountForm])

  const handleAccountFormSubmit = (values: Account) => {
    const newAccount: Account = {
      accountId: values.accountId,
      accountType: values.accountType,
      balance: parseFloat(values.balance.toString()),
      transactions: [],
    }

    if (editingAccountId) {
      setAccounts(
        accounts.map((a) => {
          if (a.accountId === editingAccountId) {
            return { ...newAccount, transactions: a.transactions }
          }
          return a
        })
      )
    } else {
      setAccounts([...accounts, newAccount])
    }

    setIsAddingAccount(false)
    setEditingAccountId(null)
    accountForm.resetFields()
  }

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter((a) => a.accountId !== accountId))
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccountId(account.accountId)
    setIsAddingAccount(true)
    accountForm.setFieldsValue(account)

    setTimeout(() => {
      accountFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  const handleFormSubmit = (values: FieldType) => {
    const updatedFinancial: Financial | null =
      accounts.length > 0 ? { accounts } : null
    onFinish(values, updatedFinancial)
  }

  const handleDrawerClose = () => {
    resetAccountForm()
    toggle()
  }

  return (
    <Drawer closable={false} open={isOpen}>
      <Flex justify="space-between" align="center">
        <Text
          strong
          style={{ fontSize: '24px', color: '#4B7273', width: 'fit-content' }}
        >
          {data ? 'Edit User' : 'Add New User'}
        </Text>
        <Button
          icon={<CloseOutlined />}
          type="text"
          onClick={handleDrawerClose}
        />
      </Flex>
      <Form
        name="basic"
        layout="vertical"
        clearOnDestroy={true}
        onFinish={handleFormSubmit}
        form={form}
        preserve={false}
        scrollToFirstError={true}
        style={{ marginTop: '20px' }}
      >
        <Form.Item<FieldType>
          label="id"
          name="id"
          rules={[{ message: 'Please input your id!' }]}
          hidden
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>First Name</Text>}
          name="firstName"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input placeholder="Please input your first name!" />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>Last Name</Text>}
          name="lastName"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input placeholder="Please input your last name!" />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>Username</Text>}
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Please input your username!" />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>Email</Text>}
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input placeholder="Please input your E-mail!" />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>Phone Number</Text>}
          name="phone"
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input
            addonBefore="+62"
            placeholder="Please input your phone number!"
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>Gender</Text>}
          name="gender"
          rules={[
            {
              required: true,
              message: 'Please input your gender!',
            },
          ]}
        >
          <Select
            placeholder="Please select your gender!"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label={<Text strong>Birthdate</Text>}
          name="birthdate"
          rules={[
            {
              required: true,
              message: 'Please input your birthdate!',
            },
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YY"
            placeholder="DD/MM/YY"
          />
        </Form.Item>
        <hr
          style={{
            border: '1px solid #4B7273',
            width: '100%',
            margin: '24px 0',
          }}
        />
        <Text
          strong
          style={{
            fontSize: '24px',
            color: '#4B7273',
            width: 'fit-content',
            marginBottom: '16px',
            display: 'block',
          }}
        >
          Account Details
        </Text>
        <Form.Item>
          {accounts.map((account) => (
            <div
              key={account.accountId}
              style={{
                border: '1px solid #B3B3B3',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <table cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                <tbody>
                  <DetailRow label="Account ID" value={account.accountId} />
                  <DetailRow label="Account Type" value={account.accountType} />
                  <DetailRow
                    label="Balance"
                    value={currency(account.balance)}
                  />
                </tbody>
              </table>
              <Space direction="vertical" size="small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEditAccount(account)}
                />
                <Popconfirm
                  title="Are you sure you want to delete this account?"
                  onConfirm={() => handleDeleteAccount(account.accountId)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </Space>
            </div>
          ))}
          <div ref={accountFormRef}>
            {isAddingAccount && (
              <Form
                form={accountForm}
                layout="vertical"
                onFinish={handleAccountFormSubmit}
                style={{ marginBottom: '16px' }}
              >
                <Form.Item
                  name="accountId"
                  label={<Text strong>Account ID</Text>}
                  rules={[
                    { required: true, message: 'Please input the account ID' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="accountType"
                  label={<Text strong>Account Type</Text>}
                  rules={[
                    {
                      required: true,
                      message: 'Please select an account type',
                    },
                  ]}
                >
                  <Select>
                    <Select.Option value="savings">Savings</Select.Option>
                    <Select.Option value="checking">Checking</Select.Option>
                    <Select.Option value="credit">Credit</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="balance"
                  label={<Text strong>Balance</Text>}
                  rules={[
                    { required: true, message: 'Please enter the balance' },
                  ]}
                >
                  <Input
                    placeholder="Please enter the balance"
                    prefix="Rp."
                    type="number"
                    step="0.01"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  onClick={() => accountForm.submit()}
                  style={{ width: '100%' }}
                >
                  {editingAccountId ? 'Save' : 'Add Account'}
                </Button>
              </Form>
            )}
          </div>
          {!isAddingAccount && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddingAccount(true)}
              style={{ width: '100%' }}
            >
              Add Account
            </Button>
          )}
        </Form.Item>
        <Form.Item>
          <Flex justify="center" gap="14px" align="center">
            <Button
              style={{ width: '150px' }}
              type="default"
              onClick={handleDrawerClose}
            >
              Cancel
            </Button>
            <Button style={{ width: '150px' }} type="primary" htmlType="submit">
              {data ? 'Save' : 'Add'}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default UserForm
