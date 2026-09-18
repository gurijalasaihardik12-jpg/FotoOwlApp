import { PicsumImage } from './gallery';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;

  ImageDetails: {
    image: PicsumImage;
  };
};