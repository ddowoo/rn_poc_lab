import {Blur, Canvas, Path, Skia} from '@shopify/react-native-skia';
import {Text, TouchableOpacity, View} from 'react-native';
import {runOnJS, useSharedValue, withRepeat, withSequence, withTiming} from 'react-native-reanimated';
import React, {useEffect, useState} from 'react';

const HEART_SIZE = 300;


const heartPathData = `
  M 45 84.334 
  L 6.802 46.136 
  C 2.416 41.75 0 35.918 0 29.716 
  c 0 -6.203 2.416 -12.034 6.802 -16.42 
  c 4.386 -4.386 10.217 -6.802 16.42 -6.802 
  c 6.203 0 12.034 2.416 16.42 6.802 
  L 45 18.654 
  l 5.358 -5.358 
  c 4.386 -4.386 10.218 -6.802 16.42 -6.802 
  c 6.203 0 12.034 2.416 16.42 6.802 
  l 0 0 l 0 0 
  C 87.585 17.682 90 23.513 90 29.716 
  c 0 6.203 -2.415 12.034 -6.802 16.42 
  L 45 84.334 
  z 
  M 23.222 10.494 
  c -5.134 0 -9.961 2 -13.592 5.63 
  S 4 24.582 4 29.716 
  s 2 9.961 5.63 13.592 
  L 45 78.678 
  l 35.37 -35.37 
  C 84.001 39.677 86 34.85 86 29.716 
  s -1.999 -9.961 -5.63 -13.592 
  l 0 0 
  c -3.631 -3.63 -8.457 -5.63 -13.592 -5.63 
  c -5.134 0 -9.961 2 -13.592 5.63 
  L 45 24.311 
  l -8.187 -8.187 
  C 33.183 12.494 28.356 10.494 23.222 10.494 
  z
`.replace(/\s+/g, ' ').trim();

const path = Skia.Path.MakeFromSVGString(heartPathData);

const HeartNeonSign = () => {

  const end = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [switchOn, setSwtichOn] = useState(false);

  const turnOnNeonSign = () => {
    opacity.value = 1;
    end.value = 0;
    end.value = withTiming(1, {
      duration: 3000,
    }, () => {

      runOnJS(blingNeonSign)();
    });
  };

  const turnOffNeonSign = () => {
    opacity.value = withTiming(0, {duration: 300}, () => {
      end.value = 0;
    });

  };

  const blingNeonSign = () => {
    setTimeout(() => {
      opacity.value = 0;

      // 1~2초간 빠르게 깜빡이다가
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, {duration: 200}),
          withTiming(1, {duration: 100}),
        ),
        3, // 총 6번 깜빡임
        true,
        () => {
          // 깜빡임 종료 후 네온 ON
          opacity.value = withTiming(1, {duration: 300});
        },
      );
    }, 300);

  };

  useEffect(() => {
    if (switchOn) {
      turnOnNeonSign();
    } else {
      turnOffNeonSign();
    }

  }, [switchOn]);


  const onPress = () => {
    setSwtichOn(!switchOn);
  };


  if (path === null) return <></>;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity style={{position: 'absolute', right: 10, top: 80, zIndex: 10}}
                        onPress={onPress}>
        <Text style={{color: '#fff'}}>스위치 {switchOn ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
      <Canvas
        style={{
          width: '100%',
          height: '90%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}>

        {/* 꺼져 있을때 표현 gray */}
        <Path
          path={path}
          transform={[{scale: 3.5}, {translateX: 20}, {translateY: 100}]}
          color="gray"
          style="stroke"
          strokeWidth={2}

        />

        {/* 그림자 효과 blue */}
        <Path
          path={path}
          style={'stroke'}
          color={'blue'}
          transform={[{scale: 3.5}, {translateX: 20}, {translateY: 100}]}
          strokeWidth={8}
          opacity={opacity}
          start={0}
          end={end}>
          <Blur blur={30} />
        </Path>

        {/* pink 반짝이는 효과 blur로 표현 */}
        <Path
          path={path}
          style={'stroke'}
          color={'hotpink'}
          transform={[{scale: 3.5}, {translateX: 20}, {translateY: 100}]}
          strokeWidth={8}
          start={0}
          opacity={opacity}

          end={end}>
          <Blur blur={3} />
        </Path>

        {/* pink 중심 선 */}
        <Path
          path={path}
          transform={[{scale: 3.5}, {translateX: 20}, {translateY: 100}]}
          color="hotpink"
          style="stroke"
          strokeWidth={3}
          start={0}
          opacity={opacity}

          end={end}
        />


      </Canvas>
    </View>
  );


};

export default HeartNeonSign;

