import { ImageListItem } from './image-list-item'

interface ImageListProps {
  images: Array<string | File>
  onRemove: (image: string | File) => void
}

export const ImageList = ({ images, onRemove }: ImageListProps) => {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {images.map((image, index) => (
        <ImageListItem
          key={typeof image === 'string' ? image : `${image.name}-${index}`}
          image={image}
          onRemove={() => onRemove(image)}
        />
      ))}
    </div>
  )
}
