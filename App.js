import React, {useState} from 'react';
import {StyleSheet, View, Text, NativeEventEmitter} from 'react-native';
import WelcomeScreen from './components/screens/WelcomeScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import LoginScreen from './components/screens/LoginScreen';
import SubscribeTo from './components/screens/SubscribeToScreen';
import Feed from './components/screens/FeedScreen';
import Post from './components/screens/PostScreen';
import Profile from './components/screens/ProfileScreen';
import Loading from './components/screens/LoadingScreen';
import TakePhoto from './components/screens/TakePhotoScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const welcomeStack = () => {
    return <Stack.Navigator initialRouteName={'Welcome'}>
        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>;
};


const feedStack = () => {
    return <Stack.Navigator initialRouteName={'Feed'}>
        <Stack.Screen name="SubscribeTo" options={{title: 'Recommendations'}} component={SubscribeTo}/>
        <Stack.Screen name="Feed" component={Feed}/>
        <Stack.Screen name="Post" component={Post}/>
        <Stack.Screen name="TakePhoto" options={{title: 'Photo'}} component={TakePhoto}/>
    </Stack.Navigator>;
};

const takePhotoStack = () => {
    return <Stack.Navigator initialRouteName={'TakePhoto'}>
        <Stack.Screen name="SubscribeTo" options={{title: 'Recommendations'}} component={SubscribeTo}/>
        <Stack.Screen name="Feed" component={Feed}/>
        <Stack.Screen name="Post" component={Post}/>
        <Stack.Screen name="TakePhoto" options={{title: 'Photo'}} component={TakePhoto}/>
    </Stack.Navigator>;
};


const tabsCustomization = ({route}) => ({
    tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Feed') {
            iconName = 'ios-images';
        } else if (route.name === 'TakePhoto') {
            iconName = 'ios-camera';
        }else if (route.name === 'Profile') {
            iconName = 'ios-contact';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color}/>;
    },
});

const bottomTabs = () => {
    return <Tab.Navigator screenOptions={tabsCustomization} tabBarOptions={{
                              activeTintColor: 'tomato',
                              inactiveTintColor: 'gray',
                          }}>
        <Tab.Screen name="Feed" component={feedStack}/>
        <Tab.Screen name="TakePhoto" options={{title: 'Photo'}} component={TakePhoto}/>
        <Tab.Screen name="Profile" component={Profile}/>
    </Tab.Navigator>;
};


export default function App() {

    const [auth, setAuth] = useState(false);
    const [loaded, setLoaded] = useState(false);
    AsyncStorage.getItem('user').then((user) => {
        setAuth(!!user);
        setLoaded(true);
        //console.log(user);

    });
    console.log(NativeEventEmitter);
    (new NativeEventEmitter()).addListener('loggedIn', () => {
        setAuth(true);
    });
    (new NativeEventEmitter()).addListener('loggedOut', () => {
        setAuth(false);
    });

    return (
        <NavigationContainer>
            {
                loaded ? <View style={styles.screen}>
                    {auth ? bottomTabs() : welcomeStack()}
                </View> : <Loading/>
            }
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
});
