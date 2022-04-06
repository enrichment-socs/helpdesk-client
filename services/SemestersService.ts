import axios, { AxiosResponse } from 'axios';
import { CreateSemesterDto } from '../models/dto/semesters/create-semester.dto';
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

  static async addSemester(dto: CreateSemesterDto) {
    try {
      const result: AxiosResponse<Semester> = await axios.post(
        `${this.BASE_URL}/semesters`,
        dto,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Add Semester)');
    }
  }
}
