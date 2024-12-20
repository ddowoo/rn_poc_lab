import React from 'react';
import {Dimensions, View} from 'react-native';
import {Canvas, Circle, Path, Skia} from '@shopify/react-native-skia';

const {width, height} = Dimensions.get('window');
const centerX = width / 2;
const centerY = height / 2;
const size = width - 32;
const strokeWidth = 50;
const radius = (size - strokeWidth) / 2;

const GestureArcSlider = () => {
  const lineList = new Array(60).fill('').map((_, idx) => idx + 1);

  // 1/4 원 경로 생성
  const path = Skia.Path.Make();
  path.moveTo(centerX, centerY); // 중심으로 이동
  path.lineTo(centerX + radius, centerY); // 오른쪽으로 선 긋기

  const angleOffset = -Math.PI / 2; // 0도 지점을 위쪽으로 이동
  const angle = angleOffset; // 시작 각도
  const angle2 = angleOffset + Math.PI / 3; // 끝 각도 (60도)

  // 선의 시작점
  const x1 = centerX + radius * Math.cos(angle);
  const y1 = centerY + radius * Math.sin(angle);

  const x2 = centerX + radius * Math.cos(angle2);
  const y2 = centerY + radius * Math.sin(angle2);

  // 중심점 → 시작점 → 호 → 끝점 → 중심점 → 닫기
  const rawPath = `M ${centerX} ${centerY} 
                 L ${x1} ${y1} 
                 A ${radius} ${radius} 0 0 1 ${x2} ${y2} 
                 Z`;
  const skiaBackgroundPath = Skia.Path.MakeFromSVGString(rawPath);

  path.close(); // 경로 닫기

  return (
    <View style={{flex: 1}}>
      <Canvas style={{flex: 1, backgroundColor: 'yellow'}}>
        <Circle
          style={'fill'}
          strokeWidth={0}
          r={radius}
          cx={width / 2}
          cy={height / 2}
        />
        <Circle
          style={'fill'}
          strokeWidth={0}
          r={radius}
          cx={width / 2}
          cy={height / 2}
        />
        <Path
          path={skiaBackgroundPath}
          strokeWidth={10}
          color={'blue'}
          style={'fill'}
        />
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
              key={`angle_${i}`}
              path={path}
              style={'stroke'}
              strokeWidth={is5 ? 4 : 1}
            />
          );
        })}
      </Canvas>
    </View>
  );
};

export default GestureArcSlider;
