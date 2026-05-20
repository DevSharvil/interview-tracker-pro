// centralised error handler — keeps every service function clean
export function handleError(error, context) {
  console.error(`[${context}]`, error.message)
  throw new Error(error.message)
}