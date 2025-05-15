import { ParsedQuery } from '../lib/search/queryParser';

export interface ArxivSearchParams {
    query: string;
    maxResults?: number;
    start?: number;
    parsedQuery?: ParsedQuery;
}

export interface ArxivLink {
    abstract: string;
    pdf: string;
}

export interface ArxivPaper {
    id: string;
    title: string;
    authors: string[];
    abstract: string;
    categories: string[];
    publishedDate: Date;
    updatedDate: Date;
    links: ArxivLink;
    comments?: string;
    journalRef?: string;
}

export interface ArxivSearchResponse {
    papers: ArxivPaper[];
    total: number;
}