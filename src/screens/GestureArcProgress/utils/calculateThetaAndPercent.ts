// 중심점 기준 각도와 진행률 계산 함수
export const calculateThetaAndPercent = (
  previousPositionX: number,
  previousPositionY: number,
  translationX: number,
  translationY: number,
  centerX: number,
  centerY: number,
) => {
  'worklet';
  // 현재 캔버스 좌표 계산
  const oldCanvasX = translationX + previousPositionX;
  const oldCanvasY = translationY + previousPositionY;

  // 중심점 기준 변환
  const xPrime = oldCanvasX - centerX;
  const yPrime = -(oldCanvasY - centerY);

  // 각도 계산 (0 ~ 2π 범위로 조정)
  let theta = Math.atan2(yPrime, xPrime);
  if (theta < 0) theta += 2 * Math.PI;

  // 진행률 계산
  const percent = 1 - theta / (2 * Math.PI);

  return {theta, percent};
};
