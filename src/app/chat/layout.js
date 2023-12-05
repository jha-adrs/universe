import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { getAuthSession } from '@/lib/auth'
import React from 'react'

const Layout =async ({children, params}) => {
    const loginToast = useCustomToasts();
    // Fetch the current user
    const session = await getAuthSession();
    if(!session || !session.user) {
       return loginToast();
    }
    params.user = session.user;

  return (
    <>
      {children}
    </>
  )
}

export default Layout
