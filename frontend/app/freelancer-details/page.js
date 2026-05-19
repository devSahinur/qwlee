import FreelancerDetails from '@/components/FreelancerDetails/FreelancerDetails';
import PrimaryLayout from '@/components/Layout/PrimaryLayout';
import React from 'react';

export const metadata = {
    title: "Freelancer Details | Qwlee",
    description:
        "Company Number: (781) 316-0189, and Company Email: e-mail such as info@qwlee.com",
}
const Page = ({searchParams}) => {
    return (
        <div>
            <PrimaryLayout>
            <FreelancerDetails searchParams={searchParams}/>
            </PrimaryLayout>
        </div>
    );
}

export default Page;
