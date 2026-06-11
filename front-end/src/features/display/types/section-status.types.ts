// Response
export interface SectionStatusResponse {
  message: string;
  data: {
    indoor: number;
    outdoor: number;
    bar: number;
    vip: number;
  };
}
