
## RN Wallet

```
인프콘 신청 → 당첨자 티켓 발급 → Apple Wallet에 저장 → 현장 QR 스캔으로 입장
```

## 현재 상황

- **Google Wallet**: 한국에서 사용 불가
- **Apple Wallet**: 카드만 가능 (티켓은 해외에서만)
- 어차피 한국에서 못함 그냥 재미로만 해보기

## 구현 방향

### Apple Wallet 티켓 발급

1. **서버에서 .pkpass 파일 생성**

    - Pass Type ID 인증서 필요
    - 티켓 정보 (이름, 날짜, QR코드 등)

2. **앱에서 Wallet에 추가**

   ```typescript
   WalletManager.addPassFromUrl('https://example.com/ticket.pkpass');
   ```

3. **현장에서 QR 스캔**
    - Wallet 앱에서 티켓 열기
    - QR코드로 입장 처리

<br/>

### 앱 이전 필요한 과정

1. **Apple Developer 계정**

    - Pass Type ID 생성
    - 인증서(.p12) 발급

2. **서버 구현**

    - .pkpass 파일 생성 API
    - 티켓 정보 JSON 구조

3. **앱 구현**
    - Wallet 연동 버튼
    - 티켓 상태 확인

<br/>

### 주요 API

```typescript
// 패스 추가
WalletManager.addPassFromUrl(url);

// 패스 존재 확인
WalletManager.hasPass(passTypeIdentifier);

// Wallet에서 패스 보기
WalletManager.viewInWallet(passTypeIdentifier);
```
