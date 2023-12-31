import CloseModal from '@/components/CloseModal'
import ExpandModal from '@/components/ExpandModal'
import Signin from '@/components/Signin'
import { Button } from '@/components/ui/button'
const page= () => {
  return (
    <div className='fixed inset-0 bg-zinc-900/20 z-10 border-2 border-white dark:bg-zinc-700/20 dark:text-white '>
      <div className='container flex items-center h-full  max-w-lg mx-auto'>
        <div className='relative bg-white w-full h-fit max-h-[80%] sm:h-fit py-20 px-2 rounded-lg dark:bg-black dark:text-white '>
        <ExpandModal className='absolute top-4 left-4'/>
          
          <CloseModal className='absolute top-4 right-4'/>

          <Signin />
        </div>
      </div>
    </div>
  )
}

export default page