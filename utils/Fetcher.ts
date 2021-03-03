export const fetcher = async (url) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = {
      data: await res.json(),
      status: res.status,
    }

    throw error
  }

  return res.json()
}
