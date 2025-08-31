import { type FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Edit2, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clearSelectedSuperhero } from '@/app/store/slices/superheroes/superheroes-slice'
import {
  deleteSuperhero,
  fetchSuperheroByNickname,
} from '@/app/store/slices/superheroes/superheroes-thunk'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { Button } from '@/shared/components/ui/button'
import { SuperheroImageCarousel } from './components/superhero-image-carousel'
import { SuperheroInfo } from './components/superhero-info'
import { DeleteALertDialog } from './components/delete-alert-dialog'

export const SuperheroDetails: FC = () => {
  const { nickname } = useParams<{ nickname: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedSuperhero, loading, error } = useAppSelector(
    state => state.superheroes,
  )

  useEffect(() => {
    if (nickname) {
      dispatch(fetchSuperheroByNickname(nickname))
    }

    return () => {
      dispatch(clearSelectedSuperhero())
    }
  }, [dispatch, nickname])
  const handleDelete = async () => {
    const resultAction = await dispatch(deleteSuperhero(nickname as string))
    if (deleteSuperhero.fulfilled.match(resultAction)) {
      navigate('/')
    }
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
      <div className="flex h-80 w-full items-center justify-center text-red-500">
        Error: {error}
      </div>
    )
  }

  if (!selectedSuperhero) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        Superhero not found.
      </div>
    )
  }

  return (
    <div className="container mx-auto p-3">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/">
          <Button variant="outline">
            <ChevronLeft className="h-4 w-4" /> Back to list
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Link to={`/edit/${selectedSuperhero.nickname}`}>
            <Button
              variant="outline"
              size="icon"
              className="text-orange-500 border-orange-500 hover:bg-orange-50"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteALertDialog handleDelete={handleDelete} />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow-xl lg:flex">
        <SuperheroInfo {...selectedSuperhero} />
        <SuperheroImageCarousel
          images={selectedSuperhero.images}
          nickname={selectedSuperhero.nickname}
        />
      </div>
    </div>
  )
}
