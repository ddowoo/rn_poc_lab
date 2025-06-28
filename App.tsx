import {View} from 'react-native';
import SkiaDotList from './src/screens/skia/SkiaDotList';

const App = () => {
  // return (
  //   <View
  //     style={{
  //       flex: 1,
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //     }}>
  //     <Text>기본 테스트</Text>
  //   </View>
  // );

  return (
    <View style={{flex: 1}}>
      {/*<GestureHandlerRootView>*/}
      {/*<Haptic />*/}
      {/*<VictoryChart />*/}
      {/*<RiveScreen />*/}
      {/*<ScrollViewWebView />*/}
      {/*<SkiaTimer />*/}
      {/*</GestureHandlerRootView>*/}
      {/*<SkiaGradientClock />*/}
      <SkiaDotList />
    </View>
  );
};

export default App;
