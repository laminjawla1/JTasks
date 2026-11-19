import React from "react"

import {
  Field as ShadcnField,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FieldProps = {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  autoComplete?: string
  minLength?: number
}

export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  minLength,
}: FieldProps) {
  return (
    <ShadcnField data-invalid={!!error}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={!!error}
      />
      {error && <FieldError>{error}</FieldError>}
    </ShadcnField>
  )
}
