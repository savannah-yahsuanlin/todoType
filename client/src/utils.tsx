import axios from 'axios'

export const AxiosHttpRequest = async (method: string, url: string, data?: object | undefined) => {
  switch (method) {
    case 'GET':
      return axios.get(url)
    case 'POST':
      return axios.post(url, data)
    case 'DELETE':
      return axios.delete(url, data)
    case 'PUT':
      return axios.put(url, data)
    default:
      alert('Not a valid method');
      break;
  }
}

export const API_URL = 'http://localhost:3000'