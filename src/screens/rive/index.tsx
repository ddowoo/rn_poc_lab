import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Rive, {LoopMode, RiveRef} from 'rive-react-native';
import {useEffect, useRef, useState} from 'react';

const RiveScreen = () => {
  const riveRef = useRef<RiveRef>(null);
  const levelRef = useRef<RiveRef>(null);

  // 첫 플레이를 안하면 에셋이 바로 다 모여버려서
  useEffect(() => {
    riveRef.current?.play('idle', LoopMode.OneShot);

    // riveRef.current?.pause();
  }, []);

  const [level, setLevel] = useState(0);

  const handlePlay = () => {
    // riveRef.current?.play();
    const nextLevel = level + 1;
    setLevel(nextLevel);

    riveRef.current.setInputState('State Machine 1', 'treeLevel', -1);

    riveRef.current.setInputState('State Machine 1', 'levelup', nextLevel);
    setTimeout(() => {
      riveRef.current.setInputState('State Machine 1', 'treeLevel', nextLevel);
    }, 3000);
  };

  const handlePause = () => {
    // riveRef.current?.pause();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{height: 300}}>
        <Rive
          ref={riveRef}
          resourceName="levelup"
          style={{width: 300, height: 300}}
          onStateChanged={(stateMachineName, stateName) => {
            console.log('stateMachineName : ', stateMachineName);
            console.log('stateName : ', stateName);
          }}
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
