import axios, { AxiosResponse } from 'axios';
import { CreateFAQCategoryDto } from '../models/dto/faq-categories/create-faq-category.dto';
import { FAQCategory } from '../models/FAQCategory';
import { BaseService } from './BaseService';

export class FAQCategoryService extends BaseService {
  public async get(id: string) {
    const res: AxiosResponse<FAQCategory> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/faq-categories/${id}`)
    );
    return res.data;
  }

  public async getAll() {
    const res: AxiosResponse<FAQCategory[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/faq-categories`)
    );
    return res.data;
  }

  public async addFAQCategory(dto: CreateFAQCategoryDto) {
    const result: AxiosResponse<FAQCategory> = await this.wrapper.handle(
      axios.post(
        `${this.BASE_URL}/faq-categories`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async updateFAQCategory(
    dto: CreateFAQCategoryDto,
    categoryId: string
  ) {
    const result: AxiosResponse<FAQCategory> = await this.wrapper.handle(
      axios.patch(
        `${this.BASE_URL}/faq-categories/${categoryId}`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async deleteFAQCategory(categoryId: string) {
    const result: AxiosResponse<FAQCategory> = await this.wrapper.handle(
      axios.delete(
        `${this.BASE_URL}/faq-categories/${categoryId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
