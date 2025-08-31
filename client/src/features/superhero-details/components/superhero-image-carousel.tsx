import { type FC } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/shared/components/ui/carousel'

interface SuperheroImageCarouselProps {
  images: string[]
  nickname: string
}

export const SuperheroImageCarousel: FC<SuperheroImageCarouselProps> = ({
  images,
  nickname,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 lg:w-1/2">
      <Carousel className="mx-auto w-3/4">
        <CarouselContent>
          {images.map((imagePath, index) => (
            <CarouselItem
              key={index}
              className="flex h-96 items-center justify-center"
            >
              <img
                src={imagePath}
                alt={`${nickname} - ${index + 1}`}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </div>
  )
}
