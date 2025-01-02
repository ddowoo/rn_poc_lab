import VictoryChart from './src/screens/victoryChart';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView>
      <VictoryChart />
    </GestureHandlerRootView>
  );
};

export default App;
