import axios, { AxiosResponse } from 'axios';
import { Category } from '../models/Category';
import { CreateCategoryDto } from '../models/dto/categories/create-category-dto';
import { BaseService } from './BaseService';

export class CategoryService extends BaseService {
  public async getAll(
    take?: number,
    skip?: number
  ): Promise<{ count: number; ticketCategories: Category[] }> {
    let url = `${this.BASE_URL}/categories`;

    if (
      take !== null &&
      take !== undefined &&
      skip !== null &&
      skip !== undefined
    ) {
      url += `?take=${take}&skip=${skip}`;
    }

    const result: AxiosResponse<{
      count: number;
      ticketCategories: Category[];
    }> = await this.wrapper.handle(axios.get(url));

    return result.data;
  }

  public async add(dto: CreateCategoryDto): Promise<Category> {
    const result: AxiosResponse<Category> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/categories`, dto)
    );
    return result.data;
  }

  public async update(
    dto: CreateCategoryDto,
    categoryId: string
  ): Promise<Category> {
    const result: AxiosResponse<Category> = await this.wrapper.handle(
      axios.patch(`${this.BASE_URL}/categories/${categoryId}`, dto)
    );
    return result.data;
  }

  public async delete(categoryId: string): Promise<Category> {
    const result: AxiosResponse<Category> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/categories/${categoryId}`)
    );
    return result.data;
  }
}
