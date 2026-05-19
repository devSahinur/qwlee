'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import useUser from "@/hooks/useUser"

// Dynamically import the components
const FreelancerEditProfile = dynamic(() => import('./FreelancerEditProfile/FreelancerEditProfile'))
const BuyerEditProfile = dynamic(() => import('./BuyerEditProfile/BuyerEditProfile'))

const EditProfile = () => {
  const user = useUser()
  const [isClient, setIsClient] = useState(false)

  // Ensure this component is only rendered on the client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // Avoid rendering until client-side
  }

  return (
    <div>
      {
        user?.role === 'freelancer' ? <FreelancerEditProfile /> : <BuyerEditProfile />
      }
    </div>
  )
}

export default EditProfile
