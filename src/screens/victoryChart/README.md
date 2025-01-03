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

### 3. 툴팁 (Tooltip)
- **구현한 기능**:
  - 사용자가 특정 데이터 포인트를 클릭했을 때, 해당 값을 표시하는 툴팁을 추가.
  - 툴팁은 클릭한 위치에 따라 동적으로 배치되며, 클릭된 데이터 값이 표시됨.

  - **학습한 점**:
    - `useChartPressState`로 클릭 이벤트와 X, Y 좌표 상태 관리.
    - `useFont`를 활용한 텍스트 크기 측정과 중앙 정렬.
    - 데이터 포인트와 클릭된 좌표를 비교하여 가장 가까운 데이터 찾기.

    #### a. 클릭 이벤트와 데이터 매칭
    - **구현한 기능**:
      - 사용자 클릭 좌표와 데이터 포인트 간의 거리 계산.
        ```tsx
         // y값이 0이 아닌 데이터만 필터링
         const updateData = points.value.filter(data => data.yValue !== 0);

            // 클릭된 X 좌표와 가장 가까운 데이터 포인트 찾기
         const clickedPoint = points.value.find(
              point =>
                Math.abs(state.x.position.value - point.x) <
                (points.value[1]?.x - points.value[0]?.x) / 2, // x 간격의 절반 이내
         );

            // 클릭된 포인트가 존재하면 툴팁 정보 설정
         const clickPositionY = clickedPoint?.y ?? 0; // y 좌표
         const clickValue = clickedPoint?.yValue?.toString() ?? ''; // y 값 텍스트
        ```
      
      - 가장 가까운 데이터 포인트의 y값에 툴팁 위치
---



## 주요 내용
- **데이터 처리**:
    - 0 또는 누락된 데이터를 필터링하고 시각화.
- **그래디언트**:
    - `LinearGradient`와 `vec`로 다양한 효과 구현.
- **React Native Skia**:
    - `DashPathEffect`, `useFont`, `LinearGradient` 활용.
- **useChartPressState**
  - 유저 터치에 따른 상태값 변화와, 유저의 터치 위치 값 받기


---
## 개선 사항
1. 터치 이벤트를 추가해 툴팁 제공.
2. 반응형 레이아웃 적용.
---
