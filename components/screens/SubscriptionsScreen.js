import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const Subscriptions = props => {

    const [usersList, setUsersList] = useState(props.route.params.subscriptions);
    const [subscribedList, setSubscribedList] = useState({});
    const [user, setUser] = useState(null);


    if (!user) {
        AsyncStorage.getItem('user').then((userLocal) => {
            console.log('user ' + userLocal);
            setUser(JSON.parse(userLocal));
            let tempLikesList = {};
            usersList.forEach((item) => {
                tempLikesList[item.id] = {
                    'followed': true,
                };
            });
            setSubscribedList(tempLikesList);
        });
    }

    const follow = (userId, followUnfollow) => {
        let tempObj = {...subscribedList};
        tempObj[userId].followed = followUnfollow;
        setSubscribedList(tempObj);

        let token = user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        let req = {
            subscribe_to: userId,
            follow: followUnfollow
        };
        axios.post(`http://185.125.46.87:8004/api/subscribe`, req, headers);
    };

    const isFollow = (id) => {
        if (subscribedList.hasOwnProperty(id)){
            return subscribedList[id].followed;
        }
        return  false;
    }

    return <View style={style.container}>
        <Text style={style.mainText}>You subscribed to:</Text>
        <View style={style.recommendations}>
            <ScrollView>
                {
                    usersList.map((user, index) => {
                        return <View key={index}>
                            <View style={style.userCard}>
                                <View style={{flexDirection: 'row'}}>
                                    <Image onPress={() => props.navigation.navigate('Profile', {
                                        user_id: user.id
                                    })} source={{uri: user.avatar}} style={style.avatar}/>
                                    <Text style={style.userText}>{user.login}</Text>
                                </View>
                                <Button color={isFollow(user.id) ? 'blue' : 'red'}
                                        onPress={() => {
                                            follow(user.id, !isFollow(user.id));
                                        }} style={style.subscribe}
                                        title={isFollow(user.id) ? 'Un-follow' : 'Subscribe'}
                                />
                            </View>
                        </View>;
                    })
                }
            </ScrollView>
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


export default Subscriptions;
