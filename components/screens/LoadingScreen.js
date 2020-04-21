import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const LoadingScreen = props => {

    return <View style={style.container}>
        <Text style={style.mainText}>#SHARENATURE</Text>
    </View>;

};

const style = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
    },
    mainText: {
        fontSize: 50,
        color: '#ff0e1d',
        fontWeight: 'bold',
    },
});


export default LoadingScreen;
