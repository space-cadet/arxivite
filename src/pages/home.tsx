import { useState, useMemo } from 'react';
import { Paper } from '@/types/paper';
import PaperTable from '@/components/papers/paper-table';
import PaperFilters from '@/components/papers/paper-filters';

// Sample data for development
const SAMPLE_PAPERS: Paper[] = [
  {
    id: '2304.12345',
    title: 'Understanding Deep Learning Through the Lens of Optimization',
    authors: ['John Doe', 'Jane Smith'],
    summary: 'This paper explores the fundamental principles of deep learning through optimization theory. We present a novel framework that unifies various deep learning architectures and training algorithms.',
    category: 'cs.LG',
    publishedDate: '2023-04-15',
    updatedDate: '2023-04-15',
    pdfUrl: 'https://arxiv.org/pdf/2304.12345.pdf'
  },
  {
    id: '2304.67890',
    title: 'Efficient Transformers: A Survey',
    authors: ['Alice Johnson', 'Bob Wilson', 'Carol Brown'],
    summary: 'We present a comprehensive survey of efficient transformer architectures, analyzing their computational requirements, performance characteristics, and real-world applications.',
    category: 'cs.CL',
    publishedDate: '2023-04-16',
    updatedDate: '2023-04-16',
    pdfUrl: 'https://arxiv.org/pdf/2304.67890.pdf'
  },
  {
    id: '2304.11111',
    title: 'Large Language Models: A Comprehensive Review',
    authors: ['Emily Chen', 'David Wang'],
    summary: 'A comprehensive review of large language models, their architectures, training methodologies, and applications in various domains.',
    category: 'cs.CL',
    publishedDate: '2023-04-14',
    updatedDate: '2023-04-14',
    pdfUrl: 'https://arxiv.org/pdf/2304.11111.pdf'
  },
];

const HomePage = () => {
  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Get unique categories from papers
  const categories = useMemo(() => {
    return Array.from(new Set(SAMPLE_PAPERS.map(paper => paper.category)));
  }, []);

  // Filter papers based on search criteria
  const filteredPapers = useMemo(() => {
    return SAMPLE_PAPERS.filter(paper => {
      const authorMatch = paper.authors.some(
        author => author.toLowerCase().includes(authorFilter.toLowerCase())
      );
      const categoryMatch = categoryFilter === 'all' || paper.category === categoryFilter;
      return authorMatch && categoryMatch;
    });
  }, [authorFilter, categoryFilter]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Latest Papers
        </h1>
      </div>
      
      <div className="flex flex-col gap-6">
        <PaperFilters
          onAuthorSearch={setAuthorFilter}
          onCategorySelect={setCategoryFilter}
          categories={categories}
        />
        <PaperTable papers={filteredPapers} />
      </div>
    </div>
  );
};

export default HomePage;