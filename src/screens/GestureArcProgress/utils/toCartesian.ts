export const toCartesian = (
  radius: number,
  angle: number,
  centerX: number,
  centerY: number,
) => {
  'worklet'; // UIThread에서 실행 가능

  const adjustedAngle = angle - Math.PI / 2; // 기준 각도 -90도 보정
  const x = centerX + radius * Math.cos(adjustedAngle);
  const y = centerY + radius * Math.sin(adjustedAngle);
  return {x, y};
};
