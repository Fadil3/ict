import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <Button icon={<UserOutlined />}>
        <Link to="/users">Users Management</Link>
      </Button>
    </div>
  )
}
