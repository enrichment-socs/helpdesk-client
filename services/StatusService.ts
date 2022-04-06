import axios, { AxiosResponse } from 'axios';
import { Status } from '../models/Status';
import { BaseService } from './BaseService';

export class StatusService extends BaseService {
  static async getAll(): Promise<Status[]> {
    try {
      const result: AxiosResponse<Status[]> = await axios.get(
        `${this.BASE_URL}/status`,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong with the server (Get Status)',
      );
    }
  }
}
