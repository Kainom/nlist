export interface Anime {
  _id: string;
  title: string;
  description: string;
  rating: number;
  episodes: number;
  status: string;
  imageUrl: string;
}

export interface AnimePaginated {
  data: Anime[];
  total: number;
  page: number;
  limit: number;
}