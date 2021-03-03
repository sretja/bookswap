import { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import _ from 'lodash'

import { BookPreview, Spinner, RefinedSearch } from '../../components'
import { fetcher } from '../../utils'

import {
  HomeSolid,
  FilterSolid,
  SearchOutline,
} from '@graywolfai/react-heroicons'

const Query = () => {
  const router = useRouter()
  const { q, author, lvl } = router.query

  const [isUsingRefinedSearch, setIsUsingRefinedSearch] = useState<boolean>(
    false
  )

  const { data, error } =
    author && lvl
      ? useSWR(
          '/api/books/refined' + '?author=' + author + '&lvl=' + lvl,
          fetcher,
          { onSuccess: () => console.log(data) }
        )
      : author && !lvl
      ? useSWR('/api/books/refined' + '?author=' + author, fetcher, {
          onSuccess: () => console.log(data),
        })
      : !author && lvl
      ? useSWR('/api/books/refined' + '?lvl=' + lvl, fetcher, {
          onSuccess: () => console.log(data),
        })
      : q
      ? useSWR('/api/books' + '?q=' + q, fetcher, {
          onSuccess: () => console.log(data),
        })
      : useSWR('/api/books', fetcher, { onSuccess: () => console.log(data) })

  if (error)
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Something went wrong.</p>
        <p className="text-red-500">{error}</p>
      </div>
    )

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedQuery = e.currentTarget.value.replaceAll(' ', '%20')
    switch (e.currentTarget.value === '') {
      case true:
        router.push('/q', undefined, { shallow: true })
        break
      default:
        router.push('/q' + '?q=' + formattedQuery, undefined, {
          shallow: true,
        })
        break
    }
  }

  return (
    <div>
      <RefinedSearch
        isOpen={isUsingRefinedSearch}
        setIsOpen={setIsUsingRefinedSearch}
        queryCallback={({ school, level }) => {
          if (school === 'any' && level === 'any')
            router.push('/q', undefined, { shallow: true })
          else if (school === 'any' && level !== 'any')
            router.push('/q' + '?lvl=' + level, undefined, { shallow: true })
          else if (author !== 'any' && level === 'any')
            router.push('/q' + '?school=' + school, undefined, {
              shallow: true,
            })
          else
            router.push(
              '/q' + '?school=' + school + '&lvl=' + level,
              undefined,
              { shallow: true }
            )
        }}
      />
      <div className="min-h-screen overflow-y-hidden">
        <header className="fixed top-0 z-20 w-full bg-white">
          <div className="flex flex-row w-full">
            <div className="flex flex-row items-center justify-center w-full h-20 -space-x-2">
              <a
                onClick={() => router.push('/')}
                className="flex items-center justify-center h-full border-0 border-b border-gray-300 cursor-pointer"
              >
                <HomeSolid className="w-6 h-6 m-4 text-gray-300 hover:text-indigo-500" />
              </a>

              <div className="flex items-center justify-center h-full border-0 border-b border-gray-300">
                <SearchOutline className="w-6 h-6 m-4 text-gray-300" />
              </div>

              <input
                type="search"
                name="search"
                id="search"
                className="w-full h-20 text-lg text-gray-500 placeholder-gray-300 border-0 border-b border-gray-300 focus:outline-none lg:text-xl focus:border-gray-300 focus-within:border-gray-300 focus:ring-opacity-0"
                placeholder="Search..."
                onChange={handleQueryChange}
                value={q || ''}
                autoFocus
                disabled={isUsingRefinedSearch}
              />
            </div>

            <div className="flex items-center justify-center h-20 border-b border-gray-300">
              <a
                title={
                  author || lvl
                    ? 'Click to disable refined search'
                    : 'Refined search'
                }
                onClick={() => {
                  author || lvl
                    ? router.push('/q', undefined, { shallow: true })
                    : setIsUsingRefinedSearch(true)
                }}
              >
                <FilterSolid
                  className={`w-8 h-8 m-4 ${
                    author || lvl ? 'text-indigo-500' : 'text-gray-300'
                  } transition duration-150 cursor-pointer lg:w-6 lg:h-6 hover:text-indigo-500`}
                />
              </a>
            </div>
          </div>
        </header>
        <main className="flex justify-center w-screen h-full p-5 pt-24 bg-gray-100">
          <div>
            {data ? (
              <div
                style={{ minHeight: '85vh' }}
                className="grid w-full h-full grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {_.isEmpty(data) ? (
                  <div
                    className="flex items-center justify-center w-screen"
                    style={{ height: '85vh' }}
                  >
                    <p className="text-gray-500">
                      Your query did not return any results.
                    </p>
                  </div>
                ) : (
                  data.map((book) => (
                    <BookPreview
                      key={book.ref['@ref'].id}
                      onClick={() => router.push('/q/' + book.ref['@ref'].id)}
                      name={book.data.name}
                      school={book.data.school}
                      author={book.data.author}
                      price={book.data.price}
                      picture={book.data.picture}
                    />
                  ))
                )}
              </div>
            ) : (
              <div
                className="flex items-center justify-center w-full"
                style={{ height: '85vh' }}
              >
                <Spinner className="w-16 h-16 text-indigo-500" />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Query
