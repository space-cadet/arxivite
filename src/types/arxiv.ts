export interface ArxivPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  publishedDate: Date;
  updatedDate: Date;
  doi?: string;
  links: {
    abstract: string;
    pdf: string;
  };
  comments?: string;
  journalRef?: string;
}

export interface ArxivSearchParams {
  query: string;
  maxResults?: number;
}

export interface ArxivSearchResponse {
  papers: ArxivPaper[];
  total: number;
}
