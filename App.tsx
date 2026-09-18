import React from 'react';
import {StatusBar, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/store';
import {RootNavigator} from './src/navigation/RootNavigator';
import {colors} from './src/theme/colors';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex: 0, backgroundColor: colors.primary}} edges={['top']} />
        <View style={{flex: 1, backgroundColor: colors.background}}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
            translucent={false}
          />
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
