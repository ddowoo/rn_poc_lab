import {GestureHandlerRootView} from 'react-native-gesture-handler';
import GestureGrid from './src/screens/gestureGrid';

const App = () => {
  return (
    <GestureHandlerRootView>
      <GestureGrid />
    </GestureHandlerRootView>
  );
};

export default App;
