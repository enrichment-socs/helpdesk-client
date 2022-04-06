import axios, { AxiosResponse } from 'axios';
import { CreateFAQCategoryDto } from '../models/dto/faq-categories/create-faq-category.dto';
import { FAQCategory } from '../models/FAQCategory';
import { BaseService } from './BaseService';

export class FAQCategoriesService extends BaseService {
  public static async get(id: string) {
    try {
      const res: AxiosResponse<FAQCategory> = await axios.get(
        `${this.BASE_URL}/faq-categories/${id}`,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting specified faq category from server');
    }
  }

  public static async getAll() {
    try {
      const res: AxiosResponse<FAQCategory[]> = await axios.get(
        `${this.BASE_URL}/faq-categories`,
      );
      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting faq categories from server');
    }
  }

  static async addFAQCategory(dto: CreateFAQCategoryDto) {
    try {
      const result: AxiosResponse<FAQCategory> = await axios.post(
        `${this.BASE_URL}/faq-categories`,
        dto,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Add FAQ Category)');
    }
  }

  static async updateFAQCategory(dto: CreateFAQCategoryDto, categoryId: string)
  {
    try {
      const result: AxiosResponse<FAQCategory> = await axios.patch(
        `${this.BASE_URL}/faq-categories/${categoryId}`,
        dto,
      )
      return result.data;
    } catch (e) {
      console.log(e);
      throw new Error('Ups, something is wrong with the server (Update FAQ Category)');
    }
  }

  static async deleteFAQCategory(categoryId: string) {
    try {
      const result: AxiosResponse<FAQCategory> = await axios.delete(
        `${this.BASE_URL}/faq-categories/${categoryId}`,
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong with the server (Delete FAQ Category)',
      );
    }
  }
}
