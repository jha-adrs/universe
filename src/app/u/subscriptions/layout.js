import { Separator } from '@/components/ui/separator';
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db';
// Server component

const Layout = async ({ children }) => {
    const session = await getAuthSession();

    let subscriptions = [];
    if (session?.user) {
        subscriptions = await db.subscription.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                community: true,
                user: true
            },
            orderBy: {
                dateJoined: "desc"
            }
        })
    }
    return (
        <div className='overflow-hidden rounded-md bg-white shadow list-none'>
            <p className='font-bold text-2xl md:text-4xl p-4'>Your communities</p>
            <Separator />
            <div className='w-full h-full  cursor-pointer'>
                {subscriptions.map((subscription) => {
                    return (
                        <div className='ml-5 flex flex-col rounded-md bg-white m-3 hover:bg-gray-100  h-full px-6 py-4  justify-between gap-6 ' key={`${subscription.userId}_${subscription.communityId}`}>
                            <a href={`/r/${subscription.community.name}`} >
                            <div className="flex flex-row">
                            
                                <p className=' font-semibold'>r/{subscription.community.name}</p>
                            
                            </div>
                            <div className="flex flex-row">
                                <p className="text-blue-900 ">Created By: u/{subscription.user.username} </p>
                            </div>
                            </a>
                        </div>

                    )
                })}
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
