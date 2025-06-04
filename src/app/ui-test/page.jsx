"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowBigDown, 
  ArrowBigUp, 
  Bell, 
  Check, 
  ChevronDown, 
  Cross1Icon,
  Moon,
  Plus,
  Search, 
  Settings, 
  Sun, 
  User 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/Icons"

export default function UITestPage() {
  const { toast } = useToast()
  const [commandOpen, setCommandOpen] = useState(false)
  const [dropdownRadioValue, setDropdownRadioValue] = useState("option-1")
  
  return (
    <div className="container py-10 space-y-16">
      <div>
        <h1 className="text-3xl font-bold mb-6">UI Components Showcase</h1>
        <p className="text-muted-foreground mb-2">
          This page displays all available UI components from the components/ui directory.
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="black">Black</Button>
          <Button variant="blackwithred">Black with Red</Button>
          <Button variant="destructive_outline">Destructive Outline</Button>
          <Button variant="secondary_outline">Secondary Outline</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="default">Size Default</Button>
          <Button size="sm">Size Small</Button>
          <Button size="lg">Size Large</Button>
          <Button size="icon"><Settings className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
          <Button><Icons.spinner className="mr-2 h-4 w-4 animate-spin" />With Spinner</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="reddish">Reddish</Badge>
          <Badge variant="greenish">Greenish</Badge>
        </div>
      </section>

      {/* Checkbox */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Checkbox</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <label htmlFor="terms" className="text-sm">Accept terms and conditions</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="disabled" disabled />
          <label htmlFor="disabled" className="text-sm text-muted-foreground">Disabled</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="checked" defaultChecked />
          <label htmlFor="checked" className="text-sm">Checked</label>
        </div>
      </section>

      {/* Dialog */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description that explains what this dialog is for.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              Dialog content goes here. This is the main content of your dialog.
            </div>
            <DialogFooter>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Dropdown Menu */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Dropdown Menu</h2>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <User className="mr-2 h-4 w-4" />
                  <span>Submenu</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Submenu Item 1</DropdownMenuItem>
                  <DropdownMenuItem>Submenu Item 2</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={dropdownRadioValue} onValueChange={setDropdownRadioValue}>
                <DropdownMenuRadioItem value="option-1">Radio Option 1</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="option-2">Radio Option 2</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Input */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Input</h2>
        <div className="grid gap-4 max-w-sm">
          <Input placeholder="Standard input" />
          <Input placeholder="Disabled input" disabled />
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input placeholder="Email" type="email" />
            <Button type="submit">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Command */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Command</h2>
        <div className="grid gap-4 max-w-sm">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Search</span>
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="More">
                <CommandItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create new</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          <Button
            onClick={() => setCommandOpen(true)}
            className="w-full justify-start text-sm text-muted-foreground"
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Open command dialog (Ctrl+K)</span>
          </Button>
        </div>
        <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Search</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </section>

      {/* Popover */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Popover</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="width">Width</label>
                  <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="maxWidth">Max. width</label>
                  <Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      {/* Post Vote Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Post Vote UI</h2>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <div className="flex items-center gap-2 sm:flex-col">
            <Button variant="ghost" size="sm">
              <ArrowBigUp className="h-5 w-5 text-zinc-700 dark:text-white" />
            </Button>
            <p className="text-center py-2 font-bold text-sm">125</p>
            <Button variant="ghost" size="sm">
              <ArrowBigDown className="h-5 w-5 text-zinc-700 dark:text-white" />
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:flex-col">
            <Button variant="ghost" size="sm">
              <ArrowBigUp className="h-5 w-5 text-emerald-500 fill-emerald-500" />
            </Button>
            <p className="text-center py-2 font-bold text-sm">42</p>
            <Button variant="ghost" size="sm">
              <ArrowBigDown className="h-5 w-5 text-zinc-700 dark:text-white" />
            </Button>
          </div>
          <div className="flex items-center gap-2 sm:flex-col">
            <Button variant="ghost" size="sm">
              <ArrowBigUp className="h-5 w-5 text-zinc-700 dark:text-white" />
            </Button>
            <p className="text-center py-2 font-bold text-sm">18</p>
            <Button variant="ghost" size="sm">
              <ArrowBigDown className="h-5 w-5 text-red-500 fill-red-500" />
            </Button>
          </div>
        </div>
      </section>

      {/* Toast Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Toasts</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => {
              toast({
                title: "Default Toast",
                description: "This is a default toast notification",
              })
            }}
          >
            Show Default Toast
          </Button>
          
          <Button 
            variant="destructive"
            onClick={() => {
              toast({
                title: "Destructive Toast",
                description: "This is a destructive toast notification",
                variant: "destructive",
              })
            }}
          >
            Show Error Toast
          </Button>

          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: "With Action",
                description: "This toast has an action button",
                action: (
                  <Button size="sm" variant="outline">
                    Undo
                  </Button>
                ),
              })
            }}
          >
            Toast with Action
          </Button>
        </div>
      </section>

      {/* Theme Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Theme Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme Colors</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary"></div>
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-secondary"></div>
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-accent"></div>
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-muted"></div>
                <span className="text-sm">Muted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-destructive"></div>
                <span className="text-sm">Destructive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-popover"></div>
                <span className="text-sm">Popover</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme Switcher Preview</h3>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="outline">
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button size="sm" variant="outline">
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button size="sm" variant="outline">
                <span className="mr-2">🖥️</span>
                System
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}