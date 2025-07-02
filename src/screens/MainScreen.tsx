import React from 'react';
import {Button, ScrollView, View} from 'react-native';
import {POC_SCREENS} from '../navigation/AppNavigator';

const MainScreen = ({navigation}) => (
  <ScrollView contentContainerStyle={{padding: 24}}>
    {POC_SCREENS.map(screen => (
      <View key={screen.name} style={{marginBottom: 12}}>
        <Button
          title={screen.name}
          onPress={() => navigation.navigate(screen.name)}
        />
      </View>
    ))}
  </ScrollView>
);

export default MainScreen;
