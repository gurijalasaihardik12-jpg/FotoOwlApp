import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useFetchImages } from '../../hooks/useFetchImages';
import { useGalleryStore } from '../../store/useGalleryStore';

import { PicsumImage } from '../../types/gallery';
import { MainStackParamList } from '../../types/navigation';

type HomeNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export default function HomeScreen() {
  const navigation =
    useNavigation<HomeNavigationProp>();

  const {
    images,
    loading,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
  } = useFetchImages();

  const favorites = useGalleryStore(
    (state) => state.favorites
  );

  const toggleFavorite = useGalleryStore(
    (state) => state.toggleFavorite
  );

  const [search, setSearch] = useState('');

  const [filter, setFilter] =
    useState<'ALL' | 'A-M' | 'N-Z'>('ALL');

  const [sort, setSort] =
    useState<'DEFAULT' | 'AZ' | 'ZA'>('DEFAULT');

  const filteredImages = useMemo(() => {
    let result = images.filter((image) =>
      image.author
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (filter === 'A-M') {
      result = result.filter((image) => {
        const first =
          image.author
            .trim()
            .charAt(0)
            .toUpperCase();

        return first >= 'A' && first <= 'M';
      });
    }

    if (filter === 'N-Z') {
      result = result.filter((image) => {
        const first =
          image.author
            .trim()
            .charAt(0)
            .toUpperCase();

        return first >= 'N' && first <= 'Z';
      });
    }

    if (sort === 'AZ') {
      result = [...result].sort((a, b) =>
        a.author.localeCompare(b.author)
      );
    }

    if (sort === 'ZA') {
      result = [...result].sort((a, b) =>
        b.author.localeCompare(a.author)
      );
    }

    return result;
  }, [images, search, filter, sort]);

  const renderImage = ({
    item,
  }: {
    item: PicsumImage;
  }) => {
    const favorite = favorites.some(
      (fav) => fav.id === item.id
    );

    return (
      <View style={styles.card}>
        {/* TAP IMAGE TO OPEN DETAILS */}
        <Pressable
          onPress={() => {
            console.log(
              'Opening Image Details:',
              item.id
            );

            navigation.navigate(
              'ImageDetails',
              {
                image: item,
              }
            );
          }}
        >
          <Image
            source={{ uri: item.download_url }}
            style={styles.image}
          />
        </Pressable>

        <View style={styles.infoContainer}>
          {/* AUTHOR AREA ALSO OPENS DETAILS */}
          <Pressable
            style={styles.detailsArea}
            onPress={() =>
              navigation.navigate(
                'ImageDetails',
                {
                  image: item,
                }
              )
            }
          >
            <Text style={styles.author}>
              {item.author}
            </Text>

            <Text style={styles.id}>
              Image ID: {item.id}
            </Text>
          </Pressable>

          {/* FAVORITE BUTTON */}
          <Pressable
            onPress={() =>
              toggleFavorite(item)
            }
          >
            <Text style={styles.heart}>
              {favorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (loading && images.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading images...
        </Text>
      </View>
    );
  }

  if (error && images.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={refresh}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        FotoOwl Gallery
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by author..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'ALL' &&
              styles.activeButton,
          ]}
          onPress={() => setFilter('ALL')}
        >
          <Text>All</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filter === 'A-M' &&
              styles.activeButton,
          ]}
          onPress={() => setFilter('A-M')}
        >
          <Text>A-M</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            filter === 'N-Z' &&
              styles.activeButton,
          ]}
          onPress={() => setFilter('N-Z')}
        >
          <Text>N-Z</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Pressable
          style={[
            styles.filterButton,
            sort === 'DEFAULT' &&
              styles.activeButton,
          ]}
          onPress={() =>
            setSort('DEFAULT')
          }
        >
          <Text>Default</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            sort === 'AZ' &&
              styles.activeButton,
          ]}
          onPress={() => setSort('AZ')}
        >
          <Text>A-Z</Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterButton,
            sort === 'ZA' &&
              styles.activeButton,
          ]}
          onPress={() => setSort('ZA')}
        >
          <Text>Z-A</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id}
        renderItem={renderImage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No images found.
          </Text>
        }
        ListFooterComponent={
          hasMore && images.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },

  filterRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 10,
    gap: 8,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  activeButton: {
    backgroundColor: '#dddddd',
  },

  list: {
    padding: 12,
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: 230,
    backgroundColor: '#dddddd',
  },

  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },

  detailsArea: {
    flex: 1,
  },

  author: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  id: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },

  heart: {
    fontSize: 30,
    paddingHorizontal: 8,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
  },

  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666666',
  },

  footerLoader: {
    marginVertical: 20,
  },
});