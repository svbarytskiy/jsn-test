import { SuperheroAddPage } from '@/pages/superhero-add-page'
import { SuperheroDetailsPage } from '@/pages/superhero-details-page'
import { SuperheroEditPage } from '@/pages/superhero-edit-page'
import { SuperheroListPage } from '@/pages/superhero-list-page'

export const APP_ROUTES = [
  {
    path: '/',
    title: 'Superhero List',
    component: SuperheroListPage,
  },
  {
    path: '/add',
    title: 'Add Superhero',
    component: SuperheroAddPage,
  },
  {
    path: '/superhero/:nickname',
    title: 'Details of Superhero',
    component: SuperheroDetailsPage,
  },
  {
    path: '/edit/:nickname',
    title: 'Edit Superhero',
    component: SuperheroEditPage,
  },
]
