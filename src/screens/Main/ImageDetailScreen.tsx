import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library/legacy';

import { MainStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<
  MainStackParamList,
  'ImageDetails'
>;

export default function ImageDetailScreen({
  route,
}: Props) {
  const { image } = route.params;

  const [fullScreen, setFullScreen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const permission =
        await MediaLibrary.requestPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow photo permission to save the image.'
        );
        return;
      }

      const destination = new File(
        Paths.cache,
        `fotoowl-${image.id}-${Date.now()}.jpg`
      );

      const downloadedFile =
        await File.downloadFileAsync(
          image.download_url,
          destination
        );

      await MediaLibrary.saveToLibraryAsync(
        downloadedFile.uri
      );

      Alert.alert(
        'Success',
        'Image saved to your device gallery.'
      );
    } catch (error) {
      console.error('Download error:', error);

      Alert.alert(
        'Download Failed',
        'Unable to save this image.'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image.download_url }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.details}>
        <Text style={styles.author}>
          {image.author}
        </Text>

        <Text style={styles.info}>
          Image ID: {image.id}
        </Text>

        <Text style={styles.info}>
          Original Size: {image.width} × {image.height}
        </Text>

        <Pressable
          style={styles.fullButton}
          onPress={() => setFullScreen(true)}
        >
          <Text style={styles.buttonText}>
            View Full Screen
          </Text>
        </Pressable>

        <Pressable
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={downloading}
        >
          <Text style={styles.buttonText}>
            {downloading
              ? 'Downloading...'
              : 'Download Image'}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={fullScreen}
        animationType="fade"
        onRequestClose={() => setFullScreen(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setFullScreen(false)}
          >
            <Text style={styles.closeText}>X</Text>
          </Pressable>

          <Image
            source={{ uri: image.download_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />

          <Pressable
            style={styles.modalDownloadButton}
            onPress={handleDownload}
            disabled={downloading}
          >
            <Text style={styles.modalDownloadText}>
              {downloading
                ? 'Downloading...'
                : 'Download'}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  image: {
    width: '100%',
    height: 400,
    backgroundColor: '#000000',
  },

  details: {
    padding: 20,
  },

  author: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  info: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },

  fullButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  downloadButton: {
    backgroundColor: '#111111',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },

  fullImage: {
    width: '100%',
    height: '80%',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeText: {
    color: '#000000',
    fontSize: 22,
    fontWeight: 'bold',
  },

  modalDownloadButton: {
    backgroundColor: '#ffffff',
    marginHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalDownloadText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: 'bold',
  },
});