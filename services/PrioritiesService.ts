import axios, { AxiosResponse } from "axios";
import { CreatePriorityDto } from "../models/dto/priority/create-prioritiy.dto";
import { Priority } from "../models/Priority";
import { BaseService } from "./BaseService";

export class PrioritiesService extends BaseService {
    public static async getAll(): Promise<Priority[]> {
        try {
            const result: AxiosResponse<Priority[]> = await axios.get(
                `${this.BASE_URL}/priority`,
            );
            return result.data;
        } catch (e) {
            console.error(e);
            throw new Error('Failed when getting priority from server');
        }
    }

    static async add(dto: CreatePriorityDto): Promise<Priority> {
        try {
            const result: AxiosResponse<Priority> = await axios.post(
                `${this.BASE_URL}/priority`,
                dto,
            );
            return result.data;
        } catch (e) {
            console.error(e);
            throw new Error('Ups, something is wrong with the server (Add Category)');
        }
    }

    static async update(dto: CreatePriorityDto, id: string): Promise<Priority> {
        try {
            const result: AxiosResponse<Priority> = await axios.put(
                `${this.BASE_URL}/priority/${id}`,
                dto,
            )
            return result.data;
        } catch (e) {
            console.log(e);
            throw new Error('Ups, something is wrong with the server (Update Category)');
        }
    }

    static async delete(id: string): Promise<Priority> {
        try {
            const result: AxiosResponse<Priority> = await axios.delete(
                `${this.BASE_URL}/priority/${id}`,
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