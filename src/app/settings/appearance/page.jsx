import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";

export default function AppearanceSettingsPage() {
  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how Universe looks on your device
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Theme</h4>
          <RadioGroup defaultValue="system" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-2 h-5 w-5" />
                <span>Light</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-2 h-5 w-5" />
                <span>Dark</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Monitor className="mb-2 h-5 w-5" />
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground mt-3">
            System preference will automatically switch between light and dark themes based on your device settings.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button>Save preferences</Button>
        </div>
      </div>
    </>
  );
}
