import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppSidebar } from '@/shared/components/lauout/app-sidebar'
import { SidebarProvider } from '@/shared/components/ui/sidebar'
import { APP_ROUTES } from '@/shared/constants/routes'
import { PageLayout } from '@/shared/components/lauout/page-layout'

const AppRoutes = () => {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex w-full">
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
        </div>
      </SidebarProvider>
    </Router>
  )
}

export default AppRoutes
