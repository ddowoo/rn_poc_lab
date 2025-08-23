import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from '../screens/MainScreen';
import CutMovie from '../screens/CutMovie';
import NeonSignLogo from '../screens/Skia/NeonSignLogo';
import SkiaGradientClock from '../screens/Skia/SkiaGradientClock';
import SkiaDotList from '../screens/Skia/SkiaDotList';
import SkiaCard from '../screens/Skia/SkiaCard';
import ScrollViewWebView from '../screens/ScrollViewWebView';
import RiveScreen from '../screens/Rive';
import Haptic from '../screens/Haptic';
import GestureGrid from '../screens/GestureGrid';
import VictoryChart from '../screens/VictoryChart';
import GestureArcProgress from '../screens/GestureArcProgress';
import AsmpMix from '../screens/AsmpMix';
import RnWallet from '../screens/RnWallet';
import HeartNeonSign from '../screens/Skia/HeartNeonSign';
import MemoryLeakScreen from '../screens/MemoryLeakScreen';
import LocalizeScreen from '../screens/Localize';
import GesturePlayer from "../screens/GesturePlayer";

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
    {
        name: 'SkiaHeartNeonSign',
        component: HeartNeonSign,
        label: '스키아 하트 네온사인',
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
    {name: 'RnWallet', component: RnWallet, label: 'Wallet 연동'},
    {name: 'MemoryLeak', component: MemoryLeakScreen, label: '메모리 누수 테스트'},
    {name: 'Localize', component: LocalizeScreen, label: '다국어'},
    {name: 'GesturePlayer', component: GesturePlayer, label: '제스쳐 플레이이어'},
];

const AppNavigator = () => (

    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'GesturePlayer'}>
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
