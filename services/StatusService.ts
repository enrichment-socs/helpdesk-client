import axios, { AxiosResponse } from 'axios';
import { CreateStatusDto } from '../models/dto/status/create-status.dto';
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

  static async addStatus(dto: CreateStatusDto) {
    try {
      const result: AxiosResponse<Status> = await axios.post(
        `${this.BASE_URL}/status`,
        dto,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Add Status)');
    }
  }

  static async updateStatus(dto: CreateStatusDto, statusId: string)
  {
    try {
      const result: AxiosResponse<Status> = await axios.patch(
        `${this.BASE_URL}/status/${statusId}`,
        dto,
      )
      return result.data;
    } catch (e) {
      console.log(e);
      throw new Error('Ups, something is wrong with the server (Update Status)');
    }
  }

  static async deleteStatus(statusId: string) {
    try {
      const result: AxiosResponse<Status> = await axios.delete(
        `${this.BASE_URL}/status/${statusId}`,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong with the server (Delete Status)',
      );
    }
  }
}
