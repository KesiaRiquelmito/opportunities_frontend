export interface Opportunity {
  id: number;
  code: string;
  title: string;
  type: string;
  is_followed: boolean;
  publish_date: string;
  close_date: string;
}