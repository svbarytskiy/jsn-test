import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface ImageListItemProps {
  image: string | File
  onRemove: () => void
}

export const ImageListItem = ({ image, onRemove }: ImageListItemProps) => {
  const imageUrl =
    typeof image === 'string' ? image : URL.createObjectURL(image)
  const altText = typeof image === 'string' ? 'existing-image' : image.name

  return (
    <div className="relative h-32 w-full overflow-hidden rounded-lg border">
      <img
        src={imageUrl}
        alt={altText}
        className="h-full w-full object-cover"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onRemove}
        className="absolute right-1 top-1 h-6 w-6 rounded-full opacity-80"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
