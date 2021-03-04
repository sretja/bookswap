import { FC } from 'react'
import { useRouter } from 'next/router'

import Swal from 'sweetalert2'

import { CheckSolid, TrashSolid } from '@graywolfai/react-heroicons'

import { en, fr } from '../locales/components'

export const DashboardBookPreview: FC<{
  name: string
  author: string
  price: string
  picture: string
  id: string
}> = ({ name, author, price, picture, id }) => {
  const router = useRouter()
  const { locale } = router

  const t = locale === 'fr' ? fr.dashboardPreview : en.dashboardPreview

  return (
    <div className="flex flex-row w-auto h-52 md:h-48">
      <img src={picture} className="block w-auto h-full rounded-lg shadow-md" />

      <div className="flex flex-col items-start justify-between w-full pt-0 pl-3 md:pt-2 md:pl-6">
        <div>
          <div className="flex flex-row items-center space-x-2">
            <h3 className="text-lg font-bold md:text-xl lg:text-2xl">{name}</h3>
          </div>
          <p className="text-base text-gray-500 md:text-lg">{author}</p>
          <p className="pt-2 text-base text-indigo-500 md:text-xl">{price}</p>
        </div>

        <div className="flex flex-col space-x-0 space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <button
            type="button"
            onClick={async () => {
              Swal.fire({
                title: t.sold.alert.title,
                text: t.sold.alert.description,
                showCloseButton: true,
                confirmButtonText: t.sold.alert.confirm,
                confirmButtonColor: 'red',
              }).then(async (res) => {
                if (res.isConfirmed) {
                  await fetch('/api/books/mark/sold/' + id, {
                    method: 'COPY',
                  }).then((res) => console.log(res))
                  router.reload()
                }
              })
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition duration-150 transform bg-indigo-600 border border-transparent rounded-md shadow-sm hover:-translate-y-1 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckSolid className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" />
            {t.sold.title}
          </button>
          <button
            type="button"
            onClick={async () => {
              Swal.fire({
                title: t.delete.alert.title,
                text: t.delete.alert.description,
                showCloseButton: true,
                confirmButtonText: t.delete.alert.confirm,
                confirmButtonColor: 'red',
              }).then(async (res) => {
                if (res.isConfirmed) {
                  await fetch('/api/books/delete/' + id, {
                    method: 'DELETE',
                  }).then((res) => console.log(res))
                  router.reload()
                }
              })
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 transition duration-150 transform bg-indigo-100 border border-transparent rounded-md shadow-sm hover:-translate-y-1 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <TrashSolid className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" />
            {t.delete.title}
          </button>
        </div>
      </div>
    </div>
  )
}
