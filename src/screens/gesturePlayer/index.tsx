import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';

// MARK: - Constants
const PAN_GESTURE_THRESHOLD = 60; // 팬 제스처 최소 이동 거리 (전체 화면 전환 기준)
const VIDEO_SEEK_TIME_SECONDS = 5; // 더블 탭 시 비디오 이동 시간 (초)
const VIDEO_CONTROL_TIMEOUT_MS = 3000; // 비디오 컨트롤 자동 숨김 시간 (밀리초)
const ORIENTATION_LOCK_DELAY_MS = 300; // 화면 방향 전환 후 상태 업데이트 딜레이 (밀리초)
const ANIMATION_DURATION_MS = 100; // 제스처 종료 시 애니메이션 지속 시간 (밀리초)
const PAN_SCALE_FACTOR = 0.03; // 팬 제스처 시 스케일 변화율
const MIN_SCALE_ON_PAN = 0.75; // 팬 제스처 시 최소 스케일
const MAX_SCALE_ON_PAN = 1.25; // 팬 제스처 시 최대 스케일

const GesturePlayerScreen = () => {
    // MARK: - State & Refs
    const {width: windowWidth, height: windowHeight} = useWindowDimensions();
    const {top} = useSafeAreaInsets();
    const videoRef = useRef<VideoRef>(null);
    const videoSource = require('../../asset/video/bigBUnny.mp4')
    // Reanimated Values
    const videoY = useSharedValue(0); // 비디오 Y축 이동
    const videoX = useSharedValue(0); // 비디오 Y축 이동
    const savedVideoX = useSharedValue(0); // 줌인 중 팬 제스쳐를 위한 X축
    const savedVideoY = useSharedValue(0); //  줌인 중 팬 제스쳐를 위한 Y축
    const scale = useSharedValue(1); // 비디오 스케일
    const savedScale = useSharedValue(1); // 핀치 제스처를 위한 저장된 스케일
    const isFullScreenShared = useSharedValue(false); // 전체 화면 상태
    const windowWidthShared = useSharedValue(windowWidth); // 윈도우 너비
    const isZoomed = useSharedValue(false); // 줌인 여부

    const [isFullScreen, _setIsFullScreen] = useState(false);
    const setIsFullScreen = (value: boolean) => {
        isFullScreenShared.value = value;
        _setIsFullScreen(value);
    };
    const [isControlVisible, setIsControlVisible] = useState(false);
    const [isLongPress, setIsLongPress] = useState(false);

    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // MARK: - effects
    useEffect(() => {
        windowWidthShared.value = windowWidth;
    }, [windowWidth]);

    // MARK: - js handlers
    // 전체 화면 전환 및 방향 잠금/해제
    const handleFullScreenToggle = () => {
        Orientation.getOrientation((orientation) => {
            if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
                Orientation.lockToPortrait();
                setTimeout(() => {
                    runOnJS(setIsFullScreen)(false);
                }, ORIENTATION_LOCK_DELAY_MS);
            } else {
                Orientation.lockToLandscapeLeft();
                setTimeout(() => {
                    runOnJS(setIsFullScreen)(true);
                }, ORIENTATION_LOCK_DELAY_MS);
            }
        });
    };

    // 더블 탭 시 영상 앞뒤 5초 이동
    const handleDoubleTapSeek = async (isLeft: boolean) => {
        const currentTime = await videoRef.current?.getCurrentPosition() || 0;
        if (isLeft) {
            videoRef.current?.seek(currentTime - VIDEO_SEEK_TIME_SECONDS);
        } else {
            videoRef.current?.seek(currentTime + VIDEO_SEEK_TIME_SECONDS);
        }
    };

    // 컨트롤러 토글
    const toggleControls = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = null;
        }

        if (isControlVisible) {
            setIsControlVisible(false);
        } else {
            setIsControlVisible(true);
            controlsTimeoutRef.current = setTimeout(() => {
                setIsControlVisible(false);
                controlsTimeoutRef.current = null;
            }, VIDEO_CONTROL_TIMEOUT_MS);
        }
    };

    // MARK: - Gestures
    // 줌인아웃
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            if (e.numberOfPointers === 2) {
                scale.value = Math.max(Math.min(savedScale.value * e.scale, 8), 1);
            }
        })
        .onEnd(() => {
            // 1.4이하는 줌아웃으로 간주
            const isZoomedNow = scale.value > 1.4;
            isZoomed.value = isZoomedNow;
            if (isZoomedNow) {
                savedScale.value = scale.value;

            } else {
                scale.value = withTiming(1, {duration: ANIMATION_DURATION_MS});
                videoY.value = withTiming(0, {duration: ANIMATION_DURATION_MS});
                videoX.value = withTiming(0, {duration: ANIMATION_DURATION_MS});
            }
        });

    // 전체화면 모드
    // TODO : 핀치줌 상태에서 팬제스쳐 전환 작업 추가
    const panGesture = Gesture.Pan()
        .maxPointers(1)
        .onUpdate((e) => {


            if (isZoomed.value) {
                // 핀치 줌 상태에서 팬 제스처
                videoY.value = (e.translationY + videoY.value) / savedScale.value;
                videoX.value = (e.translationX + videoX.value) / savedScale.value;

            } else {
                if (isFullScreenShared.value) {
                    scale.value = Math.max(MIN_SCALE_ON_PAN, Math.max(1, -e.translationY * PAN_SCALE_FACTOR));
                    videoY.value = e.translationY;
                } else {
                    videoY.value = e.translationY;
                    scale.value = Math.min(MAX_SCALE_ON_PAN, Math.max(1, -e.translationY * PAN_SCALE_FACTOR));
                }
            }


        })
        .onEnd((e) => {
            if (isZoomed.value) {
                savedVideoX.value = videoX.value;
                savedVideoY.value = videoY.value;
            } else {
                if (PAN_GESTURE_THRESHOLD <= Math.abs(videoY.value)) {
                    runOnJS(handleFullScreenToggle)();
                }
                videoY.value = withTiming(0, {duration: ANIMATION_DURATION_MS});
                scale.value = withTiming(1, {duration: ANIMATION_DURATION_MS});
            }
        });

    // 롱 프레스 제스처: 비디오 속도 2배속
    const longPressGesture = Gesture.LongPress()
        .onStart(() => {
            runOnJS(setIsLongPress)(true);
        })
        .onEnd(() => {
            runOnJS(setIsLongPress)(false);
        });

    // 싱글탭 : 컨트롤러 토글
    const singleTap = Gesture.Tap()
        .maxDuration(250) // 더블 탭과 구분하기 위한 최대 탭 지속 시간
        .onStart(() => {
            runOnJS(toggleControls)();
        });

    // 더블탭 : 앞뒤 5초 이동
    const doubleTap = Gesture.Tap()
        .maxDuration(250) // 더블 탭으로 인식될 최대 시간
        .numberOfTaps(2) // 두 번 탭
        .onStart((e) => {
            const isLeftSide = windowWidthShared.value / 2 > e.absoluteX;
            runOnJS(handleDoubleTapSeek)(isLeftSide);
        });

    //
    const playerGesture =
        Gesture.Race(
            Gesture.Exclusive(doubleTap, singleTap), // 더블 탭이 싱글 탭보다 우선
            panGesture,
            longPressGesture, pinchGesture
        )

    // MARK: - Animated
    const videoContainerAnimatedStyle = useAnimatedStyle(() => {
        if (isFullScreenShared.value) {
            return {
                width: withTiming(windowHeight / 9 * 16, {duration: ANIMATION_DURATION_MS}),
                height: withTiming(windowHeight, {duration: ANIMATION_DURATION_MS}),
                transform: [{scale: scale.value}, {translateY: videoY.value}],
            };
        }
        return {
            width: withTiming(windowWidth, {duration: ANIMATION_DURATION_MS}),
            height: withTiming(windowWidth * (9 / 16), {duration: ANIMATION_DURATION_MS}),
            transform: [{scale: scale.value}, {translateY: videoY.value}, {translateX: videoX.value}],
        };
    });

    // MARK: - Render
    return (
        <>
            <StatusBar hidden={isFullScreen}/>
            <View style={[
                isFullScreen ? styles.horizontalContainer : styles.container,
                {marginTop: isFullScreen ? 0 : top} // 전체 화면일 때는 marginTop 0
            ]}>
                <GestureDetector gesture={playerGesture}>
                    <Animated.View style={[videoContainerAnimatedStyle]}>
                        {/* 컨트롤러 오버레이 */}
                        {isControlVisible &&
                            <View style={styles.controlOverlay}/>
                        }
                        <Video
                            ref={videoRef}
                            controls={false} // 자체 컨트롤러 사용 안 함
                            source={videoSource}
                            style={styles.videoPlayer}
                            rate={isLongPress ? 2 : 1} // 롱 프레스 시 2배속
                            resizeMode="contain"
                        />
                    </Animated.View>
                </GestureDetector>

            </View>
            {/* 전체 화면이 아닐 때만 추가 정보 표시 */}
            {!isFullScreen && (
                <View style={styles.bottomContent}>
                    <Text>제스쳐 정리</Text>
                </View>
            )}
        </>
    );
};

// MARK: - Styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    horizontalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        overflow: 'hidden'
    },
    controlOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검정 오버레이
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },
    videoContainer: {
        overflow: 'hidden'
    },
    videoPlayer: {
        flex: 1,
    },
    bottomContent: {
        flex: 1,
        padding: 16,
    },
});

export default GesturePlayerScreen;
