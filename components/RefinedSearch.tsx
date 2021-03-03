import React, { FC } from 'react'

import { useForm } from 'react-hook-form'
import useSWR from 'swr'

import { Spinner } from '../components'
import { fetcher } from '../utils'

import { Transition } from '@headlessui/react'

export const RefinedSearch: FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  queryCallback: (params: {
    school: 'any' | string
    level: 'any' | 1 | 2 | 3 | 4 | 5
  }) => void
}> = ({ isOpen, setIsOpen, queryCallback }) => {
  const { register, handleSubmit } = useForm<{
    school: 'Any school' | string
    level:
      | 'Any level'
      | 'Secondary I'
      | 'Secondary II'
      | 'Secondary III'
      | 'Secondary IV'
      | 'Secondary V'
  }>()

  const { data: schoolList, error } = useSWR('/api/schools/', fetcher)

  if (error) return setIsOpen(false)

  const onSubmit = ({
    school,
    level,
  }: {
    school: 'Any school' | string
    level:
      | 'Any level'
      | 'Secondary I'
      | 'Secondary II'
      | 'Secondary III'
      | 'Secondary IV'
      | 'Secondary V'
  }) => {
    let data: {
      school: 'any' | string
      level: 'any' | 1 | 2 | 3 | 4 | 5
    } = { school: 'any', level: 'any' }
    if (school !== 'Any school') data.school = school
    switch (level) {
      case 'Secondary I':
        data.level = 1
        break
      case 'Secondary II':
        data.level = 2
        break
      case 'Secondary III':
        data.level = 3
        break
      case 'Secondary IV':
        data.level = 4
        break
      case 'Secondary V':
        data.level = 5
        break
      default:
        data.level = 'any'
        break
    }
    queryCallback({
      school: data.school,
      level: data.level,
    })
    setIsOpen(false)
  }

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 mt-24 text-center min-w-screen sm:block sm:p-0">
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
            {schoolList ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="mt-3 text-center sm:mt-2">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      Refined Search
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Refined Search allows you to refine your query to
                        specific levels or schools. Note that the regular text
                        search is deactivated when using Refined Search.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div>
                        <label
                          htmlFor="school"
                          className="text-sm font-medium text-gray-700 sr-only"
                        >
                          school
                        </label>
                        <select
                          id="school"
                          name="school"
                          className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          ref={register}
                        >
                          <option value="Any school">Any school</option>
                          {schoolList.map((school) => (
                            <option value={school} key={school}>
                              {school}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="level"
                          className="text-sm font-medium text-gray-700 sr-only"
                        >
                          Level
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
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
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
