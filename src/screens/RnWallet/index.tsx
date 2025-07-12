import * as React from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WalletManager from 'react-native-wallet-manager';
import WalletButton from './components/WalltetButton.tsx';

const RnWallet = () => {
  /**
   * @description 티켓 추가 함수, apple wallet O , android에서는 wallet으로 안가고 browser로 이동한다
   */
  const addInfconTicket = async () => {
    try {
      const result = await WalletManager.addPassFromUrl(
        'https://github.com/dev-family/react-native-wallet-manager/blob/main/example/resources/pass.pkpass?raw=true',
      );
      console.log('인프콘 티켓 추가 결과:', result);
    } catch (e) {
      console.log('인프콘 티켓 추가 실패:', e);
    }
  };

  /**
   * Apple Wallet에서 인프콘 티켓 보기 - viewPass 0.77 버전부터 안되는중
   * @URL https://github.com/dev-family/react-native-wallet-manager/issues/34#issuecomment-2663501183
   */
  const viewInfconTicket = async () => {
    try {
      const result = await WalletManager.viewInWallet(
        'pass.family.dev.walletManager',
      );
      console.log('Wallet에서 인프콘 티켓 보기 결과:', result);
    } catch (e) {
      console.error('error viewing ticket in Wallet:', e);
      console.log('Wallet에서 인프콘 티켓 보기 실패:', e);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>인프콘 티켓 Wallet 연동</Text>
        <Text style={styles.subtitle}>
          당첨자 티켓을 Apple Wallet에 발급하여{'\n'}
          현장 QR 발권 과정을 생략합니다
        </Text>

        <WalletButton onPress={addInfconTicket} />

        {Platform.OS === 'ios' && (
          <>
            <Button onPress={viewInfconTicket} title="Wallet에서 보기" />
          </>
        )}

        <Text style={styles.note}>
          * 한국에서는 Apple Wallet 티켓 기능이 제한적입니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default RnWallet;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
