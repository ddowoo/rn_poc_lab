import {
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useEffect} from 'react';

const androidHapticMethods = [
  'impactLight',
  'impactMedium',
  'impactHeavy',
  'rigid',
  'soft',
  'notificationSuccess',
  'notificationWarning',
  'notificationError',
  'clockTick',
  'contextClick',
  'keyboardPress',
  'keyboardRelease',
  'keyboardTap',
  'longPress',
  'textHandleMove',
  'virtualKey',
  'virtualKeyRelease',
  'effectClick',
  'effectDoubleClick',
  'effectHeavyClick',
  'effectTick',
];
// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const Haptic = () => {
  const onPressHapticb = (title: string) => {
    console.log(`Triggering haptic feedback: ${title}`);
    ReactNativeHapticFeedback.trigger(title, options);
  };

  useEffect(() => {
    Vibration.vibrate(100);
  }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center', paddingTop: 40}}>
        {androidHapticMethods.map(title => {
          return (
            <TouchableOpacity
              onPress={() => onPressHapticb(title)}
              key={title}
              style={{
                paddingVertical: 14,
                width: 200,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                borderWidth: 2,
                borderRadius: 8,
              }}>
              <Text>{title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Haptic;
