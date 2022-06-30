import axios from 'axios';
import { CreateInformationDto } from '../models/dto/informations/create-information.dto';
import { Information } from '../models/Information';
import { BaseService } from './BaseService';

export class InformationService extends BaseService {
  public async add(dto: CreateInformationDto): Promise<Information> {
    const result = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/informations`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async getBySemester(
    semesterId: string,
    take?: number,
    skip?: number
  ): Promise<{ count: number; informations: Information[] }> {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/informations?semesterId=${semesterId}&take=${take}&skip=${skip}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
