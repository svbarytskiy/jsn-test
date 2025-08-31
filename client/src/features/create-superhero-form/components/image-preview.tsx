import { ImageItem } from './image-item'

interface ImagePreviewProps {
  files: FileList
  onRemove: (index: number) => void
}

export const ImagePreview = ({ files, onRemove }: ImagePreviewProps) => {
  if (!files || files.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from(files).map((file, index) => (
        <ImageItem key={index} file={file} onRemove={() => onRemove(index)} />
      ))}
    </div>
  )
}
