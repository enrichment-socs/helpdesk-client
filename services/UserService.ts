import axios, { AxiosResponse } from 'axios';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { SessionUser } from '../models/SessionUser';
import { User } from '../models/User';
import { BaseService } from './BaseService';

export class UserService extends BaseService {
  public async getByIdentifier(identifier: string) {
    const res: AxiosResponse<SessionUser> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/users/find?identifier=${identifier}`)
    );
    return res.data;
  }

  public async create(createUserDto: CreateUserDto) {
    const res: AxiosResponse<SessionUser> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/users`, createUserDto)
    );
    return res.data;
  }

  public async getUsersWithAdminRole(): Promise<User[]> {
    const res: AxiosResponse<User[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/users/admin`, this.headersWithToken())
    );
    return res.data;
  }

  public async getAll(): Promise<User[]> {
    const res: AxiosResponse<User[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/users`, this.headersWithToken())
    );

    return res.data;
  }

  public async createUser(createUserDto: CreateUserDto) {
    const res: AxiosResponse<User> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/users`, createUserDto, this.headersWithToken())
    );
    return res.data;
  }

  public async updateUser(dto: CreateUserDto, id: string) {
    const res: AxiosResponse<User> = await this.wrapper.handle(
      axios.patch(`${this.BASE_URL}/users/${id}`, dto, this.headersWithToken())
    );

    return res.data;
  }

  public async deleteUser(id: string) {
    const result: AxiosResponse<User> = await this.wrapper.handle(
      axios.delete(
        `${this.BASE_URL}/users/${id}`,
        this.headersWithToken(),
      )
    );

    return result.data;
  }
}
