"use client"

import type { ReactElement, ReactNode } from "react"
import { Input } from "@/components/form/input"
import { FormField, formSchema } from "@/components/form/schema"
import { FormStatus } from "@/components/form/types"
import { Button } from "@/components/ui/button"
import { IconGlow } from "@/components/gradients/icon-glow"
import { Imdb } from "@/components/svg/imdb"
import {
  RiMailCheckLine,
  RiMailCloseLine,
  RiInstagramFill,
  RiTelegram2Fill
} from "@remixicon/react"
import { useForm } from "@/components/form/useForm"
import profile from "@/data/profile"
import { FilmGrain } from "@/components/film-grain"
import { cn } from "@/lib/utils"

const socialLinks = [
  {
    name: "Instagram",
    icon: RiInstagramFill,
    url: profile.instagram,
    glow: "bg-orange-500",
  },
  {
    name: "Imdb",
    icon: Imdb,
    url: profile.imdb,
    glow: "bg-yellow-400",
  },
  {
    name: "Telegram",
    icon: RiTelegram2Fill,
    url: profile.telegram,
    glow: "bg-sky-500",
  },
]

export default function ContactPage() {
  const { formData, status, errors, handleSubmit, setStatus, updateField, validateField } = useForm()

  const formFields = Object.keys(formSchema) as FormField[]

  const formViews: Record<FormStatus, ReactElement> = {
    idle: (
      <FormBaseView handleSubmit={handleSubmit}>
        <h3 className="h4">Send Message</h3>
        <fieldset className="space-y-8">
          {formFields.map((field) => (
            <Input
              key={field}
              id={field}
              name={field}
              placeholder={formSchema[field].placeholder}
              label={formSchema[field].label}
              value={formData[field]}
              error={errors[field]}
              onChange={(e) => updateField(field, e.target.value)}
              onBlur={(e) => validateField(field, e.target.value)}
              required
            />
          ))}
        </fieldset>
        <input
          type="hidden"
          name="website" // honeypot
          value={formData.website}
          onChange={(e) => updateField("website", e.target.value)}
        />
        <Button
          type="submit"
          className="mt-10 w-full button rounded hover:bg-foreground/80 transition-colors duration-300">
          Send Message
        </Button>
      </FormBaseView>
    ),
    submitting: (
      <FormBaseView>
        <h3 className="h4">Sending a message</h3>
        <div className="space-y-10 animate-pulse">
          <div className="space-y-4">
            <div className="h-5 w-24 bg-foreground/60 dark:bg-foreground/10" />
            <div className="h-6 rounded w-full bg-foreground/60 dark:bg-foreground/10 " />
          </div>
          <div className="space-y-4">
            <div className="h-5 w-24 rounded bg-foreground/60 dark:bg-foreground/10" />
            <div className="h-6 rounded w-full bg-foreground/60 dark:bg-foreground/10 " />
          </div>
          <div className="space-y-4">
            <div className="h-5 w-24 rounded bg-foreground/60 dark:bg-foreground/10" />
            <div className="h-6 rounded w-full bg-foreground/60 dark:bg-foreground/10 " />
          </div>
        </div>

        <Button
          type="button"
          disabled
          className="mt-10 w-full button rounded animate-pulse dark:disabled:bg-foreground/20 dark:disabled:text-foreground">
          Processing...
        </Button>
      </FormBaseView>
    ),
    error: (
      <FormBaseView>
        <div className="flex flex-col gap-10 py-2">
          <div>
            <RiMailCloseLine size={64} className="mb-4" />
            <h3 className="h4 text mb-2">Something went wrong</h3>
            <p className="body-m text-foreground/70">I wasnt able to receive your inquiry just yet. Please try sending it again—I’d love to hear from you.</p>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-40 button rounded"
            onClick={() => setStatus("idle")}>
              Try Again
          </Button>
        </div>
      </FormBaseView>
    ),
    success: (
      <FormBaseView>
        <div className="flex flex-col gap-10 py-2">
          <div>
            <RiMailCheckLine size={64} className="mb-4"/>
            <h3 className="h4 text mb-2">Successfully sent!</h3>
            <p className="body-m text-foreground/70">Thank you for your interest. I’ve received your inquiry and will get back to you soon.</p>
          </div>
          <Button
            type="submit"
            className="w-full sm:w-40 button rounded"
            onClick={() => setStatus("idle")}>
            Ok
          </Button>
        </div>
      </FormBaseView>
    )
  }

  return (
    <section className="py-8 md:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-16 lg:px-24">{formViews[status]}</div>
    </section>
  )
}

const FormBaseView = ({
  children,
  handleSubmit
}: {
  children: ReactNode
  handleSubmit?: (e: React.SubmitEvent) => Promise<void>
}) => {
  return (
    <div className="flex flex-col gap-8 md:flex-row lg:gap-20 xl:gap-32">
      <FilmGrain />
      <aside className="md:w-1/2 lg:w-1/3 flex flex-col justify-between gap-6 lg:gap-10">
        <div>
          <h2 className="h2 pb-4 lg:pb-10">Get in touch</h2>
          <p className="body-m text-foreground/70">
            Have a project in mind or just want to chat? Feel free to reach out through the form or connect
            with me on social media.
          </p>
        </div>
        <footer className="space-y-2 lg:space-y-4">
          <p className="label-s">Connect</p>
          <ul className="inline-flex w-full gap-4">
            {socialLinks.map((link) => (
              <li key={link.name}>
                <figure className="relative group cursor-pointer">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <link.icon />
                  </a>
                  <IconGlow glowColor={link.glow} className={cn("blur-xs size-4 left-1 top-1", link.name === "Telegram" && "size-2 blur-[2px] left-2 top-2")} />
                </figure>
              </li>
            ))}
          </ul>
        </footer>
      </aside>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-foreground/1 space-y-10 border p-8 md:w-2/3 lg:px-16 lg:py-10 hover:border-foreground/20 hover:bg-foreground/5 transition-all duration-200 dark:backdrop-blur-lg">
        {children}
      </form>
    </div>
  )
}
