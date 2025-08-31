import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppSidebar, PageLayout } from '@/shared/components/layout'
import { SidebarProvider } from '@/shared/components/ui'
import { APP_ROUTES } from '@/shared/constants/routes'
import { ErrorBoundary } from '@/shared/components'

const AppRoutes = () => {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full">
          <ErrorBoundary>
            <Routes>
              {APP_ROUTES.map(route => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <PageLayout title={route.title}>
                      <route.component />
                    </PageLayout>
                  }
                />
              ))}
            </Routes>
          </ErrorBoundary>
        </div>
      </SidebarProvider>
    </Router>
  )
}

export default AppRoutes
