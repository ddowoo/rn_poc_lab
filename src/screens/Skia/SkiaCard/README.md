# SkiaCard 컴포넌트 학습 요약

## 주요 요소

1. **SweepGradient**: 중심에서 색상이 360도로 변화하는 그라디언트.
2. **BlurMask**: 경계선에 블러 효과 추가.

---

## Skia와 Reanimated의 통합

- **문제점**:
  React Native Reanimated의 애니메이션 값은 Skia의 `transform` 속성과 바로 호환되지 않음.  
  이를 해결하기 위해 `useDerivedValue`를 사용해야 함.


- **해결 방법**:
  `useDerivedValue`를 사용해 Reanimated의 값을 Skia에서 처리 가능한 형식으로 변환.
  ```javascript
  const animatedRotation = useDerivedValue(() => {
    return [{ rotate: Math.PI * rotation.value }]; // 라디안 값 계산
  }, [rotation]);

<br/>

참고자료(https://github.com/Shopify/react-native-skia/discussions/1631)


![converted_animation.gif](converted_animation.gif)
