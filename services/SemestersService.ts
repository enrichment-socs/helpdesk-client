import axios, { AxiosResponse } from 'axios';
import { Semester } from '../models/Semester';
import { BaseService } from './BaseService';

export class SemestersService extends BaseService {
  static async getSemesters(): Promise<Semester[]> {
    try {
      const result: AxiosResponse<Semester[]> = await axios.get(
        `${this.BASE_URL}/semesters`,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong with the server (Get Semesters)',
      );
    }
  }
}
