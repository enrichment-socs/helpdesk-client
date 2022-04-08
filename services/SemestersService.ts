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

  static async updateSemester(dto: CreateSemesterDto, semesterId: string) {
    try {
      const result: AxiosResponse<Semester> = await axios.put(
        `${this.BASE_URL}/semesters/${semesterId}`,
        dto,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong with the server (Update Semester)',
      );
    }
  }

  static async deleteSemester(semesterId: string) {
    try {
      const result: AxiosResponse<Semester> = await axios.delete(
        `${this.BASE_URL}/semesters/${semesterId}`,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong with the server (Delete Semester)',
      );
    }
  }

  static async changeSemester(semester: Semester) {
    try {
      const result: AxiosResponse<Semester> = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_LOCAL_API_URL}/change-semester`,
        { semester },
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong when changing semester');
    }
  }
}
