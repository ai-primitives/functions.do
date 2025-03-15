export async function waitFor<T>(promises: Promise<T>[], count: number): Promise<T[]> {
  const results: T[] = []
  const wrappedPromises = promises.map(
    (p) =>
      p
        .then((value) => {
          if (results.length < count) {
            results.push(value)
          }
          return value
        })
        .catch(() => {}), // Ignore rejections
  )

  await Promise.all(wrappedPromises)
  return results
}
