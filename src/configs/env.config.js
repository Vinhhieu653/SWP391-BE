import dotenv from 'dotenv'
dotenv.config()

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN
