import { type FC, type ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { Button } from '@/shared/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) => {
  return (
    <div
      role="alert"
      className="w-full flex flex-col items-center justify-center min-h-screen p-4 text-center"
    >
      <h2 className="text-xl font-bold mb-2 text-red-600">
        Something went wrong
      </h2>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
        {error.message}
      </pre>
      <Button onClick={resetErrorBoundary} className="mt-4">
        Try again
      </Button>
    </div>
  )
}

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload()
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
