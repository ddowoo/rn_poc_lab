import React, {useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {Canvas, Circle, Path, Skia} from '@shopify/react-native-skia';
import {runOnJS, useSharedValue, withTiming} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {polar2Canvas} from 'react-native-redash';
import {calculateNewCoords} from './utils/calculateNewCoords.ts';
import {calculateThetaAndPercent} from './utils/calculateThetaAndPercent.ts';
import {toCartesian} from './utils/toCartesian.ts';

const {width, height} = Dimensions.get('window');
const centerX = width / 2;
const centerY = height / 2;
const size = width - 32;
const strokeWidth = 50;
const radius = (size - strokeWidth) / 2;

const COLOR_MAIN = '#00A862';

const GestureArcSlider = () => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isOnCountDown, setIsOnCountDown] = useState(false);

  const tickMarks = new Array(60).fill('').map((_, idx) => idx + 1);

  // 1/4 원 경로 생성
  const clockPath = Skia.Path.Make();
  clockPath.moveTo(centerX, centerY);
  clockPath.lineTo(centerX, centerY + radius);

  const initialAngle = 0; // 시작 각도
  let adjMin = minutes === 0 ? 59.9999 : minutes;
  const angleByMinutes = ((Math.PI * 2) / 60) * adjMin;
  const angleBySeconds = ((Math.PI * 2) / 60 / 60) * seconds;

  const start = toCartesian(radius, initialAngle, centerX, centerY);
  const end = toCartesian(
    radius,
    isOnCountDown ? angleBySeconds : angleByMinutes,
    centerX,
    centerY,
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

  const angleInRadians = Math.abs(angleByMinutes);
  const largeArcFlag = angleInRadians > Math.PI ? 1 : 0;
  const sweepFlag = 1; // 시계 방향으로 그릴 경우

  const skiaBackgroundPath = Skia.Path.MakeFromSVGString(
    `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2} Z`,
  );

  const gesture = Gesture.Pan()
    .enabled(!isOnCountDown)
    .onUpdate(({translationX, translationY}) => {
      // 공통 로직 호출
      const {theta, percent} = calculateThetaAndPercent(
        previousPositionX.value,
        previousPositionY.value,
        translationX,
        translationY,
        centerX,
        centerY,
      );
      percentComplete.value = percent;

      // 진행률 기반 현재 분 계산 및 업데이트
      const getCurrentMinute = (percent: number) =>
        (Math.round(percent * 60) + 15) % 60;
      runOnJS(setMinutes)(getCurrentMinute(percent));

      // 새 좌표 계산 및 업데이트
      const newCoords = polar2Canvas({theta, radius}, {x: centerX, y: centerY});
      movableCx.value = newCoords.x;
      movableCy.value = newCoords.y;
    })
    .onEnd(({translationX, translationY}) => {
      // 공통 로직 호출
      const {percent} = calculateThetaAndPercent(
        previousPositionX.value,
        previousPositionY.value,
        translationX,
        translationY,
        centerX,
        centerY,
      );
      percentComplete.value = percent;

      // 새 좌표 계산 및 업데이트
      const target = calculateNewCoords(percent, radius, centerX, centerY);
      previousPositionX.value = movableCx.value;
      previousPositionY.value = movableCy.value;
      movableCx.value = target.x;
      movableCy.value = target.y;
    });

  const onPressStart = () => {
    setIsOnCountDown(it => !it);
  };

  // MARK: - effect
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

  useEffect(() => {
    if (isOnCountDown) {
      progress.value = withTiming(1, {duration: minutes * 1000});
    }
  }, [isOnCountDown]);

  if (skiaBackgroundPath === null) {
    return <></>;
  }

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
            {tickMarks.map(i => {
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
