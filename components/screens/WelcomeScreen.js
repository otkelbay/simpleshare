import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const WelcomeScreen = props => {
    return <View style={style.container}>
        <Text style={style.text}> Welcome To Instagram </Text>
        <View style={style.buttons}>
            <View style={style.button}>
                <Button onPress={() => props.navigation.navigate('Register')} title={'Registration'}/>
            </View>
            <View style={style.button}>
                <Button style={style.loginButton} onPress={() => props.navigation.navigate('Login')}
                        title={'Login'}/>
            </View>
        </View>
    </View>;
};

const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: '100%'
    },
    text: {
        fontSize: 30,
        marginBottom: 200,
        color: '#4bbfcc'
    },
    buttons: {
        height: 100,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column",
        width: '30%'
    },
    loginButton: {
        marginTop: 20,
        width: '100%'
    },
    button: {
        width: 200
    }
});


export default WelcomeScreen;
