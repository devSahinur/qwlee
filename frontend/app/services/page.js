import PrimaryLayout from '@/components/Layout/PrimaryLayout'
import Services from '@/components/Services/Services'
import React from 'react'

export const metadata = {
  title: "Services | Qwlee",
  description:
    "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
  return (
    <PrimaryLayout>
      <Services />
    </PrimaryLayout>
  )
}

export default page