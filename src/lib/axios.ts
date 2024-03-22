import axios from 'axios'
import { auth } from './auth'
const baseURL = 'http://0.0.0.0:3333'

export default axios.create({
  baseURL,
})

export const axiosAuth = axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Methods': `GET PUT POST DELETE OPTIONS`,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Origin': `*`,
  },
})
