import axios, { AxiosResponse } from 'axios';
import { CreateGuidelineDto } from '../models/dto/guidelines/create-guideline.dto';
import { Guideline } from '../models/Guideline';
import { BaseService } from './BaseService';

export class GuidelineService extends BaseService {
  public async get(id: string) {
    const res: AxiosResponse<Guideline> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/guidelines/${id}`, this.headersWithToken())
    );
    return res.data;
  }

  public async getAll(
    take?: number,
    skip?: number
  ): Promise<{ count: number; guidelines: Guideline[] }> {
    let url = `${this.BASE_URL}/guidelines`;

    if (
      take !== null &&
      take !== undefined &&
      skip !== null &&
      skip !== undefined
    ) {
      url += `?take=${take}&skip=${skip}`;
    }

    const res: AxiosResponse<{ count: number; guidelines: Guideline[] }> =
      await this.wrapper.handle(axios.get(url, this.headersWithToken()));

    return res.data;
  }

  public async getByFAQCategory(categoryId: string) {
    const res: AxiosResponse<Guideline[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/guidelines/category/${categoryId}`,
        this.headersWithToken()
      )
    );

    return res.data;
  }

  public async addFAQ(dto: CreateGuidelineDto) {
    const result: AxiosResponse<Guideline> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/guidelines`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async updateFAQ(dto: CreateGuidelineDto, id: string) {
    const result: AxiosResponse<Guideline> = await this.wrapper.handle(
      axios.patch(
        `${this.BASE_URL}/guidelines/${id}`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async deleteFAQ(id: string) {
    const result: AxiosResponse<Guideline> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/guidelines/${id}`, this.headersWithToken())
    );
    return result.data;
  }
}
