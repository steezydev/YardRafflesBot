import axios from 'axios'
import { apiConfig } from '../config/apiConfig'

export class ApiService {
  private apiToken = ''
  private baseUrl = ''

  constructor() {
    this.apiToken = process.env.API_TOKEN!
    this.baseUrl = apiConfig.baseUrl
  }

  async get(url: string, params: any) {
    try {
      const response = await axios({
        method: 'get',
        url: this.baseUrl + url,
        params: params,
        headers: {
          token: this.apiToken
        },
      })

      return response.data
    } catch (err) {
      //console.log(err)
    }
  }

  async post(url: string, data: any) {
    try {
      const response = await axios({
        method: 'post',
        url: this.baseUrl + url,
        data: data,
        headers: {
          token: this.apiToken
        },
      })

      return response.data
    } catch (err) {
      //console.log(err)
    }
  }

  async delete(url: string, data: any) {
    try {
      const response = await axios({
        method: 'delete',
        url: this.baseUrl + url,
        data: data,
        headers: {
          token: this.apiToken
        },
      })

      return response.data
    } catch (err) {
      //console.log(err)
    }
  }

  async put(url: string, data: any) {
    try {
      const response = await axios({
        method: 'put',
        url: this.baseUrl + url,
        data: data,
        headers: {
          token: this.apiToken
        },
      })

      return response.data
    } catch (err) {
      //console.log(err)
    }
  }
}