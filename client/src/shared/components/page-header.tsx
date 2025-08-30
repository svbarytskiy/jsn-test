import type { FC } from 'react'

interface Props {
  title?: string
}

export const PageHeader: FC<Props> = ({ title }) => {
  return (
    <>
      <div className="p-3 md:p-5 ">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
    </>
  )
}
