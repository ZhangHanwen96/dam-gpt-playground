import { useRouteError } from 'react-router-dom'
import { Result } from 'antd'

export default function ErrorPage() {
  const error = useRouteError() as any

  return (
    <div id="error-page">
      {/* <h1>Oops!</h1> */}
      {/* <p>Sorry, an unexpected error has occurred.</p> */}
      <Result
        status={'error'}
        title="Oops!"
        subTitle="Sorry, an unexpected error has occurred."
      >
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </Result>
    </div>
  )
}
