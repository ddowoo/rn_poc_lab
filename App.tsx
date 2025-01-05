import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SkiaCard from './src/screens/skia/SkiaCard';

const App = () => {
  return (
    <GestureHandlerRootView>
      <SkiaCard />
    </GestureHandlerRootView>
  );
};

export default App;
