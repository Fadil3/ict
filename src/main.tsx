import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router'
import { Spin } from 'antd'

import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <Spin />,
  defaultErrorComponent:
    () =>
    ({ error }) => <ErrorComponent error={error} />,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPendingMinMs: 0,
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} defaultPreload="intent" />
      </QueryClientProvider>
    </StrictMode>
  )
}
