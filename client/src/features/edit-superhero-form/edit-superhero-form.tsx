import { type FC, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import {
  fetchSuperheroByNickname,
  updateSuperhero,
} from '@/app/store/slices/superheroes/superheroes-thunk'
import { Loader, Trash2Icon, PlusIcon } from 'lucide-react'
import { clearSelectedSuperhero } from '@/app/store/slices/superheroes/superheroes-slice'
import { ImageList } from './components/image-list'
import { superheroEditFormSchema, type SuperheroEditFormValues } from './schema'

export const EditSuperheroForm: FC = () => {
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
    console.log('Existing Images:', values.existingImages)
    console.log('New Images:', values.newImages)
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
      console.log('Superhero updated successfully!')
      navigate(`/`)
    } else {
      console.error('Failed to update superhero.')
    }
  }

  if (loading || !selectedSuperhero) {
    return (
      <div className="flex h-80 w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-80 w-full items-center justify-center text-red-500">
        Error: {error}
      </div>
    )
  }

  const allImagesForPreview = [...existingImages, ...Array.from(newFiles)]

  return (
    <div className="p-3 container mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-5">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input placeholder="Superman" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="real_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Real Name</FormLabel>
                <FormControl>
                  <Input placeholder="Clark Kent" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="origin_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Born on Krypton..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <FormLabel>Superpowers</FormLabel>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`superpowers.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Flight" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2Icon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: '' })}
            >
              <PlusIcon className="h-4 w-4 mr-2" /> Add superpower
            </Button>
          </div>
          <FormField
            control={form.control}
            name="catch_phrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catch Phrase</FormLabel>
                <FormControl>
                  <Input
                    placeholder="It's a bird, it's a plane..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newImages"
            render={({ field: { value: _, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Add new images</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ImageList
            images={allImagesForPreview}
            onRemove={handleRemoveImage}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Superhero'}
          </Button>{' '}
        </form>
      </Form>
    </div>
  )
}
