import type { FC, ReactNode } from 'react'
import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Separator } from '../ui/separator'

interface Props {
  title: string
  children: ReactNode
}

export const PageLayout: FC<Props> = ({ title, children }) => {
  return (
    <div className="flex-1 flex flex-col w-full">
      <header className="p-3 md:p-5 flex">
        <SidebarTrigger size="lg" className="mr-2" />
        <Separator orientation="vertical" />
        <h2 className="ml-3 text-xl font-semibold">{title}</h2>
      </header>
      <main className="flex-1 p-3 md:p-5 overflow-auto">{children}</main>
    </div>
  )
}
