import axios, { AxiosResponse } from 'axios';
import { CaseStatus } from '../models/CaseStatus';
import { CreateCaseStatusDto } from '../models/dto/case-statuses/create-case-status.dto';
import { BaseService } from './BaseService';

export class CaseStatusService extends BaseService {
  public async add(dto: CreateCaseStatusDto): Promise<CaseStatus> {
    const result: AxiosResponse<CaseStatus> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/case-statuses`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async getAllByCaseId(caseId: string): Promise<CaseStatus[]> {
    const result: AxiosResponse<CaseStatus[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/case-statuses/byCase?caseId=${caseId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
