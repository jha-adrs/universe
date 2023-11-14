import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/settings/ProfileForm"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"

export default async function SettingsProfilePage() {
    
    const session = await getAuthSession()
    const userInfo = await db.user.findFirst({
        where: {
            id: session?.user?.id
        }
    })
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm user={session?.user} userInfo={userInfo}/>
    </div>
  )
}