const API_BASE = 'http://localhost:8000/api';

export const analyzeMessage = async (text: string) => {
  const response = await fetch(`${API_BASE}/analyze/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!response.ok) throw new Error('API Error');
  return response.json();
};

export const analyzeUpi = async (data: any) => {
  const response = await fetch(`${API_BASE}/analyze/upi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('API Error');
  return response.json();
};

export const getResult = async (id: string) => {
  const response = await fetch(`${API_BASE}/results/${id}`);
  if (!response.ok) throw new Error('Result not found');
  return response.json();
};

export const analyzeImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/analyze/image`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API Error');
  }
  return response.json();
};
