import {ScrollView, Text, useWindowDimensions, View} from 'react-native';
import WebView from 'react-native-webview';

const ScrollViewWebView = () => {
  const {width: windowWidth} = useWindowDimensions();

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
          }}>
          <Text>뷰</Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
          }}>
          <Text>웹뷰</Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView horizontal pagingEnabled={true}>
          <ScrollView style={{flex: 1, width: windowWidth}}>
            {new Array(100).fill('1').map((_, index) => {
              return (
                <View
                  key={index}
                  style={{width: '100%', height: 40, borderWidth: 1}}>
                  <Text>{index}</Text>
                </View>
              );
            })}
          </ScrollView>
          <WebView
            style={{flex: 1, width: windowWidth}}
            source={{uri: 'https://www.naver.com'}}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default ScrollViewWebView;
