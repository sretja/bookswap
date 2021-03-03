import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'

import { useUser } from '@auth0/nextjs-auth0'
import useSWR from 'swr'

import { Logo, NewUser } from '../components'
import { fetcher } from '../utils'

import { MenuOutline, XOutline } from '@graywolfai/react-heroicons'

const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const { register, handleSubmit } = useForm<{
    query: string
  }>()

  const [isNewUserPopupOpen, setIsNewUserPopupOpen] = useState<boolean>(false)

  const router = useRouter()

  const { user } = useUser()

  const { data: userData } = useSWR('/api/auth/me', fetcher)
  const { data: faunaUserData } = useSWR(
    () => '/api/users/' + userData.sub,
    fetcher,
    {
      onError: (error) => {
        if (error.data.error === 'invalid expression') {
          setIsNewUserPopupOpen(true)
          console.log('New user popup open.')
        }
      },
      onSuccess: (data) => {
        console.log(data)
        setIsNewUserPopupOpen(false)
      },
    }
  )

  const onQuery = ({ query }: { query: string }) => {
    if (!query) return undefined
    router.push('/q' + '?q=' + query)
  }

  return (
    <div>
      {user && (
        <NewUser
          isOpen={isNewUserPopupOpen}
          setIsOpen={setIsNewUserPopupOpen}
          queryCallback={async ({
            id,
            username,
            name,
            phone,
            email,
            picture,
          }) =>
            await fetch(`/api/users/new`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: id,
                username: username,
                name: name,
                phone: phone ? phone : null,
                email: email,
                picture: picture,
              }),
            })
          }
        />
      )}

      <div className="h-screen lg:overflow-y-hidden">
        <div className="relative overflow-hidden">
          <header className="relative">
            <div className="pt-6 bg-gray-900">
              <nav
                className="relative flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6"
                aria-label="Global"
              >
                <div className="flex items-center flex-1">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <a
                      href="#"
                      className="flex flex-row items-center space-x-2"
                    >
                      <Logo className="w-auto h-8 text-indigo-50 sm:h-10" />
                      <span className="hidden text-lg font-semibold md:block text-indigo-50">
                        Bookswap
                      </span>
                    </a>
                    <div className="flex flex-row items-center -mr-2 space-x-2 md:hidden">
                      {user ? (
                        <div className="flex flex-row items-center space-x-3">
                          <p className="text-base font-medium text-white">
                            {user.nickname}
                          </p>
                          <img
                            src={user.picture}
                            alt={user.nickname}
                            className="w-8 h-8 rounded-full shadow-md"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white"
                        aria-expanded="false"
                      >
                        <span className="sr-only">Open main menu</span>
                        <MenuOutline className="w-6 h-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex md:items-center md:space-x-6">
                  {user && faunaUserData ? (
                    <div className="flex flex-row items-center space-x-4">
                      <img
                        src={user.picture}
                        alt={user.nickname}
                        className="w-8 h-8 rounded-full shadow-md"
                      />
                      <p className="text-base font-medium text-gray-300">
                        Logged in as{' '}
                        <span className="text-white">{faunaUserData.name}</span>
                      </p>
                      <a
                        href="/api/auth/logout"
                        className="text-base font-medium text-white underline cursor-pointer hover:text-gray-300"
                      >
                        Log out
                      </a>
                    </div>
                  ) : (
                    <a
                      href="/api/auth/login"
                      className="text-base font-medium text-white cursor-pointer hover:text-gray-300"
                    >
                      Log in
                    </a>
                  )}
                  {user ? (
                    <a
                      onClick={() => router.push('/dashboard')}
                      className="inline-flex items-center px-4 py-2 text-base font-medium text-white transition duration-150 bg-gray-600 border border-transparent rounded-md cursor-pointer hover:bg-gray-700"
                    >
                      Dashboard
                    </a>
                  ) : (
                    <a
                      href="/api/auth/login"
                      className="inline-flex items-center px-4 py-2 text-base font-medium text-white transition duration-150 bg-gray-600 border border-transparent rounded-md hover:bg-gray-700"
                    >
                      Start selling textbooks
                    </a>
                  )}
                </div>
              </nav>
            </div>
            <Transition
              show={isMobileMenuOpen}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <div className="absolute inset-x-0 top-0 p-4 transition origin-top transform md:hidden">
                <div className="overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
                  <div className="flex items-center justify-between px-5 pt-4">
                    <div className="flex flex-row items-center space-x-2">
                      <Logo className="w-auto h-8 text-indigo-600 sm:h-10" />
                      <span className="text-lg font-semibold text-indigo-600">
                        Bookswap
                      </span>
                    </div>
                    <div className="-mr-2">
                      <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                      >
                        <span className="sr-only">Close menu</span>
                        <XOutline className="w-6 h-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="pt-5 pb-6">
                    <div className="px-5">
                      {user ? (
                        <a
                          onClick={() => router.push('/dashboard')}
                          className="block w-full px-4 py-3 font-medium text-center text-white transition duration-150 bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
                        >
                          Dashboard
                        </a>
                      ) : (
                        <a
                          href="/api/auth/login"
                          className="block w-full px-4 py-3 font-medium text-center text-white transition duration-150 bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
                        >
                          Start selling textbooks
                        </a>
                      )}
                    </div>
                    <div className="px-5 mt-3">
                      {user ? (
                        <p className="text-base font-medium text-center text-gray-500 transition duration-150 hover:text-gray-700">
                          <a
                            href="/api/auth/logout"
                            className="hover:underline"
                          >
                            Log out
                          </a>
                        </p>
                      ) : (
                        <p className="text-base font-medium text-center text-gray-500 transition duration-150 hover:text-gray-700">
                          <a href="/api/auth/login" className="hover:underline">
                            Log in
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </header>

          <main>
            <div className="h-screen pt-12 bg-gray-900 sm:pt-16 lg:pt-6 lg:pb-2 lg:overflow-hidden">
              <div className="mx-auto max-w-7xl lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                  <div className="max-w-md px-4 mx-auto sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                    <div className="lg:py-12">
                      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                        <span className="block">
                          Buy and sell textbooks for
                        </span>
                        <span className="block text-indigo-400">
                          half the price
                        </span>
                      </h1>
                      <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                        Why pay egregious amounts of money to buy textbooks
                        you'll only use for a year?
                        <br />
                        Why throw away perfectly usable textbooks when you can
                        recoup half the price?
                      </p>
                      <div className="mt-10 sm:mt-12">
                        <form
                          onSubmit={handleSubmit(onQuery)}
                          className="sm:max-w-xl sm:mx-auto lg:mx-0"
                        >
                          <div className="sm:flex">
                            <div className="flex-1 min-w-0">
                              <label htmlFor="query" className="sr-only">
                                Enter the name of a textbook
                              </label>
                              <input
                                id="query"
                                name="query"
                                type="text"
                                placeholder="Enter the name of a textbook..."
                                className="block w-full px-4 py-3 text-base text-gray-900 placeholder-gray-500 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-gray-900"
                                ref={register}
                              />
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-3">
                              <button
                                type="submit"
                                className="block w-full px-8 py-3 font-medium text-white transition duration-150 transform bg-indigo-500 rounded-md shadow hover:-translate-y-0.5 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-gray-900"
                              >
                                Search!
                              </button>
                            </div>
                          </div>
                          <div className="w-full mt-4">
                            <button
                              onClick={() => router.push('/q')}
                              className="block w-full px-8 py-3 font-medium text-white transition duration-150 transform bg-indigo-500 rounded-md shadow hover:-translate-y-0.5 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-gray-900"
                            >
                              See all listings
                            </button>
                          </div>
                          <p className="mt-3 text-sm text-gray-300 sm:mt-4">
                            An account is not required to search.{' '}
                            <a href="#" className="font-medium text-white">
                              Certain data
                            </a>{' '}
                            may be collected from the user.
                          </p>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                    <div className="max-w-md px-4 mx-auto sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0"></div>
                    <img
                      className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                      src="https://tailwindui.com/img/component-images/cloud-illustration-indigo-400.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Home