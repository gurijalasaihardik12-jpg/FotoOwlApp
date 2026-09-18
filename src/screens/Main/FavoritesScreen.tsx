import React, { useMemo, useState } from 'react';
import {
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

import { useGalleryStore } from '../../store/useGalleryStore';
import { PicsumImage } from '../../types/gallery';
import { MainStackParamList } from '../../types/navigation';

type FavoritesNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

export default function FavoritesScreen() {
  const navigation =
    useNavigation<FavoritesNavigationProp>();

  const favorites = useGalleryStore(
    (state) => state.favorites
  );

  const removeFavorite = useGalleryStore(
    (state) => state.removeFavorite
  );

  const [search, setSearch] = useState('');

  const filteredFavorites = useMemo(() => {
    return favorites.filter((image) =>
      image.author
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [favorites, search]);

  const renderItem = ({
    item,
  }: {
    item: PicsumImage;
  }) => {
    return (
      <View style={styles.card}>
        {/* TAP IMAGE TO OPEN DETAILS */}
        <Pressable
          onPress={() =>
            navigation.navigate(
              'ImageDetails',
              {
                image: item,
              }
            )
          }
        >
          <Image
            source={{ uri: item.download_url }}
            style={styles.image}
          />
        </Pressable>

        <View style={styles.info}>
          {/* TAP AUTHOR/ID TO OPEN DETAILS */}
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

          {/* REMOVE FAVORITE */}
          <Pressable
            onPress={() =>
              removeFavorite(item.id)
            }
          >
            <Text style={styles.heart}>
              ♥
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Favorites
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Search favorites..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No favorite images yet.
          </Text>
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
    fontSize: 26,
    fontWeight: 'bold',
    margin: 16,
  },

  search: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    fontSize: 16,
  },

  list: {
    padding: 12,
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },

  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#dddddd',
  },

  info: {
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
    marginTop: 4,
    color: '#666666',
  },

  heart: {
    fontSize: 30,
    paddingHorizontal: 8,
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666666',
    fontSize: 16,
  },
});