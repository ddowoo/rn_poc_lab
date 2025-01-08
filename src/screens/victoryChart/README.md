# VictoryChart POC

React Native에서 `victory-native`와 `@shopify/react-native-skia`를 사용해 선 그래프(Line Chart)와 막대 그래프(Bar Chart)를 구현한 예제입니다.

---

## 차트 설명

### 1. 선 그래프 (Line Chart)
- **구현한 기능**:
    - 점선과 실선으로 두 개의 선 그래프 표시.
    - 각 데이터 포인트에 점(Scatter)을 추가.
    - 선 아래 영역을 부드럽게 채우는 그라디언트 적용.

- **학습한 점**:
    - `DashPathEffect`로 점선 구현.
    - `Area`와 `LinearGradient`로 영역 강조.
    - 누락된 데이터 처리를 위한 `connectMissingData` 활용.

---

### 2. 막대 그래프 (Bar Chart)
- **구현한 기능**:
    - 두 층으로 구성된 막대 그래프:
        - 첫 번째는 빈 데이터 표시.
        - 두 번째는 실제 데이터를 표시하며 그라디언트 적용.
    - 모서리가 둥근 막대 스타일(`roundedCorners`) 추가.

- **학습한 점**:
    - `chartBounds`와 `points`를 활용한 데이터 렌더링.
    - `LinearGradient`로 막대에 색상 그라디언트 적용.

---

## 주요 학습 내용
- **데이터 처리**:
    - 0 또는 누락된 데이터를 필터링하고 시각화.
- **그래디언트**:
    - `LinearGradient`와 `vec`로 다양한 효과 구현.
- **React Native Skia**:
    - `DashPathEffect`, `useFont`, `LinearGradient` 활용.

---
## 개선 사항
1. 터치 이벤트를 추가해 툴팁 제공.
2. 반응형 레이아웃 적용.
---
