import axios, { AxiosResponse } from 'axios';
import { Role } from '../models/Role';
import { BaseService } from './BaseService';

export class RolesService extends BaseService {
  public static async get(id: string) {
    try {
      const res: AxiosResponse<Role> = await axios.get(
        `${this.BASE_URL}/roles/${id}`,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting specified role from server');
    }
  }

  public static async getAll() {
    try {
      const res: AxiosResponse<Role[]> = await axios.get(
        `${this.BASE_URL}/roles`,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting roles from server');
    }
  }
}
