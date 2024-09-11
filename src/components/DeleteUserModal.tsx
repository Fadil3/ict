import React from 'react'
import { Modal, Typography, Button, Space, Flex } from 'antd'
import { User } from '../utils/users'
import DetailRow from './table/DetailRow'

const { Text } = Typography

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  user: User | null
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  user,
}) => {
  return (
    <Modal
      title={
        <Text
          style={{ fontSize: '24px', color: '#4B7273', width: 'fit-content' }}
        >
          Delete User
        </Text>
      }
      centered
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Space direction="vertical" size="small">
        <Text style={{ fontSize: '16px' }}>
          Are you sure you want to delete this user?
        </Text>
        <div
          style={{
            border: '1px solid #B3B3B3',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <table cellPadding="8" cellSpacing="0">
            <tbody>
              <DetailRow
                label="Full Name"
                value={`${user?.profile.firstName} ${user?.profile.lastName}`}
              />
              <DetailRow label="E-mail" value={user?.email} />
              <DetailRow
                label="Phone Number"
                value={`+62${user?.profile.phone}`}
              />
            </tbody>
          </table>
        </div>
        <Text strong>
          The user will be removed from the system after receiving admin
          approval.
        </Text>
        <Flex justify="center" gap="14px" align="center">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            danger
            onClick={onDelete}
            style={{ backgroundColor: '#4B7273', borderColor: '#4B7273' }}
          >
            Delete
          </Button>
        </Flex>
      </Space>
    </Modal>
  )
}

export default DeleteUserModal
