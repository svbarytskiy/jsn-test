import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface ImageItemProps {
  file: File
  onRemove: () => void
}

export const ImageItem = ({ file, onRemove }: ImageItemProps) => {
  return (
    <div
      key={file.name}
      className="relative w-full h-32 rounded-lg overflow-hidden border"
    >
      <img
        src={URL.createObjectURL(file)}
        alt={`preview-${file.name}`}
        className="w-full h-full object-cover"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={onRemove}
        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
