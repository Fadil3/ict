import { Button, DatePicker, Drawer, Flex, Form, Input, Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

import type { FormInstance } from 'antd'
import { useEffect } from 'react'
import { MomentInput } from 'moment'

export interface FieldType {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  gender: string
  birthdate?: MomentInput
  id?: string
}

interface UserFormProps {
  isOpen: boolean
  toggle: () => void
  values?: FieldType
  onFinish: (values: FieldType) => void
  form: FormInstance
  data?: FieldType
}

const UserForm = ({ isOpen, toggle, onFinish, form, data }: UserFormProps) => {
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data, form])
  return (
    <Drawer closable={false} open={isOpen}>
      <Flex justify="space-between" align="center">
        <p>Add New User</p>
        <Button icon={<CloseOutlined />} type="text" onClick={toggle} />
      </Flex>
      <Form
        name="basic"
        layout="vertical"
        clearOnDestroy={true}
        onFinish={onFinish}
        form={form}
        preserve={false}
        scrollToFirstError={true}
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
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Email"
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
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Phone Number"
          name="phone"
          rules={[
            {
              required: true,
              message: 'Please input your phone number!',
            },
          ]}
        >
          <Input addonBefore="+62" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
              message: 'Please input your gender!',
            },
          ]}
        >
          <Select
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
          />
        </Form.Item>
        <Form.Item<FieldType>
          label="Birthdate"
          name="birthdate"
          rules={[
            {
              required: true,
              message: 'Please input your birthdate!',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YY" />
        </Form.Item>

        <Form.Item>
          <Flex justify="center" gap="14px" align="center">
            <Button
              style={{
                width: '150px',
              }}
              type="dashed"
              onClick={toggle}
            >
              Cancel
            </Button>
            <Button
              style={{
                width: '150px',
              }}
              type="primary"
              htmlType="submit"
            >
              {data ? 'Save' : 'Add'}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default UserForm
