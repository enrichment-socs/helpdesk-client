import axios, { AxiosResponse } from 'axios';
import { CreateSemesterDto } from '../models/dto/semesters/create-semester.dto';
import { Semester } from '../models/Semester';
import { BaseService } from './BaseService';

export class SemestersService extends BaseService {
  public async getSemesters(): Promise<Semester[]> {
    const result: AxiosResponse<Semester[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/semesters`)
    );
    return result.data;
  }

  public async getActiveSemester() {
    const result: AxiosResponse<Semester> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/semesters/active`)
    );

    return result.data;
  }

  public async addSemester(dto: CreateSemesterDto) {
    const result: AxiosResponse<Semester> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/semesters`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async updateSemester(dto: CreateSemesterDto, semesterId: string) {
    const result: AxiosResponse<Semester> = await this.wrapper.handle(
      axios.put(
        `${this.BASE_URL}/semesters/${semesterId}`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async deleteSemester(semesterId: string) {
    const result: AxiosResponse<Semester> = await this.wrapper.handle(
      axios.delete(
        `${this.BASE_URL}/semesters/${semesterId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async changeSemester(semester: Semester) {
    const result: AxiosResponse<Semester> = await this.wrapper.handle(
      axios.post(
        `${process.env.NEXT_PUBLIC_BASE_LOCAL_API_URL}/change-semester`,
        { semester }
      )
    );
    return result.data;
  }
}
