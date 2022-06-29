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

  public async getBySemester(semesterId: string): Promise<Information[]> {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/informations?semesterId=${semesterId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
