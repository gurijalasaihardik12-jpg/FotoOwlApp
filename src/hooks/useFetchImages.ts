import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { fetchPicsumImages } from '../api/picsumApi';
import { PicsumImage } from '../types/gallery';

const PAGE_SIZE = 20;

export const useFetchImages = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(
    async (
      pageNumber: number,
      replace: boolean = false
    ) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setError(null);

      try {
        const data = await fetchPicsumImages(
          pageNumber,
          PAGE_SIZE
        );

        if (replace) {
          setImages(data);
        } else {
          setImages((previousImages) => {
            const combined = [
              ...previousImages,
              ...data,
            ];

            return Array.from(
              new Map(
                combined.map((image) => [
                  image.id,
                  image,
                ])
              ).values()
            );
          });
        }

        setPage(pageNumber);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        setError('Unable to load images. Please try again.');
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = () => {
    if (
      isFetchingRef.current ||
      !hasMore
    ) {
      return;
    }

    fetchPage(page + 1);
  };

  const refresh = () => {
    if (isFetchingRef.current) {
      return;
    }

    setRefreshing(true);
    fetchPage(1, true);
  };

  return {
    images,
    loading,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};