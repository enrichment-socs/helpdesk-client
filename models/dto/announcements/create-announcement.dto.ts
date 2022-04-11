export interface CreateAnnouncementDto {
  title: string;
  body: string;
  startDate: Date;
  endDate: Date;
  semesterId: string;
}
