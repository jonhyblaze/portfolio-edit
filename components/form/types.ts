import { FormField } from "./schema"

export type FormStatus = "idle" | "submitting" | "error" | "success"

export type FormMap = {
  labels: Record<FormField, string>
  placeholders: Record<FormField, string>
}
