import { useState } from 'react'
import { useRouter } from 'next/router'

import { useForm } from 'react-hook-form'
import { useUser } from '@auth0/nextjs-auth0'
import useSWR from 'swr'

import { Spinner } from '.'

import { Transition } from '@headlessui/react'
import { fetcher } from '../utils'
import { en, fr } from '../locales/components'

export const NewBook = ({
  isOpen,
  setIsOpen,
  queryCallback,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  queryCallback(params: {
    school: string
    name: string
    author: string
    price: string
    level: number
    picture: string
    seller: string
  }): any
}) => {
  const { register, handleSubmit } = useForm<{
    school: string
    name: string
    author: string
    price: string
    level:
      | 'Secondary I'
      | 'Secondary II'
      | 'Secondary III'
      | 'Secondary IV'
      | 'Secondary V'
  }>()

  const { locale } = useRouter()
  const t = locale === 'fr' ? fr.newBook : en.newBook

  const [picture, setPicture] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const { user, error } = useUser()
  const { data: schools } = useSWR('/api/schools', fetcher)

  if (error) setIsOpen(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true)
    const files = e.currentTarget.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'rg3mpat0')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/drf4qah2a/image/upload',
      {
        method: 'POST',
        body: data,
      }
    )

    const file = await res.json()
    setIsUploading(false)
    setPicture(file.secure_url)
  }

  const onSubmit = async ({
    school,
    name,
    author,
    price,
    level,
  }: {
    school: string
    name: string
    author: string
    price: string
    level:
      | 'Secondary I'
      | 'Secondary II'
      | 'Secondary III'
      | 'Secondary IV'
      | 'Secondary V'
  }) => {
    if (!picture) return
    let formattedLevel: number
    switch (level) {
      case 'Secondary I':
        formattedLevel = 1
        break
      case 'Secondary II':
        formattedLevel = 2
        break
      case 'Secondary III':
        formattedLevel = 3
        break
      case 'Secondary IV':
        formattedLevel = 4
        break
      case 'Secondary V':
        formattedLevel = 5
        break
    }
    await queryCallback({
      school: school,
      name: name,
      author: author,
      price: price,
      level: formattedLevel,
      picture: picture,
      seller: user.sub,
    })
    console.log({
      school: school,
      name: name,
      author: author,
      price: price,
      level: formattedLevel,
      picture: picture,
      seller: user.sub,
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
            {user && schools ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="mt-3 text-center sm:mt-2">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      {t.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{t.description}</p>
                    </div>
                    <div className="mt-4">
                      <div className="py-2">
                        <label
                          htmlFor="name"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          {t.form.title}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Example Book"
                            spellCheck={true}
                            autoCorrect="on"
                            ref={register}
                            required
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="author"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          {t.form.author}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="author"
                            id="author"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="John Doe"
                            spellCheck={true}
                            autoCorrect="on"
                            ref={register}
                            required
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="school"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          {t.form.school}
                        </label>
                        <div className="mt-1">
                          <select
                            id="school"
                            name="school"
                            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ref={register}
                          >
                            {schools.map((school) => (
                              <option value={school} key={school}>
                                {school}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="price"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          {t.form.price}
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            // prettier-ignore
                            pattern="^(\$[0-9][0-9]\.[0-9][0-9])$"
                            name="price"
                            id="price"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="$00.00"
                            defaultValue={'$'}
                            spellCheck={false}
                            autoCorrect="off"
                            ref={register}
                          />
                        </div>
                      </div>
                      <div className="py-2">
                        <label
                          htmlFor="level"
                          className="block ml-2 text-sm font-medium text-left text-gray-700"
                        >
                          {t.form.level}
                        </label>
                        <select
                          id="level"
                          name="level"
                          className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ref={register}
                        >
                          <option value="Any level">Any level</option>
                          <option value="Secondary I">Secondary I</option>
                          <option value="Secondary II">Secondary II</option>
                          <option value="Secondary III">Secondary III</option>
                          <option value="Secondary IV">Secondary IV</option>
                          <option value="Secondary V">Secondary V</option>
                        </select>
                      </div>
                      <div className="py-2">
                        <label className="block text-sm font-medium text-left text-gray-700">
                          {t.form.photo.title}
                        </label>
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center p-8">
                            <Spinner className="w-10 h-10 text-indigo-500" />
                          </div>
                        ) : (
                          <div className="flex flex-row">
                            <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <svg
                                  className="w-12 h-12 mx-auto text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>{t.form.photo.upload}</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      onChange={handleFileUpload}
                                    />
                                  </label>
                                  <p className="pl-1">{t.form.photo.drag}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                            {picture && (
                              <div className="flex items-center justify-center w-full md:w-1/3">
                                <img
                                  src={picture}
                                  alt="Upload preview"
                                  className="w-auto h-32 rounded-lg shadow-md"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white transition duration-150 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    {t.form.confirm}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 transition duration-150 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    {t.form.cancel}
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
