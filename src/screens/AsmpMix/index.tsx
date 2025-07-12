import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import SoundPlayer from 'react-native-sound-player';

const FILE_LIST_NAME = ['fire', 'rain', 'thunder'];

const AsmrMixScreen = () => {
  const [playIndexList, setPlayIndexList] = useState<number[]>([]);

  useEffect(() => {
    SoundPlayer.playSoundFile('fire', 'mp3');
    SoundPlayer.playSoundFile('thunder', 'mp4');
  }, []);

  const onPressMusic = (index: number) => {
    let nextPlayIndexList = [...playIndexList];
    if (nextPlayIndexList.includes(index)) {
      const idx = nextPlayIndexList.indexOf(index);
      nextPlayIndexList.splice(idx, 1);
    } else {
      nextPlayIndexList.push(index);
    }

    // ----------------------------------
    setPlayIndexList(nextPlayIndexList);

    FILE_LIST_NAME.forEach((fileName, index) => {
      if (nextPlayIndexList.includes(index)) {
        SoundPlayer.playSoundFile(fileName, 'mp3');
      }
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'row', marginBottom: 16}}>
        <Text>재생중 음원</Text>
        {FILE_LIST_NAME.filter((_, idx) => playIndexList.includes(idx)).join(
          '/',
        )}
      </View>
      <View style={{flexDirection: 'row', marginBottom: 16}}>
        {FILE_LIST_NAME.map((fileName, index) => {
          return (
            <TouchableOpacity
              key={fileName}
              style={styles.button}
              onPress={() => onPressMusic(index)}>
              <Text>{fileName}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text>다운로드</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AsmrMixScreen;

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
