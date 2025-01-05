import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia'; // Skia의 그래픽 컴포넌트들
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native'; // 화면 크기 정보 가져오기
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'; // Reanimated를 활용한 애니메이션

const {width, height} = Dimensions.get('screen');

const CARD_WIDTH = 300;
const CARD_HEIGHT = 400;

const CENTER_X = width / 2;
const CENTER_Y = height / 2;

const CARD_X = CENTER_X - CARD_WIDTH / 2;
const CARD_Y = CENTER_Y - CARD_HEIGHT / 2;

const SkiaCard = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(2, {
        // 0에서 2로 애니메이션 (2 * Math.PI = 360도)
        // 나이 30에 호도법이라니!!
        duration: 4000,
        easing: Easing.linear,
      }),
      -1, // 무한 반복
    );
  }, []);

  const animatedRotation = useDerivedValue(() => {
    return [{rotate: Math.PI * rotation.value}]; // 회전값을 라디안으로 변환
  }, [rotation]);

  return (
    <Canvas style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* 둥근 모서리를 가진 사각형 (카드) */}
      <RoundedRect
        r={20}
        x={CARD_X}
        y={CARD_Y}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}>
        {/* SweepGradient로 중심에서 방사형 색상 변화 */}
        <SweepGradient
          origin={vec(CENTER_X, CENTER_Y)} // 회전 기준점
          c={vec(CENTER_X, CENTER_Y)} // 색상 중심점
          transform={animatedRotation} // 애니메이션 회전 적용
          colors={['cyan', 'magenta', 'yellow', 'cyan']} // 그라디언트 색상 배열
        />
        {/* BlurMask로 카드에 블러 효과 적용 */}
        <BlurMask blur={20} style={'solid'} />
      </RoundedRect>
    </Canvas>
  );
};

export default SkiaCard;
