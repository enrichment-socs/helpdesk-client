import axios, { AxiosResponse } from 'axios';
import { CreateGuidelineCategoryDto } from '../models/dto/guideline-categories/create-guideline-category.dto';
import { GuidelineCategory } from '../models/GuidelineCategory';
import { BaseService } from './BaseService';

export class GuidelineCategoryService extends BaseService {
  public async get(id: string) {
    const res: AxiosResponse<GuidelineCategory> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/guideline-categories/${id}`)
    );
    return res.data;
  }

  public async getAll(take?: number, skip?: number) : Promise <{count: number; guidelineCategories: GuidelineCategory[]}> {

    let url = `${this.BASE_URL}/guideline-categories`;

    if(take !== null && take !== undefined && skip !== null && skip !== undefined)
    {
      url += `?take=${take}&skip=${skip}`;
    }

    const res: AxiosResponse<{count: number; guidelineCategories : GuidelineCategory[]}> = await this.wrapper.handle(
      axios.get(url)
    );

    return res.data;
  }

  public async addFAQCategory(dto: CreateGuidelineCategoryDto) {
    const result: AxiosResponse<GuidelineCategory> = await this.wrapper.handle(
      axios.post(
        `${this.BASE_URL}/guideline-categories`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async updateFAQCategory(
    dto: CreateGuidelineCategoryDto,
    categoryId: string
  ) {
    const result: AxiosResponse<GuidelineCategory> = await this.wrapper.handle(
      axios.patch(
        `${this.BASE_URL}/guideline-categories/${categoryId}`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async deleteFAQCategory(categoryId: string) {
    const result: AxiosResponse<GuidelineCategory> = await this.wrapper.handle(
      axios.delete(
        `${this.BASE_URL}/guideline-categories/${categoryId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
