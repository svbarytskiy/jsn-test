import { setCurrentPage } from '@/app/store/slices/superheroes/superheroes-slice'
import { fetchSuperheroes } from '@/app/store/slices/superheroes/superheroes-thunk'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { Button } from '@/shared/components/ui/button'
import { Loader, ArrowBigLeft, ArrowBigRight } from 'lucide-react'
import { type FC, useEffect } from 'react'
import { SuperheroCard } from './components/superhero-card'

export const SuperheroList: FC = () => {
  const dispatch = useAppDispatch()
  const { list, loading, error, currentPage, totalItems } = useAppSelector(
    state => state.superheroes,
  )

  const itemsPerPage = 5

  useEffect(() => {
    dispatch(fetchSuperheroes({ page: currentPage, limit: itemsPerPage }))
  }, [dispatch, currentPage])

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage * itemsPerPage >= totalItems
  const hasSuperheroes = list.length > 0

  const handleNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1))
  }

  const handlePrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1))
  }

  if (loading) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-80 text-base flex justify-center items-center text-red-500 font-medium">
        Error: {error}
      </div>
    )
  }

  if (!hasSuperheroes) {
    return (
      <div className="w-full h-80 text-base flex justify-center items-center font-medium">
        No superheroes available.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-10">
        {list.map(superhero => (
          <SuperheroCard
            key={superhero._id}
            name={superhero.nickname}
            image={superhero.images[0]}
          />
        ))}
      </div>
      <div className="flex mt-8 space-x-4">
        <Button onClick={handlePrevPage} disabled={isFirstPage}>
          <ArrowBigLeft />
        </Button>
        <Button onClick={handleNextPage} disabled={isLastPage}>
          <ArrowBigRight />
        </Button>
      </div>
    </div>
  )
}
