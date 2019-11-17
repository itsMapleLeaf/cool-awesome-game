export function createHttpClient(baseUrl: string) {
  return {
    async request(url: string, options?: RequestInit) {
      const response = await fetch(`${baseUrl}${url}`, options)
      const json = await response.json()

      if (!response.ok) {
        const message = json?.error?.message ?? "Unknown error"
        throw new Error(`Request failed with ${response.status}: ${message}`)
      }

      return json
    },
  }
}
