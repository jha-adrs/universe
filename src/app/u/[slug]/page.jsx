import React from 'react'

const page = ({params}) => {
  console.log(params)
  return (
    <div>
      Hello User{params?.slug}
    </div>
  )
}

export default page
