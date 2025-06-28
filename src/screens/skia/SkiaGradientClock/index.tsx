import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Canvas, Rect, SweepGradient, vec} from '@shopify/react-native-skia';
import {useEffect} from 'react';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');

const SkiaGradientClock = () => {
  const cx = width / 2;
  const cy = height / 2;

  const rotation = useSharedValue(0);

  // 무한 회전 애니메이션 설정
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(2, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, []);

  // 회전값을 라디안 단위로 변환
  const animatedRotation = useDerivedValue(() => {
    return [{rotate: Math.PI * rotation.value}];
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Rect width={width} height={height} x={0} y={0}>
          <SweepGradient
            c={vec(cx, cy)}
            origin={vec(cx, cy)}
            colors={['black', 'white']}
            start={0}
            end={360}
            transform={animatedRotation}
          />
        </Rect>
      </Canvas>
      <Text style={styles.day}>DAY</Text>
      <Text style={styles.night}>NIGHT</Text>
    </View>
  );
};

export default SkiaGradientClock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: 400,
  },
  day: {
    fontSize: 80,
    color: '#fff',
    fontWeight: '100',
    top: 80,
    textAlign: 'center',
    position: 'absolute',
  },
  night: {
    fontSize: 80,
    color: '#000',
    fontWeight: '100',
    bottom: 80,
    textAlign: 'center',
    position: 'absolute',
  },
});
