import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import {
  fetchSuperheroByNickname,
  updateSuperhero,
} from '@/app/store/slices/superheroes/superheroes-thunk'
import { clearSelectedSuperhero } from '@/app/store/slices/superheroes/superheroes-slice'
import {
  superheroEditFormSchema,
  type SuperheroEditFormValues,
} from '../schema'

export const useEditSuperheroForm = () => {
  const { nickname } = useParams<{ nickname: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { selectedSuperhero, loading, error } = useAppSelector(
    state => state.superheroes,
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<SuperheroEditFormValues>({
    resolver: zodResolver(superheroEditFormSchema),
    defaultValues: {
      nickname: '',
      real_name: '',
      origin_description: '',
      superpowers: [{ value: '' }],
      catch_phrase: '',
      newImages: new DataTransfer().files,
      existingImages: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'superpowers',
  })

  const newFiles = form.watch('newImages')
  const existingImages = form.watch('existingImages', [])

  useEffect(() => {
    if (nickname) {
      dispatch(fetchSuperheroByNickname(nickname))
    }
    return () => {
      dispatch(clearSelectedSuperhero())
    }
  }, [dispatch, nickname])

  useEffect(() => {
    if (selectedSuperhero) {
      form.reset({
        ...selectedSuperhero,
        superpowers: selectedSuperhero.superpowers.map(power => ({
          value: power,
        })),
        newImages: new DataTransfer().files,
        existingImages: selectedSuperhero.images,
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [selectedSuperhero, form])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newlySelectedFiles = event.target.files
    if (newlySelectedFiles) {
      const currentFiles = Array.from(newFiles)
      const combinedFiles = currentFiles.concat(Array.from(newlySelectedFiles))
      const dataTransfer = new DataTransfer()
      combinedFiles.forEach(file => dataTransfer.items.add(file))
      form.setValue('newImages', dataTransfer.files, { shouldValidate: true })
      form.trigger('newImages')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (imageToRemove: string | File) => {
    if (typeof imageToRemove === 'string') {
      const updatedExistingImages = existingImages.filter(
        image => image !== imageToRemove,
      )
      form.setValue('existingImages', updatedExistingImages, {
        shouldValidate: true,
      })
    } else {
      const dataTransfer = new DataTransfer()
      Array.from(newFiles)
        .filter(file => file !== imageToRemove)
        .forEach(file => dataTransfer.items.add(file))
      form.setValue('newImages', dataTransfer.files, { shouldValidate: true })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function onSubmit(values: SuperheroEditFormValues) {
    if (!selectedSuperhero) return
    const formData = new FormData()
    const superpowersArray = values.superpowers.map(s => s.value)

    formData.append('nickname', values.nickname)
    formData.append('real_name', values.real_name)
    formData.append('origin_description', values.origin_description)
    formData.append('superpowers', JSON.stringify(superpowersArray))
    formData.append('catch_phrase', values.catch_phrase)
    formData.append('existing_images', JSON.stringify(values.existingImages))

    for (let i = 0; i < values.newImages.length; i++) {
      formData.append('new_images', values.newImages[i])
    }

    const resultAction = await dispatch(
      updateSuperhero({
        id: selectedSuperhero._id,
        superheroData: formData,
      }),
    )
    if (updateSuperhero.fulfilled.match(resultAction)) {
      navigate(`/`)
    } else {
      console.error('Failed to update superhero.')
    }
  }

  const allImagesForPreview = [...existingImages, ...Array.from(newFiles)]

  return {
    form,
    loading,
    error,
    selectedSuperhero,
    fields,
    append,
    remove,
    newFiles,
    existingImages,
    handleFileChange,
    handleRemoveImage,
    onSubmit,
    fileInputRef,
    allImagesForPreview,
  }
}
