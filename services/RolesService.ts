import axios, { AxiosResponse } from 'axios';
import { CreateRoleDto } from '../models/dto/roles/create-role.dto';
import { Role } from '../models/Role';
import { BaseService } from './BaseService';

export class RolesService extends BaseService {
  public static async get(id: string) {
    try {
      const res: AxiosResponse<Role> = await axios.get(
        `${this.BASE_URL}/roles/${id}`
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
        `${this.BASE_URL}/roles`
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting roles from server');
    }
  }

  static async addRole(dto: CreateRoleDto) {
    try {
      const result: AxiosResponse<Role> = await axios.post(
        `${this.BASE_URL}/roles`,
        dto
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Add Role)');
    }
  }

  static async updateRole(dto: CreateRoleDto, roleId: string) {
    try {
      const result: AxiosResponse<Role> = await axios.patch(
        `${this.BASE_URL}/roles/${roleId}`,
        dto
      );
      return result.data;
    } catch (e) {
      console.log(e);
      throw new Error('Ups, something is wrong with the server (Update Role)');
    }
  }

  static async deleteRole(roleId: string) {
    try {
      const result: AxiosResponse<Role> = await axios.delete(
        `${this.BASE_URL}/roles/${roleId}`
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Delete Role)');
    }
  }
}
