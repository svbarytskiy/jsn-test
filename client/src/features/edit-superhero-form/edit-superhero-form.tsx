import { type FC } from 'react'
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
import { Loader, Trash2Icon, PlusIcon } from 'lucide-react'
import { ImageList } from './components/image-list'
import { useEditSuperheroForm } from './hooks/use-edit-superhero'

export const EditSuperheroForm: FC = () => {
  const {
    form,
    loading,
    error,
    selectedSuperhero,
    fields,
    append,
    remove,
    handleFileChange,
    handleRemoveImage,
    onSubmit,
    fileInputRef,
    allImagesForPreview,
  } = useEditSuperheroForm()

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
