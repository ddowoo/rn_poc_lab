# `react-native-gesture-handler` 제스처 충돌 및 조합

여러 제스처가 겹칠 때, 어떤 제스처를 인식할지 결정하는 방법 설명.

## 핵심 전략

* **`Gesture.Race(...gestures)` (경쟁):**
    * 설명: 여러 제스처 중 **가장 먼저 시작된 하나만** 인식함. 나머지는 무시.
    * 적용: 탭/핀치/팬/롱프레스 중 하나만 인식되도록 함.

* **`Gesture.Exclusive(...gestures)` (우선순위):**
    * 설명: 제스처 간 우선순위 지정. 높은 우선순위 제스처가 실패해야 다음 제스처 인식.
    * 적용: 더블 탭이 싱글 탭보다 우선함.

## `GesturePlayerScreen` 적용

* `playerGesture`는 `Gesture.Race`로 탭 그룹, 핀치, 팬, 롱프레스 중 하나만 인식.
* 탭 그룹은 `Gesture.Exclusive(doubleTap, singleTap)`로 더블 탭 우선.
