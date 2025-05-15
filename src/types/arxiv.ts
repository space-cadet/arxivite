import { ParsedQuery } from '../lib/search/queryParser';

export interface ArxivPaginationOptions {
    pageSize: 20 | 50 | 100;
    page: number;
}

export interface ArxivSortOptions {
    field: 'submittedDate' | 'lastUpdatedDate' | 'relevance';
    order: 'ascending' | 'descending';
}

export interface ArxivSearchParams {
    query: string;
    pagination?: ArxivPaginationOptions;
    parsedQuery?: ParsedQuery;
    maxResults?: number;
    sort?: ArxivSortOptions;
}

export interface ArxivSearchMetadata {
    totalResults: number;
    itemsPerPage: number;
    startIndex: number;
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
    metadata: ArxivSearchMetadata;
}