// src/config/arxiv-categories.ts
export interface ArxivCategory {
  id: string;
  name: string;
  description: string;
}

export const ARXIV_CATEGORIES: ArxivCategory[] = [
  { 
    id: 'cs.AI', 
    name: 'Artificial Intelligence', 
    description: 'Covers all areas of AI except Vision, Robotics, Machine Learning, Multiagent Systems, and Computation and Language'
  },
  { 
    id: 'cs.CL', 
    name: 'Computation and Language',
    description: 'Natural language processing, computational linguistics, speech'
  },
  { 
    id: 'cs.CV', 
    name: 'Computer Vision',
    description: 'Image processing, computer vision, pattern recognition'
  },
  { 
    id: 'cs.LG', 
    name: 'Machine Learning',
    description: 'Machine learning and statistical methods'
  },
  { 
    id: 'cs.NE', 
    name: 'Neural and Evolutionary Computing',
    description: 'Neural networks, evolutionary computing, genetic algorithms'
  },
  { 
    id: 'stat.ML', 
    name: 'Machine Learning (Statistics)',
    description: 'Machine learning topics in statistics'
  },
  // Add more categories as needed
];

export const getCategoryById = (id: string): ArxivCategory | undefined => {
  return ARXIV_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryName = (id: string): string => {
  return getCategoryById(id)?.name || id;
};

export const validateCategory = (id: string): boolean => {
  return ARXIV_CATEGORIES.some(cat => cat.id === id);
};