import Video from 'react-native-video';
import {ScrollView, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useState} from 'react';
import {OnLoadData} from 'react-native-video/src/types/events.ts';

type VideoPiece = {
  start: number;
  end: number;
};

const LENGTH_OF_VIDEO_PIECE = 100; // 1 second

const CutMovie = () => {
  const {width} = useWindowDimensions();
  const [durationList, setDurationList] = useState<VideoPiece[]>([]);
  const videoSource = require('./assets/bigBUnny.mp4');
  const {top} = useSafeAreaInsets();

  const onLoad = (e: OnLoadData) => {
    setDurationList([{start: 0, end: e.duration}]);
  };

  return (
    <View style={{flex: 1, marginTop: top}}>
      <Video
        controls={true}
        source={videoSource}
        onLoad={onLoad}
        style={{width: '100%', aspectRatio: 16 / 9, backgroundColor: 'red'}}
        onProgress={event => {
          // console.log('event', event);
        }}
      />
      <View style={{height: 50, width: '100%'}}>
        <ScrollView
          horizontal={true}
          onScroll={event => {
            console.log(event.nativeEvent.contentOffset.x);
          }}
          style={{paddingLeft: width / 2, paddingRight: width / 2}}>
          {durationList.map(durationPiece => {
            const length = durationPiece.end - durationPiece.start;
            const secondList = new Array(Math.floor(length)).fill('');
            console.log('secondslIt :', secondList.length);
            return (
              <View
                key={durationPiece.end}
                style={{
                  height: 50,
                  width: length * LENGTH_OF_VIDEO_PIECE,
                  flexDirection: 'row',
                }}>
                {secondList.map(() => {
                  return (
                    <View
                      style={{
                        width: LENGTH_OF_VIDEO_PIECE,
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        borderWidth: 1,
                      }}>
                      <Text></Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            width: 1,
            height: '100%',
            backgroundColor: 'red',
            position: 'absolute',
            alignSelf: 'center',
          }}
        />
      </View>
    </View>
  );
};

export default CutMovie;
