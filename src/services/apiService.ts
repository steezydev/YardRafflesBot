import axios from 'axios'
import { apiConfig } from '../config/apiConfig'

export class ApiService {
  private apiToken = ''
  private baseUrl = ''

  /**
   * Sets variable necessary for api requesting
   * 
   * @constructor
   */

  constructor() {
    this.apiToken = process.env.API_TOKEN!
    this.baseUrl = apiConfig.baseUrl
  }

  /**
   * Request with GET method
   * 
   * @param url {string} Request endpoint  
   * @param params {object} Query params
   * @returns API response
   */
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

  /**
   * Request with POST method
   * 
   * @param url {string} Request endpoint  
   * @param data {object} Request body
   * @returns API response
   */
  async post(url: string, data: any, params: any) {
    try {
      const response = await axios({
        method: 'post',
        url: this.baseUrl + url,
        data: data,
        params: params,
        headers: {
          token: this.apiToken
        },
      })

      return response.data
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Request with DELETE method
   * 
   * @param url {string} Request endpoint  
   * @param data {object} Request body
   * @returns API response
   */
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

  /**
   * Request with PUT method
   * 
   * @param url {string} Request endpoint  
   * @param data {object} Request body
   * @returns API response
   */
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