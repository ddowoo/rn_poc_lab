import {View} from 'react-native';
import {Area, CartesianChart, Line, Scatter} from 'victory-native';
import {LinearGradient, vec} from '@shopify/react-native-skia';

// const DATA = Array.from({length: 31}, (_, i) => ({
//   day: i,
//   highTmp: 40 + 30 * Math.random(),
// }));

const DATA = ['', '월', '화', '수', '목', '금', '토', '일', ''].map(day => {
  return {day, value: Math.random()};
});

const VictoryChart = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'yellow'}}>
      <View
        style={{
          marginHorizontal: 16,
          backgroundColor: '#fff',
          height: 261,
        }}>
        <CartesianChart data={DATA} xKey="day" yKeys={['value']} padding={16}>
          {({points, chartBounds}) => {
            return (
              // 👇 and we'll use the Line component to render a line path.
              <>
                <Area
                  points={points.value}
                  y0={chartBounds.bottom}
                  animate={{type: 'timing', duration: 500}}>
                  <LinearGradient
                    start={vec(chartBounds.bottom, 230)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                    colors={['#00A8621A', 'red', 'yellow', 'blue', '#00A86200']}
                  />
                </Area>
                <Line
                  connectMissingData={false}
                  points={points.value}
                  color="green"
                  strokeWidth={3}
                />

                <Scatter
                  points={points.value}
                  strokeWidth={2}
                  shape="circle"
                  radius={5}
                  style="fill"
                  color="green"
                />
                <Scatter
                  points={points.value}
                  strokeWidth={2}
                  shape="circle"
                  radius={3}
                  style="fill"
                  color="white"
                />
              </>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
};

export default VictoryChart;
