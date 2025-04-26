export interface Paper {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  category: string;
  publishedDate: string;
  updatedDate: string;
  pdfUrl: string;
  thumbnailUrl?: string;
}