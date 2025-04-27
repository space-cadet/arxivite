interface Category {
  id: string;
  name: string;
  description?: string;
  mainSubject: string;
}

// ArXiv category metadata
const categories: Record<string, Category> = {
  // Computer Science
  'cs.AI': {
    id: 'cs.AI',
    name: 'Artificial Intelligence',
    description: 'Covers all areas of AI except Vision, Robotics, Machine Learning, Multiagent Systems, and Computation and Language',
    mainSubject: 'Computer Science'
  },
  'cs.CL': {
    id: 'cs.CL',
    name: 'Computation and Language',
    description: 'Natural language processing, computational linguistics, and speech',
    mainSubject: 'Computer Science'
  },
  'cs.CV': {
    id: 'cs.CV',
    name: 'Computer Vision and Pattern Recognition',
    description: 'Image processing, computer vision, pattern recognition, and scene understanding',
    mainSubject: 'Computer Science'
  },
  'cs.LG': {
    id: 'cs.LG',
    name: 'Machine Learning',
    description: 'Machine learning and statistical methods',
    mainSubject: 'Computer Science'
  },
  'cs.NE': {
    id: 'cs.NE',
    name: 'Neural and Evolutionary Computing',
    description: 'Neural networks, evolutionary algorithms, genetic algorithms, artificial life',
    mainSubject: 'Computer Science'
  },
  'cs.IR': {
    id: 'cs.IR',
    name: 'Information Retrieval',
    description: 'Search algorithms, recommendation systems, information retrieval',
    mainSubject: 'Computer Science'
  },
  'cs.RO': {
    id: 'cs.RO',
    name: 'Robotics',
    description: 'Robotics, multi-robot systems, control, and automation',
    mainSubject: 'Computer Science'
  },
  'cs.CR': {
    id: 'cs.CR',
    name: 'Cryptography and Security',
    description: 'Cryptography, security protocols, and information security',
    mainSubject: 'Computer Science'
  },

  // Physics
  'astro-ph.CO': {
    id: 'astro-ph.CO',
    name: 'Cosmology and Nongalactic Astrophysics',
    description: 'Cosmology, extragalactic astrophysics, and large-scale structure',
    mainSubject: 'Physics'
  },
  'astro-ph.GA': {
    id: 'astro-ph.GA',
    name: 'Astrophysics of Galaxies',
    description: 'Formation, structure, and evolution of galaxies',
    mainSubject: 'Physics'
  },
  'cond-mat.supr-con': {
    id: 'cond-mat.supr-con',
    name: 'Superconductivity',
    description: 'Superconducting materials and mechanisms',
    mainSubject: 'Physics'
  },
  'cond-mat.mtrl-sci': {
    id: 'cond-mat.mtrl-sci',
    name: 'Materials Science',
    description: 'Materials properties and characterization',
    mainSubject: 'Physics'
  },
  'gr-qc': {
    id: 'gr-qc',
    name: 'General Relativity and Quantum Cosmology',
    description: 'General relativity, quantum cosmology, and gravitational physics',
    mainSubject: 'Physics'
  },
  'hep-th': {
    id: 'hep-th',
    name: 'High Energy Physics - Theory',
    description: 'Theoretical aspects of high energy physics',
    mainSubject: 'Physics'
  },
  'quant-ph': {
    id: 'quant-ph',
    name: 'Quantum Physics',
    description: 'Quantum mechanics, quantum computation, and quantum information theory',
    mainSubject: 'Physics'
  },

  // Mathematics
  'math.AG': {
    id: 'math.AG',
    name: 'Algebraic Geometry',
    description: 'Algebraic varieties, stacks, sheaves, schemes, moduli spaces, complex geometry, quantum cohomology',
    mainSubject: 'Mathematics'
  },
  'math.AT': {
    id: 'math.AT',
    name: 'Algebraic Topology',
    description: 'Homotopy theory, homological algebra, algebraic treatments of manifolds',
    mainSubject: 'Mathematics'
  },
  'math.PR': {
    id: 'math.PR',
    name: 'Probability',
    description: 'Probability theory, stochastic processes, random walks',
    mainSubject: 'Mathematics'
  },
  'math.ST': {
    id: 'math.ST',
    name: 'Statistics Theory',
    description: 'Statistical theory, statistical methods, and applications',
    mainSubject: 'Mathematics'
  },
  'math.NA': {
    id: 'math.NA',
    name: 'Numerical Analysis',
    description: 'Numerical algorithms for problems in analysis and algebra, scientific computation',
    mainSubject: 'Mathematics'
  },
  'math.OC': {
    id: 'math.OC',
    name: 'Optimization and Control',
    description: 'Optimization, optimal control, and mathematical programming',
    mainSubject: 'Mathematics'
  },

  // Biology
  'q-bio.BM': {
    id: 'q-bio.BM',
    name: 'Biomolecules',
    description: 'DNA, RNA, proteins, and other biomolecules',
    mainSubject: 'Biology'
  },
  'q-bio.CB': {
    id: 'q-bio.CB',
    name: 'Cell Behavior',
    description: 'Cell motility, cell mechanics, and signal transduction',
    mainSubject: 'Biology'
  },
  'q-bio.GN': {
    id: 'q-bio.GN',
    name: 'Genomics',
    description: 'Genomic analysis and computational methods in genetics',
    mainSubject: 'Biology'
  },

  // Cross-disciplinary categories
  'stat.ML': {
    id: 'stat.ML',
    name: 'Statistics - Machine Learning',
    description: 'Statistical aspects of machine learning and artificial intelligence',
    mainSubject: 'Cross-disciplinary'
  },
  'math-ph': {
    id: 'math-ph',
    name: 'Mathematical Physics',
    description: 'Mathematical methods in physics and physical problems leading to new mathematical developments',
    mainSubject: 'Cross-disciplinary'
  },
  'physics.comp-ph': {
    id: 'physics.comp-ph',
    name: 'Computational Physics',
    description: 'Computational methods and applications in physics',
    mainSubject: 'Cross-disciplinary'
  },
  'econ.EM': {
    id: 'econ.EM',
    name: 'Econometrics',
    description: 'Econometric theory and applications',
    mainSubject: 'Economics'
  },
  'econ.TH': {
    id: 'econ.TH',
    name: 'Economic Theory',
    description: 'Theoretical economics and game theory',
    mainSubject: 'Economics'
  }
};

export function getCategoryById(id: string): Category | undefined {
  return categories[id];
}

export function getCategoryName(id: string): string {
  return categories[id]?.name || id;
}

export function getAllCategories(): Category[] {
  return Object.values(categories);
}

export function getCategoriesByMainSubject(): Record<string, Category[]> {
  return Object.values(categories).reduce((acc, category) => {
    const subject = category.mainSubject;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(category);
    return acc;
  }, {} as Record<string, Category[]>);
}

export function getMainSubjects(): string[] {
  return [...new Set(Object.values(categories).map(cat => cat.mainSubject))].sort();
}