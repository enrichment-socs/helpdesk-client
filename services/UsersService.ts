import axios, { AxiosResponse } from 'axios';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { SessionUser } from '../models/SessionUser';
import { BaseService } from './BaseService';

export class UsersService extends BaseService {
  public static async getByIdentifier(identifier: string) {
    try {
      const res: AxiosResponse<SessionUser> = await axios.get(
        `${this.BASE_URL}/users/find?identifier=${identifier}`,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting user from server');
    }
  }

  public static async create(createUserDto: CreateUserDto) {
    try {
      const res: AxiosResponse<SessionUser> = await axios.post(
        `${this.BASE_URL}/users/`,
        createUserDto,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when registering user to the server');
    }
  }
}
