import { PicsumImage } from '../types/gallery';

const BASE_URL = 'https://picsum.photos/v2/list';

export const fetchPicsumImages = async (
  page: number,
  limit: number = 20
): Promise<PicsumImage[]> => {
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  const data: PicsumImage[] = await response.json();

  return data;
};