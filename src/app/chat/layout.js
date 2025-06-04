import { getAuthSession } from '@/lib/auth'


const Layout =async ({children, params}) => {
    // Fetch the current user
    const session = await getAuthSession()

  return (
    <>
      {children}
    </>
  )
}

export default Layout
