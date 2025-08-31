import * as z from 'zod'
const MAX_IMAGES = 5
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const superheroFormSchema = z.object({
  nickname: z.string().min(2, 'Nickname must be at least 2 characters.'),
  real_name: z.string().min(2, 'Real name must be at least 2 characters.'),
  origin_description: z
    .string()
    .min(10, 'Origin must be at least 10 characters.'),
  superpowers: z
    .array(
      z.object({
        value: z.string().min(1, 'Superpower cannot be empty.'),
      }),
    )
    .min(1, 'At least one superpower is required.'),
  catch_phrase: z
    .string()
    .min(5, 'Catch phrase must be at least 5 characters.'),
  images: z
    .custom<FileList>()
    .refine(files => files.length > 0, 'At least one image is required.')
    .refine(
      files => files.length <= MAX_IMAGES,
      `Maximum of ${MAX_IMAGES} images are allowed.`,
    )
    .refine(
      files =>
        Array.from(files).every(file =>
          ACCEPTED_IMAGE_TYPES.includes(file.type),
        ),
      'Only .jpg, .jpeg, .png and .webp formats are supported.',
    ),
})

export type SuperheroFormValues = z.infer<typeof superheroFormSchema>
