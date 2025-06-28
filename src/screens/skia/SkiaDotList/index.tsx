import {SafeAreaView, useWindowDimensions, View} from 'react-native';
import {Canvas, Circle} from '@shopify/react-native-skia';
import {
  interpolateColor,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useMemo} from 'react';

// 점 하나
const SkiaDot = ({
  cx,
  cy,
  touchX,
  touchY,
}: {
  cx: number;
  cy: number;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
}) => {
  const radius = useSharedValue(10);

  // 거리 계산 후 반응형 radius 변경
  useDerivedValue(() => {
    const dx = cx - touchX.value;
    const dy = cy - touchY.value;
    const distance = Math.hypot(dx, dy);

    radius.value = withTiming(distance < 50 ? 15 : 8, {duration: 200});
  }, [touchX, touchY]);

  // 반응형 컬러: radius에 따라 색 변화
  const color = useDerivedValue(() => {
    return interpolateColor(radius.value, [8, 15], ['black', 'red']);
  });

  return <Circle r={radius} cx={cx} cy={cy} color={color} />;
};

// 전체 점 리스트
const SkiaDotList = () => {
  const {width, height} = useWindowDimensions();

  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);

  // 점 위치 행렬 계산
  const dotList = useMemo(() => {
    const xCount = Math.floor(width / 30);
    const yCount = Math.floor(height / 30);

    return Array.from({length: yCount}, (_, y) =>
      Array.from({length: xCount}, (_, x) => ({
        x: (x + 1) * 30,
        y: y * 30 + 80,
      })),
    );
  }, [width, height]);

  // 제스처로 touch 좌표 갱신
  const pan = Gesture.Pan()
    .onChange(e => {
      touchX.value = e.x;
      touchY.value = e.y;
    })
    .onEnd(() => {
      touchX.value = -200;
      touchY.value = -200;
    });

  return (
    <SafeAreaView style={{flex: 1}}>
      <GestureHandlerRootView>
        <GestureDetector gesture={pan}>
          <View style={{flex: 1}}>
            <Canvas style={{flex: 1}}>
              {dotList.map(row =>
                row.map(({x, y}) => (
                  <SkiaDot
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    touchX={touchX}
                    touchY={touchY}
                  />
                )),
              )}
            </Canvas>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default SkiaDotList;
