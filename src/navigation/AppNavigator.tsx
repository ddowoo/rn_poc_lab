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
  {name: 'CutMovie', component: CutMovie, label: '동영상 자르기'},
  {name: 'NeonSignLogo', component: NeonSignLogo, label: '네온사인 로고'},
  {
    name: 'SkiaGradientClock',
    component: SkiaGradientClock,
    label: '스키아 그라데이션 시계',
  },
  {name: 'SkiaDotList', component: SkiaDotList, label: '스키아 점 리스트'},
  {name: 'SkiaCard', component: SkiaCard, label: '스키아 카드'},
  {
    name: 'ScrollViewWebView',
    component: ScrollViewWebView,
    label: '스크롤뷰 웹뷰',
  },
  {name: 'RiveScreen', component: RiveScreen, label: 'Rive 애니메이션'},
  {name: 'Haptic', component: Haptic, label: '햅틱'},
  {name: 'GestureGrid', component: GestureGrid, label: '제스처 그리드'},
  {name: 'VictoryChart', component: VictoryChart, label: '차트'},
  {
    name: 'GestureArcProgress',
    component: GestureArcProgress,
    label: '아크 프로그레스',
  },
  {name: 'AsmpMix', component: AsmpMix, label: 'ASMP 믹스'},
];

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
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
