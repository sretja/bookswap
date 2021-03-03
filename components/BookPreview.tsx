import { FC } from 'react'

export const BookPreview: FC<{
  onClick: () => void
  name: string
  school: string
  author: string
  price: string
  picture: string
}> = ({ onClick, name, school, author, price, picture }) => (
  <a onClick={onClick} className="flex flex-col w-64 h-auto p-2">
    <img
      src={picture}
      className="w-full h-auto transition duration-150 ease-in transform rounded-lg shadow-md cursor-pointer hover:-translate-y-1"
    />

    <div className="flex flex-row items-start justify-between w-full pt-2">
      <div>
        <h3 className="text-base font-bold">{name}</h3>
        <p>{author}</p>
      </div>

      <p className="text-lg text-indigo-500">{price}</p>
    </div>
    <p className="text-sm text-gray-500">{school}</p>
  </a>
)
