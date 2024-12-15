import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Rive, {RiveRef} from 'rive-react-native';
import {useEffect, useRef} from 'react';

const RiveScreen = () => {
  const riveRef = useRef<RiveRef>(null);

  // 첫 플레이를 안하면 에셋이 바로 다 모여버려서
  useEffect(() => {
    // riveRef.current?.play();
    riveRef.current?.pause();
  }, []);

  const handlePlay = () => {
    riveRef.current?.play();
  };

  const handlePause = () => {
    riveRef.current?.pause();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{height: 300}}>
        <Rive
          ref={riveRef}
          url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
          artboardName="Avatar 1"
          stateMachineName="avatar"
          style={{width: 300, height: 300}}
          autoplay={false}
        />
      </View>
      <View style={{flexDirection: 'row', marginTop: 24}}>
        <TouchableOpacity onPress={handlePlay} style={styles.btn}>
          <Text>시작</Text>
        </TouchableOpacity>
        <View style={{width: 20}} />
        <TouchableOpacity onPress={handlePause} style={styles.btn}>
          <Text>멈춤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RiveScreen;

const styles = StyleSheet.create({
  btn: {
    width: 100,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
});
