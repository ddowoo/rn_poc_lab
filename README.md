# rn_poc_lab

이 프로젝트는 **React Native** 기반의 POC(Proof of Concept) 실험실입니다.  
새로운 기술, 라이브러리, UI/UX, 네이티브 연동 등을 실제로 적용해보고,  
프로덕션 도입 전 미리 검증하기 위한 샘플/실험 코드들을 모아둔 저장소입니다.

## POC 작업 리스트

아래는 현재 앱에서 실험/검증 중인 POC 목록입니다.  
(각 항목은 `src/navigation/AppNavigator.tsx`의 POC_SCREENS 기준)

| 라벨                   | 설명/기능 예시                                  |
| ---------------------- | ----------------------------------------------- |
| 동영상 자르기          | react-native-video 활용, 동영상 자르기/미리보기 |
| 네온사인 로고          | Skia로 네온사인 스타일 로고                     |
| 스키아 그라데이션 시계 | Skia로 그라데이션 시계 UI                       |
| 스키아 점 리스트       | Skia로 점(dot) 리스트 애니메이션                |
| 스키아 카드            | Skia 카드 UI/애니메이션                         |
| 스크롤뷰 웹뷰          | ScrollView + WebView 조합                       |
| Rive 애니메이션        | Rive 파일 연동/애니메이션                       |
| 햅틱                   | 햅틱 피드백 테스트                              |
| 제스처 그리드          | 제스처로 그리드 색상 변경                       |
| 차트                   | victory-native, skia 차트                       |
| 아크 프로그레스        | 원형/아크 형태 진행바                           |
| ASMP 믹스              | 여러 사운드 믹스/재생                           |
| Wallet 연동            | Apple/Google Wallet 패스 추가 및 관리           |

> 각 POC별 상세 구현/코드는 `src/screens/` 하위 폴더 참고

---
