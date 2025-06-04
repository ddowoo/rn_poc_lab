import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RiveScreen from './src/screens/rive';

const App = () => {
  return (
    <GestureHandlerRootView>
      {/*<Haptic />*/}
      {/*<VictoryChart />*/}
      <RiveScreen />
    </GestureHandlerRootView>
  );
};

export default App;
