import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SuperheroListPage } from '@/pages/superhero-list-page'
import { SuperheroAddPage } from '@/pages/superhero-add-page'
import { SuperheroEditPage } from '@/pages/superhero-edit-page'
import { SuperheroDetailsPage } from '@/pages/superhero-details-page'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SuperheroListPage />} />
        <Route path="/superhero/:id" element={<SuperheroDetailsPage />} />
        <Route path="/add" element={<SuperheroAddPage />} />
        <Route path="/edit/:id" element={<SuperheroEditPage />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
