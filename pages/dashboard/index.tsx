import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { fetcher } from '../../utils'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import Notiflix from 'notiflix'

import { NewBook, Spinner, DashboardBookPreview } from '../../components'
import { ChevronLeftSolid, PlusSmSolid } from '@graywolfai/react-heroicons'

const Dashboard = () => {
  const [isCreatingNewListing, setIsCreatingNewListing] = useState<boolean>(
    false
  )

  const [isChangeButtonDisabled, setIsChangeButtonDisabled] = useState<boolean>(
    false
  )

  useEffect(() => {
    Notiflix.Notify.Init({
      position: 'right-bottom',
      closeButton: true,
      borderRadius: '10px',
      fontSize: '12px',
      distance: '20px',
      useIcon: false,
      timeout: 1500,
      showOnlyTheLastOne: true,
    })
  }, [])

  const router = useRouter()

  const { data: userData, error: userError } = useSWR('/api/auth/me', fetcher)
  const { data: faunaUserData, error: faunaUserError } = useSWR(
    () => '/api/users/' + userData.sub,
    fetcher
  )
  const { data, error } = useSWR(
    () => '/api/books/seller/' + faunaUserData.id,
    fetcher,
    {
      onSuccess: (data) => console.log(data),
    }
  )

  const { register, handleSubmit } = useForm<{
    name: string
    username: string
    phone: string
  }>()

  const onSubmit = async ({
    name,
    username,
    phone,
  }: {
    name: string
    username: string
    phone: string
  }) => {
    setIsChangeButtonDisabled(true)
    await fetch('/api/users/update/' + faunaUserData.id, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        username: username,
        phone: phone,
      }),
    })
    router.reload()
  }

  if (userError || faunaUserError || error)
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Something went wrong.</p>
        <p className="text-red-500">{error}</p>
      </div>
    )

  return (
    <div>
      {userData && faunaUserData && data && (
        <NewBook
          isOpen={isCreatingNewListing}
          setIsOpen={setIsCreatingNewListing}
          queryCallback={async ({
            school,
            name,
            author,
            price,
            level,
            picture,
            seller,
          }) =>
            await fetch('/api/books/seller/new/' + seller, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                school: school,
                name: name,
                author: author,
                price: price,
                level: level,
                picture: picture,
              }),
            })
          }
        />
      )}

      <div className="min-h-screen bg-gray-100">
        {userData && faunaUserData && data ? (
          <div>
            <header className="fixed top-0 z-10 flex items-center justify-between w-screen px-4 py-5 bg-white border-b-2 border-gray-200 md:px-8 lg:px-12">
              <a
                onClick={() => router.back()}
                className="flex flex-row items-center pr-4 text-gray-400 transition duration-150 cursor-pointer hover:text-gray-600"
              >
                <ChevronLeftSolid className="w-10 h-10 md:w-8 md:h-8" />
                <p className="hidden text-sm font-semibold md:block">Go Back</p>
              </a>
              <div className="flex flex-row w-full space-x-8 md:w-auto sm:justify-between">
                <a
                  className="flex flex-row items-center space-x-1 text-indigo-500 transition duration-150 cursor-pointer hover:text-indigo-700"
                  onClick={() => {
                    if (data.length >= 5 && !faunaUserData.sudo)
                      return Notiflix.Notify.Failure(
                        'You have reached the limit of 5 listings. Contact us at josef.leventon@gmail.com to increase your limit.'
                      )
                    setIsCreatingNewListing(true)
                  }}
                >
                  <PlusSmSolid className="w-4 h-4" />
                  <p className="text-sm">New Listing</p>
                </a>
                <div className="flex flex-row items-center space-x-4">
                  <div className="flex flex-row items-center space-x-2">
                    <img
                      src={userData.picture}
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="hidden font-semibold text-black sm:block">
                      {faunaUserData.name}
                    </p>
                  </div>
                  <a
                    href="/api/auth/logout"
                    className="text-sm text-gray-500 transition duration-150 md:text-base hover:text-gray-700"
                  >
                    Log out
                  </a>
                </div>
              </div>
            </header>
            <main className="px-4 pt-24 md:px-8 lg:px-12">
              <div className="flex flex-col space-x-0 md:space-x-8 md:flex-row">
                <div className="w-full h-full p-4 md:w-1/2">
                  <h3 className="text-2xl font-semibold">Listings</h3>
                  <p className="text-gray-500">
                    Your currently visible listings
                  </p>
                  <style jsx>
                    {`
                      #book-preview-box: {
                        height: 74.5vh;
                      }
                      @media (max-width: 641px) {
                        #book-preview-box: {
                          height: auto;
                        }
                      }
                    `}
                  </style>
                  <div
                    className="static flex flex-col pt-4 space-y-12 md:space-y-8 md:overflow-y-scroll md:relative"
                    id="book-preview-box"
                  >
                    {data.map((book) => (
                      <DashboardBookPreview
                        name={book.data.name}
                        author={book.data.author}
                        price={book.data.price}
                        picture={book.data.picture}
                        id={book.ref['@ref'].id}
                        key={book.ref['@ref'].id}
                      />
                    ))}
                  </div>
                </div>
                <div className="static w-full h-full p-4 md:fixed right-4 md:w-1/2">
                  <h3 className="text-2xl font-semibold">Account</h3>
                  <p className="text-gray-500">Your personal information</p>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col pt-3 space-y-3"
                  >
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="block w-full placeholder-gray-300 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Jane Doe"
                          autoComplete="name"
                          spellCheck={true}
                          autoCorrect="on"
                          defaultValue={faunaUserData.name}
                          required
                          ref={register}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          className="block w-full placeholder-gray-300 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="example.username"
                          autoComplete="username"
                          spellCheck={false}
                          autoCorrect="off"
                          defaultValue={faunaUserData.username}
                          required
                          ref={register}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email (cannot be changed)
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="block w-full text-gray-600 placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={faunaUserData.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone no.
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          pattern={
                            '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
                          }
                          name="phone"
                          id="phone"
                          autoComplete="phone"
                          spellCheck={false}
                          autoCorrect="off"
                          placeholder="+1 123-456-7890"
                          className="block w-full placeholder-gray-400 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          defaultValue={faunaUserData.phone}
                          ref={register}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 mt-3 text-sm font-medium text-white transition duration-150 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={isChangeButtonDisabled}
                        aria-disabled={isChangeButtonDisabled}
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      If you wish to have your account deleted, please contact
                      us at{' '}
                      <a
                        className="text-indigo-500 transition duration-150 hover:text-indigo-700"
                        href={`mailto:josef.leventon@gmail.com?subject=Account deletion for ${faunaUserData.name} - ${faunaUserData.id}`}
                      >
                        josef.leventon@gmail.com
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </main>
          </div>
        ) : (
          <div className="flex items-center justify-center w-screen h-screen">
            <Spinner className="w-16 h-16 text-indigo-500" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
