import Video, {OnProgressData, VideoRef} from 'react-native-video';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect, useRef, useState} from 'react';
import {OnLoadData} from 'react-native-video/src/types/events.ts';
import NativeVideoControlModule, {
  Thumbnail,
} from '../../../specs/NativeVideoControlModule.ts';
import FastImage from 'react-native-fast-image';

type VideoPiece = {
  start: number;
  end: number;
};

const LENGTH_OF_VIDEO_PIECE = 100; // 1 second
const {width: screenWidth} = Dimensions.get('screen');

const CutMovie = () => {
  const {width} = useWindowDimensions();
  const [duration, setDuration] = useState(0);
  const [durationList, setDurationList] = useState<VideoPiece[]>([]);
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);

  const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([]);
  const [nowSeconds, setNowSeconds] = useState(0);
  const [nowThumbnailIndex, setNowThumbnailIndex] = useState(0);

  const videoSource = require('./assets/bigBUnny.mp4');
  const videoRef = useRef<VideoRef>(null);
  const {top} = useSafeAreaInsets();

  const [isEditing, setIsEditing] = useState(true);
  const getCurrentPieceAndOffset = (
    nowSeconds: number,
    durationList: VideoPiece[],
  ) => {
    let acc = 0;
    for (let i = 0; i < durationList.length; i++) {
      const piece = durationList[i];
      const pieceLength = piece.end - piece.start;

      if (nowSeconds >= acc && nowSeconds < acc + pieceLength) {
        return {
          pieceIndex: i,
          secondInPiece: nowSeconds - acc,
        };
      }

      acc += pieceLength;
    }

    // 끝났거나 못 찾았을 경우
    return null;
  };

  useEffect(() => {
    const result = getCurrentPieceAndOffset(nowSeconds, durationList);
    if (!result) return;

    console.log('현재 영상은 이 조각 안에 있음:', result.pieceIndex);
    console.log('그 조각 안에서 지난 시간(초):', result.secondInPiece);

    setNowThumbnailIndex(
      Math.floor(
        durationList
          .slice(0, result.pieceIndex)
          .reduce((acc, cur) => acc + (cur.end - cur.start), 0) +
          result.secondInPiece,
      ),
    );
  }, [nowSeconds]);

  useEffect(() => {
    const getThumbnailList = async () => {
      const res = await NativeVideoControlModule.getThumbnailList();
      setThumbnailList(res);
    };

    getThumbnailList();
  }, []);

  const scrollX = useRef(0);

  // 현재 스크롤 위치(초)에서 해당하는 비디오 조각 index와 offset 반환
  const getPieceIndexFromScroll = (scrollSecond: number) => {
    let acc = 0;
    for (let i = 0; i < durationList.length; i++) {
      const piece = durationList[i];
      const pieceLength = piece.end - piece.start;
      if (scrollSecond >= acc && scrollSecond < acc + pieceLength) {
        return {index: i, offset: scrollSecond - acc};
      }
      acc += pieceLength;
    }
    return null;
  };

  // 비디오 Play
  const onPressPlay = () => {
    setIsEditing(false);
    const scrollSecond = scrollX.current;
    const pieceInfo = getPieceIndexFromScroll(scrollSecond);
    if (!pieceInfo) return;
    const {index, offset} = pieceInfo;
    const target = durationList[index];
    setCurrentPieceIndex(index);
    videoRef.current?.seek(target.start + offset);
  };

  // 비디오 로드 시 duration 세팅
  const onLoad = (e: OnLoadData) => {
    setDurationList([{start: 0, end: e.duration}]);
    setDuration(e.duration);
  };

  // 초를 00:00 포맷으로 변환
  const formatSecondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };

  // 자르기
  const onPressCut = () => {
    const scrollSecond = scrollX.current;
    const pieceInfo = getPieceIndexFromScroll(scrollSecond);
    if (!pieceInfo) return;
    const {index, offset} = pieceInfo;
    const target = durationList[index];
    const cutTime = target.start + offset;
    const newPieces = [
      {start: target.start, end: cutTime},
      {start: cutTime, end: target.end},
    ];
    const updated = [
      ...durationList.slice(0, index),
      ...newPieces,
      ...durationList.slice(index + 1),
    ];
    setDurationList(updated);
  };

  // 구간 삭제
  const onPressStash = () => {
    const scrollSecond = scrollX.current;
    const pieceInfo = getPieceIndexFromScroll(scrollSecond);
    if (!pieceInfo) return;
    const {index} = pieceInfo;
    const newList = [...durationList];
    newList.splice(index, 1);
    setDurationList(newList);
  };

  // 비디오 진행 시 구간 끝나면 다음 구간으로 이동
  const onProgress = (progress: OnProgressData) => {
    const currentTime = progress.currentTime;
    const currentPiece = durationList[currentPieceIndex];
    if (!currentPiece) return;
    if (currentTime >= currentPiece.end) {
      const nextIndex = currentPieceIndex + 1;
      if (nextIndex < durationList.length) {
        const nextPiece = durationList[nextIndex];
        setCurrentPieceIndex(nextIndex);
        videoRef.current?.seek(nextPiece.start);
      } else {
        videoRef.current?.pause?.();
      }
    }
  };

  const renderThumbnail = (startSecond: number) => {
    if (!thumbnailList.length) return null;

    const startMs = startSecond * 1000;

    const closest = thumbnailList.reduce((prev, curr) =>
      Math.abs(curr.timeMs - startMs) < Math.abs(prev.timeMs - startMs)
        ? curr
        : prev,
    );

    return (
      <FastImage
        style={{
          height: 100,
          width: 100,
          position: 'absolute',
          backgroundColor: 'blue',
          borderWidth: 1,
        }}
        source={{uri: `file://${closest.uri}`}}
      />
    );
  };

  return (
    <View style={[styles.container, {marginTop: top}]}>
      <View>
        {isEditing && (
          <FastImage
            style={{
              width: screenWidth,
              aspectRatio: 16 / 9,
              backgroundColor: 'black',
              position: 'absolute',
              zIndex: 100,
            }}
            source={{uri: `file://${thumbnailList?.[nowThumbnailIndex]?.uri}`}}
          />
        )}
        <Video
          controls
          source={videoSource}
          onLoad={onLoad}
          ref={videoRef}
          style={styles.video}
          onProgress={onProgress}
        />
      </View>

      <View style={styles.timelineWrapper}>
        <ScrollView
          horizontal
          onScroll={event => {
            scrollX.current = event.nativeEvent.contentOffset.x / 100;
            setNowSeconds(Math.floor(scrollX.current));
            videoRef.current?.seek(scrollX.current);
          }}
          style={{paddingLeft: width / 2}}>
          <View style={styles.timeLabelRow}>
            {new Array(Math.floor(duration)).fill('').map((_, index) => (
              <View style={styles.timeLabel} key={formatSecondsToTime(index)}>
                <Text>{formatSecondsToTime(index)}</Text>
              </View>
            ))}
          </View>
          {durationList.map(durationPiece => {
            const length = durationPiece.end - durationPiece.start;
            const secondList = new Array(Math.ceil(length)).fill('');
            return (
              <View
                key={durationPiece.end}
                style={[styles.piece, {width: length * LENGTH_OF_VIDEO_PIECE}]}>
                {secondList.map((_, index, list) => {
                  return (
                    <View
                      style={styles.pieceColumn}
                      key={'video-piece-' + index}>
                      <View style={styles.pieceBlock}>
                        {renderThumbnail(durationPiece.start + index)}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.timelineIndicator} />
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onPressCut} style={styles.actionButton}>
          <Text style={styles.buttonText}>자르기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressStash} style={styles.actionButton}>
          <Text style={styles.buttonText}>버리기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressPlay} style={styles.actionButton}>
          <Text style={styles.buttonText}>재생</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressPlay} style={styles.actionButton}>
          <Text style={styles.buttonText}>출력</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    width: screenWidth,
    aspectRatio: 16 / 9,
  },
  timelineWrapper: {
    height: 100,
    width: '100%',
  },
  timeLabelRow: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 100,
  },
  timeLabel: {
    width: LENGTH_OF_VIDEO_PIECE,
    height: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  piece: {
    height: 80,
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pieceColumn: {
    flexDirection: 'column',
  },
  pieceBlock: {
    width: LENGTH_OF_VIDEO_PIECE,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
  },
  timelineIndicator: {
    width: 1,
    height: '100%',
    backgroundColor: 'red',
    position: 'absolute',
    alignSelf: 'center',
  },
  buttonRow: {
    height: 60,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButton: {
    height: '100%',
    width: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
  },
});

export default CutMovie;
