
import {Text, View} from 'react-native';
import {Area, Bar, CartesianChart, Line, Scatter} from 'victory-native';
import {
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from '@shopify/react-native-skia';

// x축에 사용할 요일 리스트
const dayList = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// 데이터 포인트 (y 값은 pointList에서 가져오며, 부족한 값은 0으로 설정)
const pointList = [6, 6, 10, 8];
const DATA = [0, 1, 2, 3, 4, 5, 6].map((day, index) => ({
  day,
  value: pointList[index] ?? 0, // 값이 없으면 0으로 설정
}));

const VictoryChart = () => {
  const fontSize = 12;

  // 커스텀 폰트 로드
  const font = useFont(
    require('../../asset/fonts/Jersey15-Regular.ttf'),
    fontSize,
  );

  return (
    <View
      style={{
        backgroundColor: 'lightGray',
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 25,
      }}>
      {/* Line Chart Section */}
      <Text>1. 선 그래프</Text>
      <View
        style={{
          backgroundColor: '#fff',
          height: 250,
        }}>
        <CartesianChart
          data={DATA}
          xKey="day" // x축 데이터 키
          yKeys={['value']} // y축 데이터 키
          domain={{y: [-5, 20]}} // 전체 y축 범위
          viewport={{y: [0, 20]}} // 화면에 보이는 y축 범위
          padding={16}
          domainPadding={{left: 10, right: 10, top: 10, bottom: 10}}
          xAxis={{
            font,
            tickCount: 7,
            formatXLabel: label => dayList[label], // 요일 표시
            lineWidth: 0, // x축 선 제거
          }}
          yAxis={[
            {
              yKeys: ['value'],
              font,
              formatYLabel: label => label + (label === 0 ? ' m' : ''), // y축 레이블 포맷팅
              linePathEffect: <DashPathEffect intervals={[3, 2]} />, // y축 대시 효과
            },
          ]}>
          {({points, chartBounds}) => {
            // y값이 0이 아닌 데이터만 필터링
            const updateData = points.value.filter(data => data.yValue !== 0);

            return (
              <>
                {/* 점선 그래프 */}
                <Line
                  connectMissingData={false}
                  points={points.value}
                  color="green"

                  strokeWidth={2}>
                  <DashPathEffect intervals={[2, 3]} />
                </Line>
                {/* 실선 그래프 */}
                <Line
                  connectMissingData={false}
                  points={updateData}
                  color="#00A862"
                  strokeWidth={2}
                />
                {/* 점 추가 */}
                <Scatter
                  points={updateData}
                  strokeWidth={1}
                  shape="circle"
                  radius={5}
                  style="fill"
                  color="#00A862"
                />
                {/* 점 내부 흰색 채우기 */}
                <Scatter
                  points={updateData}
                  strokeWidth={2}
                  shape="circle"
                  radius={3}
                  style="fill"
                  color="white"
                />
                {/* Area 그래프 */}
                <Area
                  points={points.value}
                  y0={chartBounds.bottom} // 하단 기준선
                  animate={{type: 'timing', duration: 500}}>
                  <LinearGradient
                    start={vec(chartBounds.bottom, 120)} // 시작점
                    end={vec(chartBounds.bottom, chartBounds.bottom)} // 끝점
                    colors={['#00A8621A', '#00A86200']} // 투명도 있는 그라디언트
                  />
                </Area>
              </>
            );
          }}
        </CartesianChart>
      </View>

      {/* Bar Chart Section */}
      <Text style={{marginTop: 20, marginBottom: 10}}>2. 막대그래프</Text>
      <View
        style={{
          backgroundColor: '#fff',
          height: 250,
        }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={['value']}
          padding={16}
          domainPadding={{left: 30, right: 30, top: 10, bottom: 10}}
          xAxis={{
            font,
            tickCount: 7,
            formatXLabel: label => dayList[label], // 요일 표시
            lineWidth: 0, // x축 선 제거
          }}
          yAxis={[
            {
              yKeys: ['value'],
              font,
              linePathEffect: <DashPathEffect intervals={[3, 2]} />, // y축 대시 효과
            },
          ]}>
          {({points, chartBounds}) => {
            // Bar 그래프의 빈 값 처리
            const emptyValueData = points.value.map(data => ({
              ...data,
              y: data.yValue === 0 ? 185 : 197, // y값 조정
            }));

            return (
              <>
                {/* 빈 Bar */}
                <Bar
                  points={emptyValueData}
                  color={'lightGray'}
                  chartBounds={chartBounds}
                  roundedCorners={{topLeft: 10, topRight: 10}}
                />
                {/* 실 데이터 Bar */}
                <Bar
                  points={points.value}
                  chartBounds={chartBounds}
                  roundedCorners={{topLeft: 10, topRight: 10}}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(0, 200)} // 세로 그라디언트
                    colors={['#00A862', '#00A86260']}
                  />
                </Bar>
              </>
            );
          }}
        </CartesianChart>
      </View>
    </View>
  );
};

export default VictoryChart;
