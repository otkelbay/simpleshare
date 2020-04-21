import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TextInput, NativeEventEmitter} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';


const RegisterScreen = props => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [sendingRequest, setSendingRequest] = useState(false);

    const submitRegister = inputs => {
        setSendingRequest(true);
        let data = {
            'password': password,
            'password_confirmation' : passwordConfirmation,
            'login': login,
        };

        axios.post('http://568088d1.ngrok.io/api/register', data).then((response) => {
            console.log(response.data);
            AsyncStorage.setItem('user', JSON.stringify(response.data)).then(() => {
                (new NativeEventEmitter()).emit('loggedIn');
            });
        }).catch((response) => {
            alert('Something went wrong! Try again!');
        }).finally(() => {
            setSendingRequest(false);
        });
    };

    return <View style={style.container}>
        <Text style={style.mainText}>Register</Text>
        <View style={style.inputs}>
            <TextInput style={style.textInput}
                placeholder="Login" onChangeText={(text) => {
                setLogin(text);
            }}
            />
            <TextInput secureTextEntry={true} style={style.textInput}
                placeholder="Password" onChangeText={(text) => {
                setPassword(text);
            }}
            />
            <TextInput secureTextEntry={true} style={style.textInput}
                placeholder="Password confirmation" onChangeText={(text) => {
                setPasswordConfirmation(text);
            }}
            />
        </View>
        <View style={{flex: 4, justifyContent: 'center'}}>
            <Button  onPress={submitRegister} disabled={sendingRequest}
                     title={!sendingRequest ? 'Submit' : 'Submitting...'} />
        </View>
    </View>;
};

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        paddingVertical: '10%',
    },
    mainText: {
        fontSize: 30,
        color: '#4bbfcc',
        flex: 4,
    },
    buttons: {
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: '30%',
    },
    inputs: {
        flex: 8,
        width: '70%',
        justifyContent: 'space-between',
    },
    textInput: {
        borderColor: 'black',
        borderWidth: 1
    },
    loginButton: {
        marginTop: 20,
        width: '100%',
    },
    button: {
        width: 200,
    },
});


export default RegisterScreen;
