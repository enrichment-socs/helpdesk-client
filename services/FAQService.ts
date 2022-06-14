import axios, { AxiosResponse } from 'axios';
import { CreateFAQDto } from '../models/dto/faqs/create-faq.dto';
import { FAQ } from '../models/FAQ';
import { BaseService } from './BaseService';

export class FAQService extends BaseService {
  public async get(id: string) {
    const res: AxiosResponse<FAQ> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/faqs/${id}`, this.headersWithToken())
    );
    return res.data;
  }

  public async getAll() {
    const res: AxiosResponse<FAQ[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/faqs`, this.headersWithToken())
    );
    return res.data;
  }

  public async addFAQ(dto: CreateFAQDto) {
    const result: AxiosResponse<FAQ> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/faqs`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async updateFAQ(dto: CreateFAQDto, id: string) {
    const result: AxiosResponse<FAQ> = await this.wrapper.handle(
      axios.patch(`${this.BASE_URL}/faqs/${id}`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async deleteFAQ(id: string) {
    const result: AxiosResponse<FAQ> = await this.wrapper.handle(
      axios.delete(
        `${this.BASE_URL}/faqs/${id}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
