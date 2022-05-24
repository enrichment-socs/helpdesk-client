import axios, { AxiosResponse } from 'axios';
import { CreateRoleDto } from '../models/dto/roles/create-role.dto';
import { Role } from '../models/Role';
import { BaseService } from './BaseService';

export class RoleService extends BaseService {
  public async get(id: string) {
    const res: AxiosResponse<Role> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/roles/${id}`)
    );
    return res.data;
  }

  public async getAll() {
    const res: AxiosResponse<Role[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/roles`, this.headersWithToken())
    );
    return res.data;
  }

  public async addRole(dto: CreateRoleDto) {
    const result: AxiosResponse<Role> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/roles`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async updateRole(dto: CreateRoleDto, roleId: string) {
    const result: AxiosResponse<Role> = await this.wrapper.handle(
      axios.patch(
        `${this.BASE_URL}/roles/${roleId}`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async deleteRole(roleId: string) {
    const result: AxiosResponse<Role> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/roles/${roleId}`, this.headersWithToken())
    );
    return result.data;
  }
}
