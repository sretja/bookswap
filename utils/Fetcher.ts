export const fetcher = async (url) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occured while fetching the data.')
    error.data = await res.json()
    error.status = res.status

    throw error
  }

  return res.json()
}
