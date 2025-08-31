import { type FC } from 'react'

interface SuperheroInfoProps {
  nickname: string
  real_name: string
  origin_description: string
  superpowers: string[]
  catch_phrase: string
}

export const SuperheroInfo: FC<SuperheroInfoProps> = ({
  nickname,
  real_name,
  origin_description,
  superpowers,
  catch_phrase,
}) => {
  return (
    <div className="p-6 lg:w-1/2">
      <h1 className="mb-2 text-xl font-bold text-gray-900">{nickname}</h1>
      <h2 className="mb-6 text-base text-gray-600">Real name: {real_name}</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Origin description
        </h3>
        <p className="leading-relaxed text-gray-600">{origin_description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Superpowers:</h3>
        <ul className="list-inside list-disc text-gray-600">
          {superpowers.map((power, index) => (
            <li key={index}>{power}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Catch phrase</h3>
        <p className="italic text-gray-600">"{catch_phrase}"</p>
      </div>
    </div>
  )
}
