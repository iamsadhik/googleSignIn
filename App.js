/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {useState, useEffect} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState(null);
  const [loginStatus, setLoginStatus] = useState(true);
  console.log(user?.user, ' user in the console');

  const getUserInformation = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUser(userInfo);
    } catch (e) {
      if (e.code === statusCodes.SIGN_IN_REQUIRED) {
        Alert.alert(
          'Sign In Required !!',
          'Please Sign In to use this feature in your application',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'SignIn',
              onPress: async () => {},
            },
          ],
        );
      }
    }
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userData = await GoogleSignin.signIn();
      if (userData) {
        const userToken = await GoogleSignin.getTokens();
        console.log(userToken, ' in the token');
      }
      setUser(userData);
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Failed to sign in', 'User Cancelled the Login', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Retry', onPress: () => signIn()},
        ]);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available or Outdated');
      } else {
        Alert.alert(error.message);
      }
    }
  };
  const signOut = async () => {
    setLoginStatus(true);
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      setUser(null);
    } catch (error) {
      console.error(error);
    }
    setLoginStatus(false);
  };
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      console.log('userAlready Signed in');
      getUserInformation();
    }
  };
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '170617092887-httjh0poi69p6pqh91m7jmrflj76ilc1.apps.googleusercontent.com',
    });
    isSignedIn();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <View style={{flex: 1}}>
        <SafeAreaView style={backgroundStyle} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View>
            {user !== null ? (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text>Hello you are Signed in as {user.user.name}</Text>
                  <Text>{user.user.email}</Text>
                  <Image
                    style={{width: 100, height: 100}}
                    source={{uri: user.user.photo}}
                  />
                </View>
                <View>
                  <Button onPress={() => signOut()} title="Logout" />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  signIn();
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  Google SignIn
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
