import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import CutMovie from '../screens/CutMovie';
import NeonSignLogo from '../screens/skia/NeonSignLogo';
import SkiaGradientClock from '../screens/skia/SkiaGradientClock';
import SkiaDotList from '../screens/skia/SkiaDotList';
import SkiaCard from '../screens/skia/SkiaCard';
import SkiaTimer from '../screens/skia/SkiaTimer';
import SkiaShader from '../screens/skia/SkiaShader';
import ScrollViewWebView from '../screens/ScrollViewWebView';
import RiveScreen from '../screens/rive';
import Haptic from '../screens/haptic';
import GestureGrid from '../screens/gestureGrid';
import VictoryChart from '../screens/victoryChart';
import GestureArcProgress from '../screens/gestureArcProgress';
import AsmpMix from '../screens/asmpMix';

const Stack = createStackNavigator();

export const POC_SCREENS = [
  {name: 'CutMovie', component: CutMovie},
  {name: 'NeonSignLogo', component: NeonSignLogo},
  {name: 'SkiaGradientClock', component: SkiaGradientClock},
  {name: 'SkiaDotList', component: SkiaDotList},
  {name: 'SkiaCard', component: SkiaCard},
  {name: 'SkiaTimer', component: SkiaTimer},
  {name: 'SkiaShader', component: SkiaShader},
  {name: 'ScrollViewWebView', component: ScrollViewWebView},
  {name: 'RiveScreen', component: RiveScreen},
  {name: 'Haptic', component: Haptic},
  {name: 'GestureGrid', component: GestureGrid},
  {name: 'VictoryChart', component: VictoryChart},
  {name: 'GestureArcProgress', component: GestureArcProgress},
  {name: 'AsmpMix', component: AsmpMix},
];

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName={'CutMovie'}
    screenOptions={{headerShown: false}}>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{title: 'POC 목록'}}
    />
    {POC_SCREENS.map(screen => (
      <Stack.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
      />
    ))}
  </Stack.Navigator>
);

export default AppNavigator;
