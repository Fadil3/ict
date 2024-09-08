import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { HomeOutlined } from '@ant-design/icons'

const BreadCrumbGenerator = (location: string): BreadcrumbItemType[] => {
  const breadcrumbItems: BreadcrumbItemType[] = [
    {
      href: '/',
      title: (
        <HomeOutlined
          style={{
            color: '#4B7273',
            fontSize: '20px',
          }}
        />
      ),
    },
  ]

  if (location === '/') return breadcrumbItems

  const paths = location.split('/')
  for (let i = 1; i < paths.length - 1; i++) {
    breadcrumbItems.push({
      title: (
        <span
          style={{
            color: '#4B7273',
          }}
        >
          {paths[i]}
        </span>
      ),
      href: `/${paths[i]}`,
    })
  }

  breadcrumbItems.push({ title: paths[paths.length - 1] })

  return breadcrumbItems
}

export default BreadCrumbGenerator
