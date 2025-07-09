import React from 'react';
import {Button, ScrollView, View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {POC_SCREENS} from '../navigation/AppNavigator';

type MainScreenProps = {
  navigation: StackNavigationProp<any>;
};

const MainScreen = ({navigation}: MainScreenProps) => (
  <ScrollView contentContainerStyle={styles.container}>
    {POC_SCREENS.map(screen => (
      <View key={screen.name} style={styles.buttonWrapper}>
        <Button
          title={screen.label}
          onPress={() => navigation.navigate(screen.name)}
        />
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 100,
  },
  buttonWrapper: {
    marginBottom: 12,
  },
});

export default MainScreen;
