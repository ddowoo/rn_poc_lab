import {Dimensions, Text, View} from 'react-native';
import {useState} from 'react';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {MOUNTAIN_GRID} from './constants/mountain.ts';

const {width} = Dimensions.get('window');

const BOX_WIDTH = width / MOUNTAIN_GRID[0].length;
const EMPTY_COLOR_GRID = MOUNTAIN_GRID.map(boxList =>
  boxList.map(() => 'gray'),
);

const GestureGrid = () => {
  const [nowGrid, setNowGrid] = useState(EMPTY_COLOR_GRID);
  const [nowColor, setNowColor] = useState<null | string>(null);

  const [colorCounts, setColorCounts] = useState<Record<string, number>>({
    red: 3,
    blue: 3,
    orange: 3,
  });

  const sharedValues: Record<string, {value: {x: number; y: number}}> = {
    red: useSharedValue({x: 0, y: 0}),
    blue: useSharedValue({x: 0, y: 0}),
    orange: useSharedValue({x: 0, y: 0}),
  };

  const animatedStyles: Record<string, any> = {
    red: useAnimatedStyle(() => ({
      transform: [
        {translateX: sharedValues.red.value.x},
        {translateY: sharedValues.red.value.y},
      ],
    })),
    blue: useAnimatedStyle(() => ({
      transform: [
        {translateX: sharedValues.blue.value.x},
        {translateY: sharedValues.blue.value.y},
      ],
    })),
    orange: useAnimatedStyle(() => ({
      transform: [
        {translateX: sharedValues.orange.value.x},
        {translateY: sharedValues.orange.value.y},
      ],
    })),
  };

  const blocks = [
    {color: 'red', count: colorCounts.red},
    {color: 'blue', count: colorCounts.blue},
    {color: 'orange', count: colorCounts.orange},
  ];

  const pan = Gesture.Pan()
    .onUpdate(event => {
      if (nowColor) {
        sharedValues[nowColor].value = {
          x: event.translationX,
          y: event.translationY,
        };
      }
    })
    .onEnd(event => {
      const indexX = Math.floor(event.x / BOX_WIDTH);
      const indexY = Math.floor((event.y - 100) / BOX_WIDTH);

      if (nowColor && colorCounts[nowColor] > 0) {
        const newNowGrid = [...nowGrid];
        const newColorCounts = {...colorCounts};

        if (
          indexX >= 0 &&
          indexX < MOUNTAIN_GRID[0].length &&
          indexY >= 0 &&
          indexY < MOUNTAIN_GRID.length &&
          MOUNTAIN_GRID[indexY][indexX]
        ) {
          newNowGrid[indexY][indexX] = nowColor;
          newColorCounts[nowColor] -= 1;

          runOnJS(setNowGrid)(newNowGrid);
          runOnJS(setColorCounts)(newColorCounts);
          sharedValues[nowColor].value = {x: 0, y: 0};
        } else {
          sharedValues[nowColor].value = withSpring({x: 0, y: 0});
          runOnJS(setNowColor)(null);
        }
      }
    });

  const handleTouchStart = (color: string) => {
    if (colorCounts[color] > 0) {
      setNowColor(color);
    }
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pan}>
        <View style={{flex: 1}}>
          <View style={{paddingTop: 100}}>
            {MOUNTAIN_GRID.map((boxList, rowIndex) => (
              <View key={`row-${rowIndex}`} style={{flexDirection: 'row'}}>
                {boxList.map((isBox, colIndex) => (
                  <>
                    <View
                      key={`col-${rowIndex}-${colIndex}`}
                      style={{
                        width: BOX_WIDTH,
                        height: BOX_WIDTH,
                        borderWidth: isBox ? 0.1 : 0,
                        backgroundColor: isBox
                          ? nowGrid[rowIndex][colIndex]
                          : 'transprent',
                      }}
                    />
                  </>
                ))}
              </View>
            ))}
          </View>
          <View style={{flexDirection: 'row'}}>
            {blocks.map(({color, count}) => (
              <View
                style={{
                  width: BOX_WIDTH,
                  height: BOX_WIDTH,
                }}>
                <Animated.View
                  key={color}
                  onTouchStart={() => handleTouchStart(color)}
                  style={[
                    {
                      width: BOX_WIDTH,
                      height: BOX_WIDTH,
                      backgroundColor: color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: count === 0 ? 0.4 : 1,
                    },
                    animatedStyles[color],
                  ]}>
                  <Text style={{color: '#fff'}}>{count}</Text>
                </Animated.View>
                <View
                  style={[
                    {
                      width: BOX_WIDTH,
                      height: BOX_WIDTH,
                      backgroundColor: color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      zIndex: -1,
                      opacity: count === 0 ? 0 : 1,
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default GestureGrid;
