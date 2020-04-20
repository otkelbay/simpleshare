import React from 'react';
import {View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

const SubscribeToScreen = props => {

    //AsyncStorage.removeItem('user')
    let usersList = props.navigator.route.params.subscriptions;
    return <View style={style.container}>
        <Text style={style.mainText}>You can know this people:</Text>
        <View style={style.recommendations}>
            <ScrollView>
                {
                    usersList.map((user, index) => {
                        return <TouchableOpacity key={index}>
                            <View  style={style.userCard}>
                                <View style={{flexDirection: 'row'}}>
                                    <Image source={{uri: user.avatar}} style={style.avatar}/>
                                    <Text style={style.userText}>{user.user}</Text>
                                </View>
                                <Button color="red" style={style.subscribe} title={'subscribe'}/>
                            </View>
                        </TouchableOpacity>;
                    })
                }
            </ScrollView>
        </View>
        <View style={style.nextButton}>
            <Button title={'Next'} onPress={() => props.navigation.navigate('Feed')} />
        </View>
    </View>;
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: '5%',
    },
    mainText: {
        flex: 1,
        fontSize: 20,
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    recommendations: {
        flex: 6,
    },
    nextButton: {
        flex: 1,
        justifyContent: 'center',
    },
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,

    },
    avatar: {
        borderRadius: 10,
        width: 40,
        height: 40,
        marginRight: 10,
    },
    userText: {
        fontFamily: 'monospace',
        fontSize: 20,
        fontWeight: 'bold',
    },
    subscribe: {
        backgroundColor: 'pink',
        color: 'pink',
    },
});


export default SubscribeToScreen;
