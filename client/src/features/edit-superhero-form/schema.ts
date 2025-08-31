import * as z from 'zod'

const MAX_IMAGES = 5
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const superheroEditFormSchema = z
  .object({
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
    existingImages: z.array(z.string()),
    newImages: z.custom<FileList>(),
  })
  .refine(
    data => {
      const totalImages = data.existingImages.length + data.newImages.length
      return totalImages > 0 && totalImages <= MAX_IMAGES
    },
    {
      message: `You must have between 1 and ${MAX_IMAGES} images in total.`,
      path: ['newImages'],
    },
  )
  .refine(
    data => {
      return Array.from(data.newImages).every(file =>
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      )
    },
    {
      message: 'Only .jpg, .jpeg, .png and .webp formats are supported.',
      path: ['newImages'],
    },
  )

export type SuperheroEditFormValues = z.infer<typeof superheroEditFormSchema>
