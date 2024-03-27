import axios from 'axios'

const baseURL = 'http://0.0.0.0:3333'

export default axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Methods': `GET PUT POST DELETE OPTIONS`,
    'Access-Control-Allow-Origin': `*`,
  },
})

export const axiosAuth = axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Origin': `*`,
  },
})
