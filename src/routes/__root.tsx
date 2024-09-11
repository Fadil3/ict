import { Breadcrumb, ConfigProvider, Layout } from 'antd'
import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import React, { Suspense } from 'react'
import logo from '../assets/logo.webp'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { QueryClient } from '@tanstack/react-query'
import BreadCrumbGenerator from '../components/BreadCrumbItems'

const { Header, Content, Footer } = Layout

const TanStackRouterDevtools =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      )

const RootComponent = () => {
  const loc = useLocation()
  const breadcrumbItems: BreadcrumbItemType[] = BreadCrumbGenerator(
    loc.pathname
  )
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4B7273',
          },
        }}
      >
        <Layout>
          <Header className="header">
            <img src={logo} alt="Inti Corp Teknologi" width={160} height={50} />
          </Header>
          <Content style={{ padding: '50px 100px', backgroundColor: 'white' }}>
            <Breadcrumb items={breadcrumbItems} />
            <div
              style={{
                minHeight: 280,
                paddingTop: '20px',
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED |
            mrayhanfadil @ Inti Tech Corpora
          </Footer>
        </Layout>
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
      </ConfigProvider>
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})
