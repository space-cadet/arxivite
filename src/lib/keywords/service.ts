import researchFields from '@/data/research-fields.json';

export interface ResearchField {
  id: string;
  label: string;
  related?: string[];
  subtopics?: string[];
}

export interface ResearchFieldCategory {
  [key: string]: {
    label: string;
    related?: string[];
    subtopics?: string[];
  };
}

export interface KeywordValidationResult {
  isValid: boolean;
  suggestions?: string[];
  message?: string;
}

class KeywordService {
  private static instance: KeywordService;
  private keywords: Set<string> = new Set();
  private keywordToId: Map<string, string> = new Map();
  private relatedFields: Map<string, string[]> = new Map();
  private initialized = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): KeywordService {
    if (!KeywordService.instance) {
      KeywordService.instance = new KeywordService();
    }
    return KeywordService.instance;
  }

  private initialize() {
    if (this.initialized) return;

    // Process the research fields data
    Object.entries(researchFields).forEach(([category, fields]) => {
      Object.entries(fields as ResearchFieldCategory).forEach(([id, field]) => {
        // Add main field
        this.keywords.add(field.label);
        this.keywordToId.set(field.label.toLowerCase(), id);
        
        // Add related fields to mapping
        if (field.related) {
          this.relatedFields.set(id, field.related);
        }
        
        // Add subtopics
        field.subtopics?.forEach(subtopic => {
          const formattedSubtopic = this.formatSubtopic(subtopic);
          this.keywords.add(formattedSubtopic);
          this.keywordToId.set(formattedSubtopic.toLowerCase(), `${id}_${subtopic}`);
        });
      });
    });

    this.initialized = true;
  }

  private formatSubtopic(subtopic: string): string {
    return subtopic
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getSuggestions(partial: string): Promise<string[]> {
    const searchTerm = partial.trim().toLowerCase();
    
    if (!searchTerm) {
      return Array.from(this.keywords).slice(0, 10);
    }

    // First try exact matches
    const exactMatches = Array.from(this.keywords)
      .filter(keyword => keyword.toLowerCase().includes(searchTerm));

    // Then try fuzzy matches
    const fuzzyMatches = Array.from(this.keywords)
      .filter(keyword => {
        if (exactMatches.includes(keyword)) return false;
        
        const words = keyword.toLowerCase().split(' ');
        return words.some(word => word.includes(searchTerm)) ||
               this.calculateLevenshteinDistance(keyword.toLowerCase(), searchTerm) <= 2;
      });

    // If we found an exact match, also include related fields
    const relatedMatches: string[] = [];
    exactMatches.forEach(match => {
      const id = this.keywordToId.get(match.toLowerCase());
      if (id) {
        const related = this.relatedFields.get(id);
        if (related) {
          related.forEach(relatedId => {
            const relatedField = this.findFieldById(relatedId);
            if (relatedField) {
              relatedMatches.push(relatedField.label);
            }
          });
        }
      }
    });

    // Combine all matches and remove duplicates
    return [...new Set([...exactMatches, ...relatedMatches, ...fuzzyMatches])]
      .slice(0, 10);
  }

  private findFieldById(id: string): { label: string } | null {
    for (const category of Object.values(researchFields)) {
      const field = (category as ResearchFieldCategory)[id];
      if (field) {
        return field;
      }
    }
    return null;
  }

  async validateKeyword(keyword: string): Promise<KeywordValidationResult> {
    const searchTerm = keyword.trim();
    
    if (this.keywords.has(searchTerm)) {
      return { isValid: true };
    }

    const suggestions = await this.getSuggestions(searchTerm);
    
    return {
      isValid: false,
      suggestions,
      message: suggestions.length > 0 
        ? 'Did you mean one of these research fields?' 
        : 'Please select a valid research field'
    };
  }

  private calculateLevenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[b.length][a.length];
  }

  getRelatedFields(keyword: string): string[] {
    const id = this.keywordToId.get(keyword.toLowerCase());
    if (!id) return [];

    const related = this.relatedFields.get(id) || [];
    return related
      .map(relatedId => this.findFieldById(relatedId)?.label)
      .filter((label): label is string => !!label);
  }
}

export const keywordService = KeywordService.getInstance();