import React, { FC } from 'react'

import { useForm } from 'react-hook-form'
import useSWR from 'swr'

import { Spinner } from '../components'
import { fetcher } from '../utils'

import { Transition } from '@headlessui/react'

export const NewUser: FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  queryCallback: (params: {
    id: string
    username: string
    name: string
    phone: string
    email: string
    picture: string
  }) => Promise<Response>
}> = ({ isOpen, setIsOpen, queryCallback }) => {
  const { register, handleSubmit } = useForm<{
    username: string
    name: string
    phone: string
  }>()

  const { data, error } = useSWR('/api/auth/me', fetcher)

  if (error) return setIsOpen(false)

  const onSubmit = async ({
    username,
    name,
    phone,
  }: {
    username: string
    name: string
    phone: string
  }) => {
    await queryCallback({
      id: data.sub,
      username: username,
      name: name,
      phone: phone,
      email: data.email,
      picture: data.picture,
    })
    setIsOpen(false)
  }

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 mt-8 text-center min-w-screen sm:block sm:p-0">
        <Transition
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
        </Transition>

        {/* Trick the browser into centering the modal contents. */}
        {/* <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span> */}
        <Transition
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:scale-95"
        >
          <div
            className="z-20 inline-block px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl align-center sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {data ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="mt-3 text-center sm:mt-2">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      Welcome to Bookswap!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        We need some more information about you before you can
                        continue.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="py-2">
                        <label
                          htmlFor="username"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          Username
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="username"
                            id="username"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="example.username"
                            defaultValue={data.nickname}
                            autoComplete="username"
                            spellCheck={false}
                            autoCorrect="off"
                            ref={register}
                            required
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="name"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="John Doe"
                            defaultValue={''}
                            autoComplete="name"
                            spellCheck={true}
                            autoCorrect="on"
                            ref={register}
                            required
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="email"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="you@example.com"
                            defaultValue={data.email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="phone"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
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
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="+1 123-456-7890"
                            defaultValue={''}
                            autoComplete="phone"
                            spellCheck={false}
                            autoCorrect="off"
                            ref={register}
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="picture"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          Profile picture URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="picture"
                            id="picture"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="+1 123-456-7890"
                            defaultValue={data.picture}
                            disabled
                          />
                          <a
                            href="https://wordpress.com/start/wpcc/oauth2-user?ref=oauth2&oauth2_redirect=https%3A%2F%2Fpublic-api.wordpress.com%2Foauth2%2Fauthorize%2F%3Fclient_id%3D1854%26response_type%3Dcode%26blog_id%3D0%26state%3D5f500e1f1af9e7b3a85b26fb8d1d3bde783cfa61ace260a83e60b7aca7ccf271%26redirect_uri%3Dhttps%253A%252F%252Fen.gravatar.com%252Fconnect%252F%253Faction%253Drequest_access_token%26jetpack-code%26jetpack-user-id%3D0%26action%3Doauth2-login&oauth2_client_id=1854"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="ml-2 text-sm text-left text-indigo-600 underline transition duration-150 hover:text-indigo-800"
                          >
                            You can change it here.
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Complete signup
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center">
                <Spinner className="w-12 h-12 text-indigo-500" />
              </div>
            )}
          </div>
        </Transition>
      </div>
    </div>
  )
}
