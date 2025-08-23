import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';

// MARK: - Constants
const PAN_GESTURE_THRESHOLD = 60; // 팬 제스처 전체화면 전환 이동 기준
const VIDEO_SEEK_TIME_SECONDS = 5; // 더블 탭 시 비디오 이동 시간 (초)
const VIDEO_CONTROL_TIMEOUT_MS = 3000; // 비디오 컨트롤 자동 숨김 시간 (밀리초)
const ANIMATION_DURATION_MS = 150; // 제스처 종료 시 애니메이션 지속 시간 (밀리초)

const GesturePlayerScreen = () => {
    // MARK: - State & Refs
    const {width: windowWidth, height: windowHeight} = useWindowDimensions();
    const {top} = useSafeAreaInsets();
    const videoRef = useRef<VideoRef>(null);

    // reanimated value
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);
    const scale = useSharedValue(1); // 비디오 확대/축소 배율
    const savedScale = useSharedValue(1); // 핀치 제스처 시작 시의 배율 저장용

    const isFullScreenShared = useSharedValue(false); // 전체화면 상태 (UI 스레드용)
    const isZoomed = useSharedValue(false); // 줌인 상태 여부 (UI 스레드용)

    // state value
    const [isFullScreen, _setIsFullScreen] = useState(false);
    const setIsFullScreen = (value: boolean) => {
        isFullScreenShared.value = value;
        _setIsFullScreen(value);
    };
    const [isControlVisible, setIsControlVisible] = useState(false); // 비디오 컨트롤러 표시 여부
    const [isLongPress, setIsLongPress] = useState(false); // 롱 프레스(2배속) 상태 여부

    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // MARK: - Effects
    useEffect(() => {
        const onOrientationDidChange = (orientation: string) => {
            const isLandscape = orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT';
            setIsFullScreen(isLandscape);
        };
        Orientation.addOrientationListener(onOrientationDidChange);
        return () => {
            Orientation.removeOrientationListener(onOrientationDidChange);
        };
    }, []);

    // MARK: - JS Handlers
    const handleFullScreenToggle = () => {
        if (isFullScreenShared.value) {
            Orientation.lockToPortrait();
        } else {
            Orientation.lockToLandscapeLeft();
        }
    };

    // 더블 탭 시 현재 비디오 시간을 기준으로 앞/뒤로 이동
    const handleDoubleTapSeek = async (isLeft: boolean) => {
        try {
            const currentTime = await videoRef.current?.getCurrentPosition() || 0;
            const targetTime = isLeft ? currentTime - VIDEO_SEEK_TIME_SECONDS : currentTime + VIDEO_SEEK_TIME_SECONDS;
            videoRef.current?.seek(targetTime);
        } catch (e) {
            console.error('Failed to seek video:', e);
        }
    };

    const toggleControls = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = null;
        }
        const newVisibility = !isControlVisible;
        setIsControlVisible(newVisibility);

        if (newVisibility) {
            controlsTimeoutRef.current = setTimeout(() => {
                setIsControlVisible(false);
                controlsTimeoutRef.current = null;
            }, VIDEO_CONTROL_TIMEOUT_MS);
        }
    };

    // MARK: - Gestures
    // 핀치 - 줌 인 아웃
    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = Math.max(1, Math.min(savedScale.value * e.scale, 8));
        })
        .onEnd(() => {
            if (scale.value > 1.1) {
                isZoomed.value = true;
                savedScale.value = scale.value;
            } else {
                isZoomed.value = false;
                scale.value = withTiming(1, {duration: ANIMATION_DURATION_MS});
                translateX.value = withTiming(0, {duration: ANIMATION_DURATION_MS});
                translateY.value = withTiming(0, {duration: ANIMATION_DURATION_MS});
                savedScale.value = 1;
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
            }
        });

    // 팬 - 줌인 상태 이동, 전체화면 전환/해제
    const panGesture = Gesture.Pan()
        .maxPointers(1) // 한 손가락 제스처만 인식하도록 설정합니다.
        .onBegin(() => {
            if (isZoomed.value) {
                savedTranslateX.value = translateX.value;
                savedTranslateY.value = translateY.value;
            }
        })
        .onUpdate((e) => {
            if (isZoomed.value) {
                // 줌 상태 팬제스쳐
                // 비디오 컨테이너 영역
                const videoContainerWidth = isFullScreenShared.value ? windowHeight : windowWidth;
                const videoContainerHeight = isFullScreenShared.value ? windowWidth : windowWidth * (9 / 16);

                // 비디오 넘치는 부분 계산
                const maxVisualTranslateX = (videoContainerWidth * scale.value - videoContainerWidth) / 2;
                const maxVisualTranslateY = (videoContainerHeight * scale.value - videoContainerHeight) / 2;

                const nextTranslateX = savedTranslateX.value + e.translationX / scale.value;
                const nextTranslateY = savedTranslateY.value + e.translationY / scale.value;

                // 경계 벗어나지 않게 하기 위해 clamp 작업
                translateX.value = Math.max(-maxVisualTranslateX / scale.value, Math.min(maxVisualTranslateX / scale.value, nextTranslateX));
                translateY.value = Math.max(-maxVisualTranslateY / scale.value, Math.min(maxVisualTranslateY / scale.value, nextTranslateY));

            } else {
                // NO 줌 - 전체화면 전환/해제 제스처로 사용됩니다.
                if (isFullScreenShared.value) {
                    scale.value = Math.max(.75, Math.max(1, -e.translationY * .03));
                    translateY.value = e.translationY;
                } else {
                    translateY.value = e.translationY;
                    scale.value = Math.min(1.25, Math.max(1, -e.translationY * .03));
                }
            }
        }).onEnd(() => {
            'worklet'; // 이 콜백 함수는 UI 스레드에서 실행됩니다.
            if (isZoomed.value) {
                // 줌인 상태에서 패닝이 끝나면, 현재 위치를 최종 위치로 저장합니다.
                savedTranslateX.value = translateX.value;
                savedTranslateY.value = translateY.value;
            } else {
                // 줌인 상태가 아닐 때, 일정 거리 이상 스와이프했다면 전체화면 상태를 토글합니다.
                if (PAN_GESTURE_THRESHOLD <= Math.abs(translateY.value)) {
                    runOnJS(handleFullScreenToggle)(); // UI 스레드에서 JS 스레드의 함수를 호출합니다.
                }
                // 제스처가 끝나면 비디오 위치와 크기를 원래대로 복원합니다.
                translateY.value = withTiming(0, {duration: ANIMATION_DURATION_MS});
                scale.value = withTiming(1, {duration: ANIMATION_DURATION_MS});
            }
        });

    // 롱프레스 - 2배속 재생
    const longPressGesture = Gesture.LongPress()
        .onStart(() => runOnJS(setIsLongPress)(true))
        .onEnd(() => runOnJS(setIsLongPress)(false));

    // 싱글탭 - 컨트롤러 토글
    const singleTap = Gesture.Tap()
        .maxDuration(250)
        .onStart(() => runOnJS(toggleControls)());

    // 더블탭 - 비디오 시간 앞/뒤 이동
    const doubleTap = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart((e) => {
            const containerWidth = isFullScreenShared.value ? windowHeight : windowWidth;
            const isLeftSide = e.x < containerWidth / 2;
            runOnJS(handleDoubleTapSeek)(isLeftSide);
        });

    const playerGesture = Gesture.Simultaneous(
        pinchGesture, // 핀치 제스처는 항상 다른 제스처와 동시에 실행될 수 있습니다.
        Gesture.Race( // Race: 아래 제스처 중 하나만 활성화됩니다.
            Gesture.Exclusive(doubleTap, singleTap), // Exclusive: 더블 탭이 실패해야만 싱글 탭이 실행될 수 있습니다.
            panGesture,
            longPressGesture
        )
    );

    // MARK: - Animated Styles
    const videoContainerAnimatedStyle = useAnimatedStyle(() => {
        if (isFullScreenShared.value) {
            return {
                width: withTiming(windowHeight / 9 * 16, {duration: ANIMATION_DURATION_MS}),
                height: withTiming(windowHeight, {duration: ANIMATION_DURATION_MS}),
                transform: [{scale: scale.value}, {translateX: translateX.value}, {translateY: translateY.value}],
            };
        }
        return {
            width: withTiming(windowWidth, {duration: ANIMATION_DURATION_MS}),
            height: withTiming(windowWidth * (9 / 16), {duration: ANIMATION_DURATION_MS}),
            transform: [{scale: scale.value}, {translateY: translateY.value}, {translateX: translateX.value}],
        };
    });

    // MARK: - Render
    return (
        <>
            <StatusBar hidden={isFullScreen}/>
            <View style={[
                styles.container,
                isFullScreen && styles.horizontalContainer,
                {paddingTop: isFullScreen ? 0 : top}
            ]}>
                <GestureDetector gesture={playerGesture}>
                    <Animated.View style={[styles.videoContainer, videoContainerAnimatedStyle]}>
                        {isControlVisible && <View style={styles.controlOverlay}/>}
                        <Video
                            ref={videoRef}
                            controls={false}
                            source={{uri: 'https://www.w3schools.com/html/mov_bbb.mp4'}}
                            style={styles.videoPlayer}
                            rate={isLongPress ? 2 : 1} // 롱 프레스 상태이면 2배속
                            resizeMode="contain"
                        />
                    </Animated.View>
                </GestureDetector>
            </View>
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
        justifyContent: 'flex-start',
    },
    horizontalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingTop: 0,
    },
    controlOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    videoContainer: {
        backgroundColor: 'black',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    bottomContent: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
});

export default GesturePlayerScreen;
