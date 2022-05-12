import axios, { AxiosResponse } from 'axios';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { SessionUser } from '../models/SessionUser';
import { BaseService } from './BaseService';

export class UsersService extends BaseService {
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
}
