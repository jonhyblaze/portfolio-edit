import z from "zod"

/**
 * The visible fields. `maxLength` is read twice — by the input, so nobody can
 * type past it, and by the schema below, so nobody can post past it either.
 */
export const formSchema = {
  name: {
    label: "Name",
    placeholder: "Mr. Anderson",
    maxLength: 100
  },
  email: {
    label: "E-mail",
    placeholder: "your.email@example.com",
    // The longest address the email standard allows.
    maxLength: 254
  },
  message: {
    label: "Message",
    placeholder: "Your message...",
    maxLength: 5000
  }
} as const

export type FormField = keyof typeof formSchema

export const zodFormShema = z.object({
  name: z
    .string().trim()
    .min(1, "Please fill in this field")
    .min(2, "Name is too short")
    .max(formSchema.name.maxLength, "Name is too long"),
  email: z
    .string().trim()
    .min(1, "Please fill in this field")
    .email("Invalid email")
    .max(formSchema.email.maxLength, "Email is too long"),
  message: z
    .string().trim()
    .min(1, "Please fill in this field")
    .min(6, "Message is too short")
    .max(formSchema.message.maxLength, `Message is too long (${formSchema.message.maxLength} characters max)`),
  // Honeypot. Accepted whatever it holds: rejecting it here would answer a bot
  // with a 400 naming the field. The route checks it and fakes a success instead.
  website: z.string().optional()
})

export type FormData = z.infer<typeof zodFormShema>
