import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from '@/shared/components/ui'
import { ImagePreview } from './components/image-preview'
import { Trash2Icon, PlusIcon } from 'lucide-react'
import { useCreateSuperhero } from './hooks/use-create-superhero'

export const CreateSuperheroForm = () => {
  const {
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
  } = useCreateSuperhero()

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
                  ref={fileInputRef}
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
