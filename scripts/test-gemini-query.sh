#!/bin/bash

# Simple test script for Gemini API query parsing
# Usage: ./test-gemini-query.sh "quantum machine learning Bengio 2023"

# Get API key from environment variable or use the one from .env
API_KEY="${GEMINI_API_KEY:-$(grep VITE_GEMINI_API_KEY .env | cut -d '=' -f2)}"

# Use provided search query or default
SEARCH_QUERY="${1:-quantum machine learning Bengio 2023}"

# LLM Prompt (as defined in queryParser.ts)
PROMPT="Given this arXiv search query, classify each meaningful term or phrase into these categories:
- AUTHOR: Names of researchers/authors
- TOPIC: Scientific concepts, theories, or research areas
- YEAR: Publication years
- INSTITUTION: Universities or research institutions
- JOURNAL: Journal or conference names

Query: \"$SEARCH_QUERY\"

Output format (JSON):
{
    \"authors\": [\"name1\", \"name2\"],
    \"topics\": [\"topic1\", \"topic2\"],
    \"years\": [\"year1\", \"year2\"],
    \"institutions\": [\"inst1\", \"inst2\"],
    \"journals\": [\"journal1\", \"journal2\"]
}

Only include categories that appear in the query. Return JSON only."

echo "Testing Gemini API with query: \"$SEARCH_QUERY\""
echo "Using API key: ${API_KEY:0:8}..." 
echo

# Execute curl request
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\": [
      {
        \"role\": \"user\",
        \"parts\": [{
          \"text\": \"$PROMPT\"
        }]
      }
    ],
    \"generationConfig\": {
      \"temperature\": 0.2,
      \"topP\": 0.8,
      \"topK\": 40,
      \"maxOutputTokens\": 1024,
      \"responseMimeType\": \"application/json\"
    }
  }" | jq '.candidates[0].content.parts[0].text' -r | jq .

# Show how this would convert to arXiv query format
echo -e "\nWould convert to arXiv query format:"
echo "(Simulated conversion - the actual conversion would be done by convertToArxivFormat)"
