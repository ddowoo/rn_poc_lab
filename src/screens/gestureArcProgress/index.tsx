import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {Canvas, Circle, Path, Skia, SkPath} from '@shopify/react-native-skia';
import {runOnJS, useSharedValue, withTiming} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {polar2Canvas} from 'react-native-redash';

const {width, height} = Dimensions.get('window');
const centerX = width / 2;
const centerY = height / 2;
const size = width - 32;
const strokeWidth = 50;
const radius = (size - strokeWidth) / 2;

const toCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
) => {
  const adjustedAngle = angle - Math.PI / 2; // 기준 각도 -90도 보정
  const x = centerX + radius * Math.cos(adjustedAngle);
  const y = centerY + radius * Math.sin(adjustedAngle);
  return {x, y};
};

const start = toCartesian(centerX, centerY, radius, 0);

const COLOR_MAIN = '#00A862';
let timeOut = null;

const initialPath = Skia.Path.MakeFromSVGString(
  `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 1 1 ${start.x} ${start.y} Z`,
)!;

const GestureArcSlider = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isOnCountDown, setIsOnCountDown] = useState(false);

  const lineList = new Array(60).fill('').map((_, idx) => idx + 1);

  // 1/4 원 경로 생성
  const path = Skia.Path.Make();
  path.moveTo(centerX, centerY); // 중심으로 이동
  path.lineTo(centerX, centerY + radius); // 오른쪽으로 선 긋기

  const angle = 0; // 시작 각도
  let _min = minutes === 0 ? 59.9999 : minutes;
  const angle2 = ((Math.PI * 2) / 60) * _min;
  const angleBySeconds = ((Math.PI * 2) / 60 / 60) * seconds;

  useEffect(() => {
    if (isOnCountDown) {
      setSeconds(minutes * 60);
    }
  }, [isOnCountDown]);

  useEffect(() => {
    if (seconds > 0 && isOnCountDown) {
      setTimeout(() => {
        setSeconds(it => it - 1);
      }, 1000);
    }
  }, [seconds]);

  const toCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angle: number,
  ) => {
    const adjustedAngle = angle - Math.PI / 2; // 기준 각도 -90도 보정
    const x = centerX + radius * Math.cos(adjustedAngle);
    const y = centerY + radius * Math.sin(adjustedAngle);
    return {x, y};
  };

  const start = toCartesian(centerX, centerY, radius, angle);
  const end = toCartesian(
    centerX,
    centerY,
    radius,
    isOnCountDown ? angleBySeconds : angle2,
  );

  // 선의 시작점
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;

  const movableCx = useSharedValue(centerX);
  const movableCy = useSharedValue(centerY - radius);
  const previousPositionX = useSharedValue(centerX);
  const previousPositionY = useSharedValue(centerY - radius);
  const percentComplete = useSharedValue(0);
  const progress = useSharedValue(1);

  const angleInRadians = Math.abs(angle2 - angle);
  const largeArcFlag = angleInRadians > Math.PI ? 1 : 0;
  const sweepFlag = 1; // 시계 방향으로 그릴 경우

  const skiaBackgroundPath: SkPath = Skia.Path.MakeFromSVGString(
    `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2} Z`,
  );

  useEffect(() => {
    if (isOnCountDown) {
      progress.value = withTiming(1, {duration: minutes * 1000});
    }
  }, [isOnCountDown]);

  const gesture = Gesture.Pan()
    .enabled(!isOnCountDown)
    .onUpdate(({translationX, translationY}) => {
      const oldCanvasX = translationX + previousPositionX.value;
      const oldCanvasY = translationY + previousPositionY.value;

      const xPrime = oldCanvasX - centerX;
      const yPrime = -(oldCanvasY - centerY);
      const rawTheta = Math.atan2(yPrime, xPrime); //각도를 계산

      let newTheta = rawTheta;
      if (newTheta < 0) {
        newTheta += 2 * Math.PI; // 음수 각도를 0 ~ 2π로 변환
      }

      const percent = 1 - newTheta / (2 * Math.PI);

      percentComplete.value = percent;

      const getCurrentMinute = (percent: number) => {
        // 진행률을 기반으로 1분 단위 계산
        const minute = Math.round(percent * 60);
        return (minute + 15) % 60;
      };

      runOnJS(setMinutes)(getCurrentMinute(percent));

      const newCoords = polar2Canvas(
        {
          theta: newTheta,
          radius: radius,
        },
        {
          x: centerX,
          y: centerY,
        },
      );

      movableCx.value = newCoords.x;
      movableCy.value = newCoords.y;
    })
    .onEnd(({translationX, translationY}) => {
      const oldCanvasX = translationX + previousPositionX.value;
      const oldCanvasY = translationY + previousPositionY.value;
      const xPrime = oldCanvasX - centerX;
      const yPrime = -(oldCanvasY - centerY);
      const rawTheta = Math.atan2(yPrime, xPrime); //각도를 계산

      let newTheta = rawTheta;
      if (newTheta < 0) {
        newTheta += 2 * Math.PI; // 음수 각도를 0 ~ 2π로 변환
      }

      const percent = 1 - newTheta / (2 * Math.PI);

      percentComplete.value = percent;

      const getCurrentMinute = (percent: number) => {
        // 진행률을 기반으로 1분 단위 계산
        const minute = Math.round(percent * 60);
        return (minute + 15) % 60;
      };
      const toCartesian = (
        centerX: number,
        centerY: number,
        radius: number,
        angle: number,
      ) => {
        const adjustedAngle = angle - Math.PI / 2; // 기준 각도 -90도 보정
        const x = centerX + radius * Math.cos(adjustedAngle);
        const y = centerY + radius * Math.sin(adjustedAngle);
        return {x, y};
      };

      const min = getCurrentMinute(percent);

      previousPositionX.value = movableCx.value;
      previousPositionY.value = movableCy.value;
      const target = toCartesian(
        centerX,
        centerY,
        radius,
        ((Math.PI * 2) / 60) * min,
      );
      movableCx.value = target.x;
      movableCy.value = target.y;
    });

  const onPressStart = () => {
    setIsOnCountDown(it => !it);
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <View style={{flex: 1}}>
          <Canvas style={{flex: 1}}>
            <Circle
              color={'transparent '}
              style={'fill'}
              strokeWidth={0}
              r={radius}
              cx={width / 2}
              cy={height / 2}
            />
            <Path
              path={skiaBackgroundPath}
              strokeWidth={10}
              color={COLOR_MAIN}
              style={'fill'}
            />

            <Circle
              cx={movableCx}
              cy={movableCy}
              r={20}
              color="orange"
              style="fill"
            />

            {/* 시계 분침 */}
            {lineList.map(i => {
              const path = Skia.Path.Make();
              const angle = i * 6 * (Math.PI / 180); // 각도를 라디안으로 변환

              // 선의 시작점
              const x1 = centerX + radius * Math.cos(angle);
              const y1 = centerY + radius * Math.sin(angle);

              // 선의 끝점 (안쪽으로 들어감)
              const x2 = centerX + (radius + 10) * Math.cos(angle);
              const y2 = centerY + (radius + 10) * Math.sin(angle);

              const is5 = (i * 6) % 30 === 0;

              // 선 추가
              path.moveTo(x1, y1);
              path.lineTo(x2, y2);
              return (
                <Path
                  color={'#00A862'}
                  key={`angle_${i}`}
                  path={path}
                  style={'stroke'}
                  strokeWidth={is5 ? 4 : 1}
                />
              );
            })}
          </Canvas>
          <TouchableOpacity onPress={onPressStart}>
            <Text>{isOnCountDown ? '멈춤' : '시작'}</Text>
          </TouchableOpacity>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default GestureArcSlider;
