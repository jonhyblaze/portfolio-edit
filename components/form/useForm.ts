"use client"

import { useState } from "react"
import { FormStatus } from "./types"
import { FormData, zodFormShema } from "./schema"

export function useForm() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    website: ""
  })

  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    email: false,
    message: false,
    website: false
  })

  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    name: "",
    email: "",
    message: "",
    website: ""
  })

  const validateField = (field: keyof FormData, value: string) => {
    if (!touched[field]) return

    const singleSchema = zodFormShema.pick({ [field]: true } as Record<keyof FormData, true>)
    const result = singleSchema.safeParse({ [field]: value })

    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? "" : result.error.issues[0].message
    }))
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))

    setTouched((prev) => ({
      ...prev,
      [field]: true
    }))
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    setTouched({
      name: true,
      email: true,
      message: true,
      website: true
    })

    const validation = zodFormShema.safeParse(formData)

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors

      setErrors({
        name: fieldErrors.name?.[0] ?? "",
        email: fieldErrors.email?.[0] ?? "",
        message: fieldErrors.message?.[0] ?? "",
        website: fieldErrors.website?.[0] ?? ""
      })

      return
    }

    setStatus("submitting")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        console.log("Status: ", res.status, "Resonse object: ", res)
        throw new Error()
      }

      setStatus("success")
      setFormData({
        name: "",
        email: "",
        message: "",
        website: ""
      })
    } catch (err) {
      console.error(err)
      setStatus("error")
    }
  }

  return {
    status,
    formData,
    errors,
    handleSubmit,
    updateField,
    validateField,
    setStatus
  }
}
