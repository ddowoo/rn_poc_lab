import {GestureHandlerRootView} from 'react-native-gesture-handler';
import VictoryChart from './src/screens/victoryChart';

const App = () => {
  return (
    <GestureHandlerRootView>
      <VictoryChart />
    </GestureHandlerRootView>
  );
};

export default App;
