"use client"

import { useState, type ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PasswordField({
  id,
  label = "Password",
  autoComplete,
  value,
  onChange,
  labelAction,
}: {
  id: string
  label?: string
  autoComplete: "current-password" | "new-password"
  value: string
  onChange: (value: string) => void
  labelAction?: ReactNode
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {labelAction}
      </div>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={6}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pr-9"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-0.5 -translate-y-1/2"
          aria-label={
            visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`
          }
          aria-pressed={visible}
          aria-controls={id}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </div>
  )
}
