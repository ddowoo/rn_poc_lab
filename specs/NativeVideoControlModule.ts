import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type Thumbnail = {
  uri: string;
  timeMs: number;
};

export interface Spec extends TurboModule {
  getThumbnailList(): Promise<Thumbnail[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeVideoControl');
