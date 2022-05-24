import axios, { AxiosResponse } from 'axios';
import { Announcement } from '../models/Announcement';
import { CreateAnnouncementDto } from '../models/dto/announcements/create-announcement.dto';
import { BaseService } from './BaseService';

export class AnnouncementService extends BaseService {
  public async get(id: string) {
    const res: AxiosResponse<Announcement> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/announcements/${id}`)
    );

    return res.data;
  }

  public async getAll() {
    const res: AxiosResponse<Announcement[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/announcements`, this.headersWithToken())
    );

    return res.data;
  }

  public async getBySemester(semesterId: string) {
    const res: AxiosResponse<Announcement[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/announcements?semesterId=${semesterId}`,
        this.headersWithToken()
      )
    );

    return res.data;
  }

  public async addAnnouncement(dto: CreateAnnouncementDto) {
    const result: AxiosResponse<Announcement> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/announcements`, dto, this.headersWithToken())
    );

    return result.data;
  }

  public async updateAnnouncement(
    dto: CreateAnnouncementDto,
    announcementId: string
  ) {
    const result: AxiosResponse<Announcement> = await this.wrapper.handle(
      axios.patch(
        `${this.BASE_URL}/announcements/${announcementId}`,
        dto,
        this.headersWithToken()
      )
    );

    return result.data;
  }

  public async deleteAnnouncement(announcementId: string) {
    const result: AxiosResponse<Announcement> = await this.wrapper.handle(
      axios.delete(
        `${this.BASE_URL}/announcements/${announcementId}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }
}
