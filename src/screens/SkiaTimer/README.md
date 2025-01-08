
- Skia는 svg를 대용할 수 있음
- gpu를 사용하기 때문에 js thread에서 계산되지 않아 svg보다 성능이 좋음
- gpu를 쓰기 때문에 잦은 렌더링이 있는 작업이라면 특히 skia를 활용하는게 좋음



# 1. 시침 만들기
## - 수학적 개념 (선행지식)

### 1 라디안 (Radian)
- 라디안은 원에서 각도를 나타내는 단위입니다.
- **1라디안**은 반지름 길이와 같은 길이의 호를 만드는 중심각의 크기입니다.
- 라디안과 도(degree) 간의 변환 공식:
    
  - Math.PI / 180 = 1라디안
---

### 2 삼각함수 (Cosine, Sine)
- 원 위의 한 점의 좌표는 삼각함수를 통해 계산됩니다.
- 원의 중심에서 각도 \(\theta\)에 따라 점의 좌표를 계산하는 공식:

  - x = centerX + 반지름 × cos(각도 × 1라디안)
  - y = centerY + 반지름 × sin(각도 × 1라디안)
    
    - 중심에서 x,y좌표의 거리는 반지름
---

### 3 눈금 생성 방식
- 시계는 총 60개의 눈금을 가집니다.
- 눈금 사이의 각도는 6도 (360 % 60)이며, 라디안으로 변환 시:
    - angle = index * 6 * 1라디안

---
## 코드
```tsx
 {tickMarks.map(({x1, y1, x2, y2, isMajorTick}) => {
   //  path를 이용해 x1,y1에서 시적하고 선은 lintTO를 이용해 x2,y2까지 그어주기
  return (
    <Path
      color={'#000'}
      path={Skia.Path.Make().moveTo(x1, y1).lineTo(x2, y2)}
      strokeWidth={isMajorTick ? 3 : 1}
      style="stroke"
    />
  );
})}
```
