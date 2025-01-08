// 진행률 기반 새 좌표 계산 함수
import {toCartesian} from './toCartesian.ts';

export const calculateNewCoords = (
  percent: number,
  radius: number,
  centerX: number,
  centerY: number,
) => {
  'worklet';
  const min = (Math.round(percent * 60) + 15) % 60;
  const angle = ((Math.PI * 2) / 60) * min;
  return toCartesian(radius, angle, centerX, centerY);
};
