import {Platform, TurboModule, TurboModuleRegistry} from 'react-native';

export type Thumbnail = {
  uri: string;
  timeMs: number;
};

export interface Spec extends TurboModule {
  getThumbnailList(): Promise<Thumbnail[]>;
}

export default Platform.OS === 'android'
  ? TurboModuleRegistry.getEnforcing<Spec>('NativeVideoControl')
  : {
      getThumbnailList: async () => {
        return [];
      },
    };
