import CloseModal from '@/components/CloseModal'
import Signup from '@/components/Signup'
import ExpandModal from '@/components/ExpandModal';

const page = () => {
  return (
    <div className='fixed inset-0 bg-zinc-900/20 z-10 border-2 border-white  '>
      <div className='container flex items-center h-full max-w-lg mx-auto'>
        <div className='relative bg-white w-full h-fit py-20 px-2 rounded-lg '>
          <ExpandModal className='absolute top-4 left-4' />
          <CloseModal className='absolute top-4 right-4' />
          <Signup />
        </div>
      </div>
    </div>
  )
}

export default page