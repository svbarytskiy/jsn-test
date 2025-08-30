import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  name: string
  image: string
}

export const SuperheroCard: FC<Props> = ({ name, image }) => {
  return (
    <Link to={`/superhero/${name}`}>
      <div className="flex flex-col items-center justify-center max-w-60 p-2 text-center bg-white border border-slate-200 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
        <img src={image} alt={name} className="w-55 h-55 rounded-md mb-3" />
        <h3 className="text-xl font-bold text-slate-700">{name}</h3>
      </div>
    </Link>
  )
}
