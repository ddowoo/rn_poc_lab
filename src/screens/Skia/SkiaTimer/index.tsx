import {Dimensions, StyleSheet, View} from 'react-native';
import {Canvas, Circle, Path, Skia} from '@shopify/react-native-skia';
import {useMemo} from 'react';
import {useSharedValue} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');
const POMODORO_CANVAS_WIDTH = width;
const POMODORO_CANVAS_HEIGHT = height;

const SkiaTimer = () => {
  const centerX = POMODORO_CANVAS_WIDTH / 2; // 원 중심 x좌표
  const centerY = POMODORO_CANVAS_HEIGHT / 2; // 원 중심 y좌표
  const size = POMODORO_CANVAS_WIDTH - 32; // 시계가 차지할 영역
  const radius = size / 2;

  const timeHandlerOpacity = useSharedValue(1);
  const movableCx = useSharedValue(centerX);
  const movableCy = useSharedValue(centerY - radius);
  const percentComplete = useSharedValue(0);
  const previousPositionX = useSharedValue(centerX);
  const previousPositionY = useSharedValue(centerY - radius);

  // tick 위치는 고정값 다시 계산할 필요 없음
  const tickMarks = useMemo(
    () =>
      new Array(60).fill(null).map((_, idx) => {
        const angle = idx * 6 * (Math.PI / 180); // 각도를 라디안으로 변환
        const isMajorTick = (idx * 6) % 30 === 0;
        return {
          x1: centerX + (radius - (isMajorTick ? 6 : 4)) * Math.cos(angle),
          y1: centerY + (radius - (isMajorTick ? 6 : 4)) * Math.sin(angle),
          x2: centerX + (radius + (isMajorTick ? 9 : 7)) * Math.cos(angle),
          y2: centerY + (radius + (isMajorTick ? 9 : 7)) * Math.sin(angle),
          isMajorTick,
        };
      }),
    [],
  );

  // 제스쳐
  // const gesture = Gesture.Pan()
  //   .enabled(!isRunning)
  //   .onUpdate(({translationX, translationY}) => {
  //     const {theta, percent} = calculateThetaAndPercent(
  //       previousPositionX.value,
  //       previousPositionY.value,
  //       translationX,
  //       translationY,
  //       centerX,
  //       centerY,
  //     );
  //     percentComplete.value = percent;
  //     runOnJS(setMinutes)((Math.round(percent * 60) + 15) % 60);
  //
  //     const newCoords = polar2Canvas({theta, radius}, {x: centerX, y: centerY});
  //     movableCx.value = newCoords.x;
  //     movableCy.value = newCoords.y;
  //   })
  //   .onEnd(({translationX, translationY}) => {
  //     const {percent} = calculateThetaAndPercent(
  //       previousPositionX.value,
  //       previousPositionY.value,
  //       translationX,
  //       translationY,
  //       centerX,
  //       centerY,
  //     );
  //     percentComplete.value = percent;
  //
  //     const newMinutes = (Math.round(percent * 60) + 15) % 60;
  //     runOnJS(setMinutes)(newMinutes);
  //     runOnJS(setSeconds)(newMinutes * 60);
  //
  //     const target = calculateNewCoords(percent, radius, centerX, centerY);
  //     previousPositionX.value = target.x;
  //     previousPositionY.value = target.y;
  //     movableCx.value = target.x;
  //     movableCy.value = target.y;
  //   });

  return (
    // <GestureDetector gesture={gesture}>
    <View style={styles.canvasContainer}>
      {/* 캔버스 */}
      <Canvas style={styles.canvas}>
        {/* 안쪽 원 */}

        <Circle
          cx={movableCx}
          cy={movableCy}
          r={20}
          opacity={timeHandlerOpacity}
          color={'green'}
          style="fill"
        />
        <Circle
          cx={movableCx}
          cy={movableCy}
          opacity={timeHandlerOpacity}
          r={15}
          color={'#fff'}
          style="fill"
        />
        {/* 틱 마크 - 시계 선 */}
        {tickMarks.map(({x1, y1, x2, y2, isMajorTick}) => {
          return (
            <Path
              color={'#000'}
              path={Skia.Path.Make().moveTo(x1, y1).lineTo(x2, y2)}
              strokeWidth={isMajorTick ? 3 : 1}
              style="stroke"
            />
          );
        })}
      </Canvas>
    </View>
    // </GestureDetector>
  );
};

export default SkiaTimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  timerText: {
    fontSize: 36,
    marginBottom: 20,
  },
  canvasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: POMODORO_CANVAS_WIDTH,
    height: POMODORO_CANVAS_HEIGHT,
  },
  startButton: {
    width: 150,
    borderWidth: 2,
    borderRadius: 8,
    height: 40,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
});
