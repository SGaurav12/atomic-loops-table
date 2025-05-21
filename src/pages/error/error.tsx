import { useRouteError } from 'react-router';

function ErrorPage() {
  const error = useRouteError();

  let errorMessage = '¯\\_(ツ)_/¯';
  if (error instanceof Error) {
    errorMessage = error.stack || error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>

      <textarea
        readOnly
        name="error"
        id="error"
        value={errorMessage}
        rows={30}
      ></textarea>

      <button onClick={() => (window.location.href = '/')}>Click here to reload the app</button>
    </div>
  );
}

export default ErrorPage;