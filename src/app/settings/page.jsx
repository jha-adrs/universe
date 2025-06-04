import { Separator } from "@/components/ui/separator"
import { AccountForm } from "@/components/settings/AccountForm"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"

export default async function SettingsProfilePage() {
  const session = await getAuthSession()
  
  const userInfo = await db.user.findFirst({
    where: {
      id: session?.user?.id
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      bio: true,
      image: true,
      joinedDate: true,
      karma: true
    }
  })
  
  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your profile information and how others see you on Universe
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Email</div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="truncate text-sm">{userInfo?.email}</div>
            <span className="text-xs text-muted-foreground">Verified</span>
          </div>
        </div>
        
        <div className="grid gap-2">
          <div className="text-sm font-medium">Account Details</div>
          <div className="grid gap-1 rounded-md border p-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Member since</span>
              <span className="text-sm">
                {format(new Date(userInfo?.joinedDate), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Karma</span>
              <span className="text-sm">{userInfo?.karma || 0} points</span>
            </div>
          </div>
        </div>
        
        <AccountForm user={session?.user} userInfo={userInfo} />
      </div>
    </>
  )
}