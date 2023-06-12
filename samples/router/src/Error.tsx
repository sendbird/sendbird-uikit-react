import { useRouteError } from 'react-router-dom'

type ErrorType = {
  statusText?: string
  message?: string
}

export function ErrorPage() {
  const error = useRouteError() as ErrorType
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops! an error has occurred</h1>
      <p> {error?.statusText || error?.message}</p>
    </div>
  )
}
