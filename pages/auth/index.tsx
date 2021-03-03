import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Auth = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/api/auth/login')
  }, [])

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <p className="text-gray-500">Redirecting...</p>
    </div>
  )
}

export default Auth
