import api from './api.js';

// Read the backend response envelope and verify the shared AI result shape.
async function postAiRequest(path, payload) {
  const response = await api.post(path, payload);
  const { data } = response.data;
  if (typeof data?.text !== 'string') {
    throw new Error('AI service response must include a text field.');
  }
  if (data.sources !== undefined && !Array.isArray(data.sources)) {
    throw new Error('AI service sources must be an array when provided.');
  }
  return {
    text: data.text,
    sources: (data.sources || []).map((source) => ({
      ...source,
      url: source.url || source.uri,
    })),
  };
}

// Request counselor help without sending provider keys or a client-authored system prompt.
export default function askAiService(prompt, useSearch = false) {
  return postAiRequest('/api/ai/ask', { prompt, useSearch });
}

// Request career comparisons through their dedicated server prompt and usage category.
export function compareWithAi(careerA, careerB) {
  return postAiRequest('/api/ai/compare', { careerA, careerB });
}

// Ask the backend to select and generate a specific study-kit format.
export function generateStudyKit(topic, type) {
  return postAiRequest('/api/ai/study-kit', { topic, type });
}
