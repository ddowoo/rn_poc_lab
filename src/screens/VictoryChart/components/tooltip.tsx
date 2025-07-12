import {Text, useFont} from '@shopify/react-native-skia';
import {SharedValue} from 'react-native-reanimated';

const ToolTip = ({
  x,
  y,
  value,
}: {
  x: SharedValue<number>;
  y: number;
  value: string;
}) => {
  const fontSize = 16;
  const font = useFont(
    require('../../../asset/fonts/Jersey15-Regular.ttf'),
    fontSize,
  );

  // 텍스트 크기 측정 (툴팁 위치 계산에 필요)
  const measure = font?.measureText(value);

  if (!measure) <></>;

  return (
    <>
      <Text
        x={x.value - (measure?.width ?? 0) / 2}
        y={y - 10}
        color={'green'}
        text={value}
        font={font}
      />
    </>
  );
};

export default ToolTip;
