import { createSuperhero } from '@/app/store/slices/superheroes/superheroes-thunk'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { type SuperheroFormValues, superheroFormSchema } from '../schema'

export const useCreateSuperhero = () => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.superheroes)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<SuperheroFormValues>({
    resolver: zodResolver(superheroFormSchema),
    defaultValues: {
      nickname: '',
      real_name: '',
      origin_description: '',
      superpowers: [{ value: '' }],
      catch_phrase: '',
      images: new DataTransfer().files,
    },
  })

  const files = form.watch('images')
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'superpowers',
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files
    if (newFiles) {
      const currentFiles = Array.from(files)
      const combinedFiles = currentFiles.concat(Array.from(newFiles))
      const dataTransfer = new DataTransfer()

      combinedFiles.slice(0, 5).forEach(file => dataTransfer.items.add(file))

      form.setValue('images', dataTransfer.files, { shouldValidate: true })
      form.trigger('images')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const dataTransfer = new DataTransfer()
    Array.from(files)
      .filter((_, i) => i !== index)
      .forEach(file => dataTransfer.items.add(file))

    form.setValue('images', dataTransfer.files, { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  async function onSubmit(values: SuperheroFormValues) {
    const formData = new FormData()
    const superpowersArray = values.superpowers.map(s => s.value)

    formData.append('nickname', values.nickname)
    formData.append('real_name', values.real_name)
    formData.append('origin_description', values.origin_description)
    formData.append('superpowers', JSON.stringify(superpowersArray))
    formData.append('catch_phrase', values.catch_phrase)

    for (let i = 0; i < values.images.length; i++) {
      formData.append('images', values.images[i])
    }

    const resultAction = await dispatch(createSuperhero(formData))
    if (createSuperhero.fulfilled.match(resultAction)) {
      console.log('Superhero created successfully!')
      form.reset()
    } else {
      console.error('Failed to create superhero.')
    }
  }

  return {
    form,
    loading,
    fields,
    append,
    remove,
    files,
    handleFileChange,
    handleRemoveImage,
    onSubmit,
    fileInputRef,
  }
}
