import axios, { AxiosResponse } from 'axios';
import { Case } from '../models/Case';
import { CreateCaseDto } from '../models/dto/cases/create-case.dto';
import { BaseService } from './BaseService';

export class CaseService extends BaseService {
  public async getCases(requesterEmail?: string): Promise<Case[]> {
    const result: AxiosResponse<Case[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/cases?requesterEmail=${requesterEmail ?? ''}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }

  public async add(dto: CreateCaseDto) {
    const result: AxiosResponse<Case> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/cases`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async get(id: string) {
    const result: AxiosResponse<Case> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/cases/${id}`, this.headersWithToken())
    );

    return result.data;
  }
}
