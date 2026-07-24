import { cn } from "@/lib/utils"
import type { ChangeEvent, InputHTMLAttributes } from "react"
type InputProps = {
  name: string
  label: string
  placeholder: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  value: string | number | undefined
  error?: string | null
} & InputHTMLAttributes<HTMLInputElement>

export const Input = ({ name, label, placeholder, onChange, value, error, ...props }: InputProps) => {
  return (
    <div className="relative w-full">
      <p className="label-s capitalize">{name}</p>
      <input
        placeholder={placeholder}
        className={cn(
          "h-12 no-zoom peer w-full border-b border-foreground/20 bg-transparent pt-4 pb-1.5 text-base text-foreground outline outline-0 transition-all placeholder:text-foreground/70 placeholder:text-base focus:border-foreground focus-visible:border-foreground focus:outline-0 disabled:border-0 disabled:bg-transparent [-webkit-autofill:focus]:bg-transparent [-webkit-autofill:active]:bg-transparent [-webkit-autofill:hover]:bg-transparent [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:bg-clip-text [&:-webkit-autofill]:text-fill-color-transparent [&:-webkit-autofill]:shadow-[0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:focus]:shadow-[0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:active]:shadow-[0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:hover]:shadow-[0_0_0px_1000px_transparent_inset]",
          error && "border-yellow-600 dark:border-yellow-500 focus:border-yellow-500 active:border-yellow-500"
        )}
        name={name}
        onChange={onChange}
        value={value}
        {...props}
      />
      <label
        htmlFor={name}
        className={cn(
          "after:content[''] pointer-events-none absolute inset-0 -top-1.5 h-full w-full select-none transition-all after:absolute after:-bottom-1.5 after:w-full after:scale-x-0 after:border-b-2 after:border-foreground after:transition-all after:duration-300 peer-focus:after:scale-x-100 ",
          error && " after:border-yellow-600 dark:after:border-yellow-500"
        )} />
      {error && <p className="absolute text-yellow-600 dark:text-yellow-500 text-[10px] mt-[2px]">{error}</p>}
    </div>
  )
}
