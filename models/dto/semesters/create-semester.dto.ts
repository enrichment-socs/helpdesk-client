export interface CreateSemesterDto {
  type: 'Even' | 'Odd';
  startYear: number;
  endYear: number;
  isActive: boolean;
}
