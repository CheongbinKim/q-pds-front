import axios from 'axios'

const HOST = process.env.REACT_APP_API_HOST;
const PORT = process.env.REACT_APP_API_PORT;

const BASE_URL = 'http://52.79.218.211:5064/'
// const BASE_URL = `http://${HOST}:${PORT}/`

// 단순 get요청으로 인증값이 필요없는 경우
const axiosApi = (url) => {
  const instance = axios.create({ 
    baseURL: url,
    responseType: 'json',
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    } 
  })
  return instance
}

// const axiosAuthApi = (url, options) => {
//   const token = '토큰 값'
//   const instance = axios.create({
//     baseURL: url,
//     headers: { Authorization: 'Bearer ' + token },
//     ...options,
//   })
//   return instance
// }

export const defaultInstance = axiosApi(BASE_URL)