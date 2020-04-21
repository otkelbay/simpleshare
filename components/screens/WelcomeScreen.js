import React from 'react';
import {View, Text, Button, StyleSheet, ImageBackground} from 'react-native';

const WelcomeScreen = props => {
    return <View style={style.container}>
        <ImageBackground source={
            require('../../assets/bg.jpg')
        } style={style.bg}>
            <Text style={style.text}>#SHARENATURE</Text>
            <Text style={style.text2}>Share everything.</Text>
            <View style={style.buttons}>
                <View style={style.button}>
                    <Button onPress={() => props.navigation.navigate('Register')} title={'Registration'}/>
                </View>
                <View style={style.button}>
                    <Button style={style.loginButton} onPress={() => props.navigation.navigate('Login')}
                            title={'Login'}/>
                </View>
            </View>
        </ImageBackground>

    </View>;
};

const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: '100%'
    },
    bg: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: 40,
        color: '#d1f4fb'
    },
    text2: {
        fontSize: 30,
        marginBottom: 200,
        color: '#070406'
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
        width: '100%',
        borderRadius: 10
    },
    button: {
        width: 200
    }
});


export default WelcomeScreen;
