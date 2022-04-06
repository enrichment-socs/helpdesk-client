import axios, { AxiosResponse } from "axios";
import { Category } from "../models/Category";
import { CreateCategoryDto } from "../models/dto/categories/create-category-dto";
import { BaseService } from "./BaseService";

export class CategoriesService extends BaseService {
    public static async getAll(): Promise<Category[]> {
        try {
            const result: AxiosResponse<Category[]> = await axios.get(
                `${this.BASE_URL}/categories`,
            );
            return result.data;
        } catch (e) {
            console.error(e);
            throw new Error('Failed when getting categories from server');
        }
    }

    static async add(dto: CreateCategoryDto): Promise<Category> {
        try {
            const result: AxiosResponse<Category> = await axios.post(
                `${this.BASE_URL}/categories`,
                dto,
            );
            return result.data;
        } catch (e) {
            console.error(e);
            throw new Error('Ups, something is wrong with the server (Add Category)');
        }
    }

    static async update(dto: CreateCategoryDto, categoryId: string): Promise<Category> {
        try {
            const result: AxiosResponse<Category> = await axios.patch(
                `${this.BASE_URL}/categories/${categoryId}`,
                dto,
            )
            return result.data;
        } catch (e) {
            console.log(e);
            throw new Error('Ups, something is wrong with the server (Update Category)');
        }
    }

    static async delete(categoryId: string): Promise<Category> {
        try {
            const result: AxiosResponse<Category> = await axios.delete(
                `${this.BASE_URL}/categories/${categoryId}`,
            );
            return result.data;
        } catch (e) {
            console.error(e);
            throw new Error(
                'Ups, something is wrong with the server (Delete Category)',
            );
        }
    }
}