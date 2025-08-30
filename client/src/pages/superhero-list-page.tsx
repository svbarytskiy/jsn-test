import { SuperheroList } from '@/features/superhero-list'
import { PageHeader } from '@/shared/components/page-header'

export const SuperheroListPage = () => {
  return (
    <section className="w-full flex justify-center flex-col">
      <PageHeader title="Superheroes" />
      <SuperheroList />
    </section>
  )
}
