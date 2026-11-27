"use client"

import { useMemo } from "react"
import { Lock } from "lucide-react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

export type RoleOption = { id: string; name: string; systemRole?: boolean }

type Item = { value: string; label: string; locked: boolean }

interface RoleMultiSelectProps {
  id?: string
  roles: RoleOption[]
  /** Selected role ids */
  value: string[]
  onChange: (roleIds: string[]) => void
  disabled?: boolean
  invalid?: boolean
}

/**
 * Multi-select of roles, shown as removable chips. Works with role ids.
 *
 * System roles (e.g. OWNER) are special: they are never offered for
 * assignment, and one a member already holds is shown locked (no remove
 * button) and always kept in the value.
 */
const RoleMultiSelect = ({
  id,
  roles,
  value,
  onChange,
  disabled,
  invalid,
}: RoleMultiSelectProps) => {
  const anchor = useComboboxAnchor()

  const systemIds = useMemo(
    () => new Set(roles.filter((r) => r.systemRole).map((r) => String(r.id))),
    [roles]
  )

  // Hide system roles unless the member already has one
  const items = useMemo<Item[]>(
    () =>
      roles
        .filter((r) => !r.systemRole || value.includes(String(r.id)))
        .map((r) => ({
          value: String(r.id),
          label: r.name,
          locked: !!r.systemRole,
        })),
    [roles, value]
  )
  const selected = useMemo(
    () => items.filter((item) => value.includes(item.value)),
    [items, value]
  )

  const handleChange = (next: Item[]) => {
    const kept = value.filter((v) => systemIds.has(v))
    const regular = next.map((i) => i.value).filter((v) => !systemIds.has(v))
    onChange([...kept, ...regular])
  }

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
      value={selected}
      onValueChange={handleChange}
      isItemEqualToValue={(a: Item, b: Item) => a.value === b.value}
      itemToStringLabel={(item: Item) => item.label}
      disabled={disabled}
    >
      <ComboboxChips ref={anchor} className="w-full" aria-invalid={invalid}>
        <ComboboxValue>
          {(values: Item[]) => (
            <>
              {values.map((v) => (
                <ComboboxChip key={v.value} showRemove={!v.locked}>
                  {v.locked && <Lock className="size-3" />}
                  {v.label}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                id={id}
                placeholder={values.length === 0 ? "Select roles" : undefined}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No roles found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default RoleMultiSelect
