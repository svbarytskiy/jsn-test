import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
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
import { type SuperheroFormValues, superheroFormSchema } from './schema'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { ImagePreview } from './components/image-preview'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { createSuperhero } from '@/app/store/slices/superheroes/superheroes-thunk'
import { Trash2Icon, PlusIcon } from 'lucide-react'

export const CreateSuperheroForm = () => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.superheroes)

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
    }
  }

  useEffect(() => {
    const inputElement = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    if (inputElement && inputElement.files !== files) {
      inputElement.files = files
    }
  }, [files])

  const handleRemoveImage = (index: number) => {
    const dataTransfer = new DataTransfer()
    Array.from(files)
      .filter((_, i) => i !== index)
      .forEach(file => dataTransfer.items.add(file))

    form.setValue('images', dataTransfer.files, { shouldValidate: true })
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

  return (
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
                <Input placeholder="It's a bird, it's a plane..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field: { value: _, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImagePreview files={files} onRemove={handleRemoveImage} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Superhero'}
        </Button>{' '}
      </form>
    </Form>
  )
}
