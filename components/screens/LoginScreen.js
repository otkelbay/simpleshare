import React, {useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    NativeEventEmitter,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';


const LoginScreen = props => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    //const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [sendingRequest, setSendingRequest] = useState(false);

    const submitLogin = inputs => {
        setSendingRequest(true);
        let data = {
            'password': password,
            'login': login,
        };

        axios.post('http://b25c802f.ngrok.io/api/login', data).then((response) => {
            console.log(response.data);
            AsyncStorage.setItem('user', JSON.stringify(response.data)).then(() => {
                (new NativeEventEmitter()).emit('loggedIn');
            });
        }).catch((response) => {
            alert('Credentials are wrong! Try again!');
        }).finally(() => {
            setSendingRequest(false);
        });
    };


    return <View style={style.container}>
        <Text style={style.mainText}>Login</Text>
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
        </View>
        <View style={{flex: 4, justifyContent: 'center'}}>
            <Button onPress={submitLogin} disabled={sendingRequest}
                    title={!sendingRequest ? 'Submit' : 'Submitting...'}/>
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
        flex: 4,
        width: '70%',
        justifyContent: 'space-around',
    },
    textInput: {
        borderColor: 'black',
        borderWidth: 1,
    },
    loginButton: {
        marginTop: 20,
        width: '100%',
    },
    button: {
        width: 200,
    },
});


export default LoginScreen;
