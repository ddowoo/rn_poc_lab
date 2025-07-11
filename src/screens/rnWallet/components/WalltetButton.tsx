import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function WalletButton({onPress}: {onPress: () => void}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.wrapper}>
        <Text style={styles.text}>인프콘 티켓 발급</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
    height: 58,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Wallet 앱의 다크 테마와 일치
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: '#fff', // 흰색 텍스트로 대비
    fontSize: 16,
    fontWeight: '600',
  },
});
