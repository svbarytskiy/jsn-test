import { CreateSuperheroForm } from '@/features/create-superhero-form'
import { PageHeader } from '@/shared/components/page-header'

export const SuperheroAddPage = () => {
  return (
    <section className="w-full flex justify-center flex-col">
      <PageHeader title="Add new Superhero" />
      <CreateSuperheroForm />
    </section>
  )
}
