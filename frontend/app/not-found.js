import Link from 'next/link'
import PrimaryLayout from "@/components/Layout/PrimaryLayout";

export default function NotFound() {
  return (
    <PrimaryLayout>
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Not Found</h2>
        <p className="text-lg text-gray-600 mb-8">Could not find the requested resource</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">Return Home</Link>
      </div>
    </PrimaryLayout>
  )
}
