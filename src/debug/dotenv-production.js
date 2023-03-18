import dotenv from 'dotenv'

export const runDotenvOnDev = () => {
  if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
  }
}
