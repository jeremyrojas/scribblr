export interface Post {
  id?: string;
  title: string;
  content: string;
  status: string;
  photo_url: string | null;
  author_id?: string;
  published_at?: string | null;
}