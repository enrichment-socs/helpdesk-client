import axios, { AxiosResponse } from 'axios';
import { CreateResolutionDto } from '../models/dto/resolutions/create-resolution.dto';
import { Resolution } from '../models/Resolution';
import { BaseService } from './BaseService';

export class ResolutionService extends BaseService {
  public async add(dto: CreateResolutionDto): Promise<Resolution> {
    const result: AxiosResponse<Resolution> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/resolutions`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async getByCaseId(caseId: string): Promise<Resolution> {
    const result: AxiosResponse<Resolution> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/resolutions/byCase?caseId=${caseId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
