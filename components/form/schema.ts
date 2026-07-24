import z from "zod"

export const formSchema = {
  name: {
    label: "Name",
    placeholder: "Mr. Anderson"
  },
  email: {
    label: "E-mail",
    placeholder: "your.email@example.com"
  },
  message: {
    label: "Message",
    placeholder: "Your message..."
  }
} as const

export type FormField = keyof typeof formSchema

export const zodFormShema = z.object({
  name: z
    .string().trim()
    .min(1, "Please fill in this field")
    .min(2, "Name is too short"),
  email: z
    .string().trim()
    .min(1, "Please fill in this field")
    .email("Invalid email"),
  message: z
    .string().trim()
    .min(1, "Please fill in this field")
    .min(6, "Message is too short"),
  website: z.string().max(0).optional() // honeypot
})

export type FormData = z.infer<typeof zodFormShema>
