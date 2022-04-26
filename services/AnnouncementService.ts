import axios, { AxiosResponse } from 'axios';
import { Announcement } from '../models/Announcement';
import { CreateAnnouncementDto } from '../models/dto/announcements/create-announcement.dto';
import { BaseService } from './BaseService';

export class AnnouncementsService extends BaseService {
  static async get(id: string) {
    try {
      const res: AxiosResponse<Announcement> = await axios.get(
        `${this.BASE_URL}/announcements/${id}`,
      );

      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting specified announcement from server');
    }
  }

  static async getAll(token: string) {
    try {
      const res: AxiosResponse<Announcement[]> = await axios.get(
        `${this.BASE_URL}/announcements`,
        this.headersWithToken(token),
      );

      return res.data;
    } catch (e) {
      console.error(e);
      throw new Error('Failed when getting announcements from server');
    }
  }

  static async getBySemester(semesterId: string, token: string) {
    try {
      const res: AxiosResponse<Announcement[]> = await axios.get(
        `${this.BASE_URL}/announcements?semesterId=${semesterId}`,
        this.headersWithToken(token),
      );

      return res.data;
    } catch (e) {
      throw new Error('Failed when getting announcements from server');
    }
  }

  static async addAnnouncement(dto: CreateAnnouncementDto, token: string) {
    try {
      const result: AxiosResponse<Announcement> = await axios.post(
        `${this.BASE_URL}/announcements`,
        dto,
        this.headersWithToken(token),
      );

      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Add Announcement)');
    }
  }

  static async updateAnnouncement(
    dto: CreateAnnouncementDto,
    announcementId: string,
    token: string,
  ) {
    try {
      const result: AxiosResponse<Announcement> = await axios.patch(
        `${this.BASE_URL}/announcements/${announcementId}`,
        dto,
        this.headersWithToken(token),
      );

      return result.data;
    } catch (e) {
      console.log(e);
      throw new Error('Ups, somehting is wrong with the server (Update Announcement)');
    }
  }

  static async deleteAnnouncement(announcementId: string, token: string) {
    try {
      const result: AxiosResponse<Announcement> = await axios.delete(
        `${this.BASE_URL}/announcements/${announcementId}`,
        this.headersWithToken(token),
      );

      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong with the server (Delete Announcement)');
    }
  }
}
