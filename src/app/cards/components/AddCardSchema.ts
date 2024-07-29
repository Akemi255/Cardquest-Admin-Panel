import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const AddCardSchema = z.object({
  name: z.string().min(1, { message: "First name required" }),
  namekanji: z.string().min(1, { message: "First name required" }),
  about: z.string(),
  rareza: z.enum(["mythic", "common"]),
  image: z.object({
    image: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  }),
  coin: z.number(),
});

export type AddCard = z.infer<typeof AddCardSchema>;
