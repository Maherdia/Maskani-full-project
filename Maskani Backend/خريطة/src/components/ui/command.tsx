// command.tsx - Replace your entire command.tsx file with this
import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Context for command state management
interface CommandContextType {
  search: string
  setSearch: (search: string) => void
  value: string
  setValue: (value: string) => void
}

const CommandContext = React.createContext<CommandContextType | null>(null)

// Main Command component
export const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [search, setSearch] = React.useState("")
  const [value, setValue] = React.useState("")

  const contextValue = React.useMemo(
    () => ({ search, setSearch, value, setValue }),
    [search, value]
  )

  return (
    <CommandContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  )
})
Command.displayName = "Command"

// Command Input
export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, onChange, ...props }, ref) => {
  const context = React.useContext(CommandContext)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    context?.setSearch(e.target.value)
    onChange?.(e)
  }

  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={context?.search || ""}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = "CommandInput"

// Command List
export const CommandList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = "CommandList"

// Command Empty
export const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children = "No results found.", ...props }, ref) => {
  const context = React.useContext(CommandContext)
  
  // Only show empty state when there's a search and no visible items
  if (!context?.search) return null

  return (
    <div
      ref={ref}
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
})
CommandEmpty.displayName = "CommandEmpty"

// Command Group
export const CommandGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    heading?: string
  }
>(({ className, heading, children, ...props }, ref) => {
  const context = React.useContext(CommandContext)
  
  // Filter children based on search
  const filteredChildren = React.useMemo(() => {
    if (!context?.search) return children

    return React.Children.toArray(children).filter((child) => {
      if (React.isValidElement(child) && child.props.value) {
        const searchTerm = context.search.toLowerCase()
        const itemValue = child.props.value.toLowerCase()
        const itemLabel = (child.props.children || "").toString().toLowerCase()
        return itemValue.includes(searchTerm) || itemLabel.includes(searchTerm)
      }
      return true
    })
  }, [children, context?.search])

  // Don't render group if no children match search
  if (context?.search && React.Children.count(filteredChildren) === 0) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground",
        className
      )}
      {...props}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {filteredChildren}
    </div>
  )
})
CommandGroup.displayName = "CommandGroup"

// Command Separator
export const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = "CommandSeparator"

// Command Item
export const CommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onSelect?: (value: string) => void
    disabled?: boolean
  }
>(({ className, value, onSelect, disabled, children, ...props }, ref) => {
  const context = React.useContext(CommandContext)
  
  const handleClick = () => {
    if (!disabled && value && onSelect) {
      onSelect(value)
      context?.setValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="option"
      aria-selected={context?.value === value}
      data-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  )
})
CommandItem.displayName = "CommandItem"

// Command Shortcut
export const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
})
CommandShortcut.displayName = "CommandShortcut"

// Command Dialog (if you need it)
export const CommandDialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(({ className, open, onOpenChange, children, ...props }, ref) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange?.(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        ref={ref}
        className={cn(
          "w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => onOpenChange?.(false)}
      />
    </div>
  )
})
CommandDialog.displayName = "CommandDialog"