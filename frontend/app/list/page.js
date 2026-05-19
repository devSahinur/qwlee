import PrimaryLayout from '@/components/Layout/PrimaryLayout'
import MyList from '@/components/MyList/MyList'
import React from 'react'

export const metadata = {
    title: "My List | Qwlee",
    description:
        "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const page = () => {
    return (
        <PrimaryLayout>
            <MyList />
        </PrimaryLayout>
    )
}

export default page
