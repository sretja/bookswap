import { useRouter } from 'next/router'
import useSWR from 'swr'

import { Spinner } from '../../components'
import { fetcher } from '../../utils'

import {
  UserCircleSolid,
  ChevronLeftSolid,
  PhoneSolid,
  MailSolid,
} from '@graywolfai/react-heroicons'

const QueryDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const fetchData = () => {
    let { data, error } = useSWR('/api/books/' + id, fetcher)
    let { data: seller, error: sellerError } = useSWR(
      () => '/api/users/' + data.seller,
      fetcher
    )

    if (!seller) return []

    return [data, error, seller, sellerError]
  }

  const [data, error, seller, sellerError] = fetchData()

  if (error || sellerError)
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Something went wrong.</p>
        <p className="text-red-500">{error}</p>
      </div>
    )

  return (
    <div>
      {data ? (
        <div className="flex w-screen min-h-screen px-16 py-8 bg-gray-100">
          <a
            onClick={() => router.back()}
            className="absolute top-0 left-0 flex flex-row items-center p-6 text-gray-400 transition duration-150 cursor-pointer hover:text-gray-600"
          >
            <ChevronLeftSolid className="w-6 h-6 " />
            <p className="text-sm font-semibold ">Go Back</p>
          </a>
          <div className="flex flex-col-reverse justify-start ml-0 space-x-0 space-y-4 md:ml-12 lg:ml-24 md:space-y-0 md:space-x-4 md:flex-row">
            <div className="w-full h-auto p-6 md:w-1/2 lg:w-1/3">
              <img
                src={data.picture}
                className="w-auto h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="flex flex-col pt-6 lg:pt-12">
              <h1 className="text-2xl font-semibold text-black lg:text-3xl">
                {data.name}
              </h1>
              <h2 className="space-x-2 text-base lg:text-lg">
                <span className="text-black">{data.author}</span>
                <span className="text-gray-500">{data.school}</span>
              </h2>
              <span className="mt-6"></span>
              <h3 className="text-xl text-indigo-500 lg:text-2xl">
                {data.price}
              </h3>
              <h4 className="text-indigo-500">Secondary {data.level}</h4>
              <span className="mt-6"></span>
              <div className="flex flex-row items-center space-x-2">
                {seller.picture ? (
                  <img src={seller.picture} className="w-8 h-8 rounded-full" />
                ) : (
                  <UserCircleSolid className="w-8 h-8 text-gray-500" />
                )}
                <p className="text-gray-700">{seller.name}</p>
              </div>
              <span className="mt-10"></span>
              <h6 className="mb-1 text-lg font-semibold lg:text-xl">
                Contact this seller
              </h6>
              {seller.phone ? (
                <a
                  href={`tel:${seller.phone}`}
                  className="flex flex-row items-center py-1.5 space-x-2"
                >
                  <PhoneSolid className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-500 underline hover:text-gray-700">
                    {seller.phone}
                  </p>
                </a>
              ) : (
                <></>
              )}
              {seller.email ? (
                <a
                  href={`mailto:${seller.email}?subject=${
                    data.name + ' by ' + data.author + ' on ' + 'Bookswap'
                  }`}
                  className="flex flex-row items-center py-1.5 space-x-2"
                >
                  <MailSolid className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-500 underline hover:text-gray-700">
                    {seller.email}
                  </p>
                </a>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
          <Spinner className="w-16 h-16 text-indigo-500" />
        </div>
      )}
    </div>
  )
}

export default QueryDetail
