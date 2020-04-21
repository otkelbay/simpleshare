import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import AnimatedLoader from 'react-native-animated-loader';

const SubscribeToScreen = props => {


    const [usersList, setUsersList] = useState([]);
    const [subscribedList, setSubscribedList] = useState({});
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (user) {
            makeRequest();
        }
    }, [user]);


    if (!user) {
        AsyncStorage.getItem('user').then((userLocal) => {
            console.log('user ' + userLocal);
            setUser(JSON.parse(userLocal));
        });
    }

    const makeRequest = () => {
        let token = user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        axios.get(`http://185.125.46.87:8004/api/get-suggested`,  headers)
            .then((response) => {
                let data = response.data;
                let tempLikesList = {};
                data.forEach((item) => {
                    tempLikesList[item.id] = {
                        "followed": false
                    };
                });
                setSubscribedList(tempLikesList);
                setUsersList(data);
                setIsLoaded(true);
            });
    };

    const follow = (userId) => {
        let tempObj = {...subscribedList};
        tempObj[userId].followed = true;
        setSubscribedList(tempObj);

        let token = user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        let req = {
            subscribe_to: userId,
            follow: true,
        };
        axios.post(`http://185.125.46.87:8004/api/subscribe`, req, headers);
        setCounter(counter + 1);
    };

    return <View style={style.container}>

            <Text style={style.mainText}>You can know this people:</Text>
            <View style={style.recommendations}>
                {
                    isLoaded ? <ScrollView>
                        {
                            usersList.map((user, index) => {
                                return <TouchableOpacity key={index}>
                                    <View  style={style.userCard}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Image source={{uri: user.avatar}} style={style.avatar}/>
                                            <Text style={style.userText}>{user.login}</Text>
                                        </View>
                                        <Button color={subscribedList[user.id].followed ? "blue" : "red"}
                                                onPress={ () => {follow(user.id)} } style={style.subscribe}
                                                disabled={subscribedList[user.id].followed}
                                                title={subscribedList[user.id].followed ? "Subscribed" : "Subscribe"}
                                        />
                                    </View>
                                </TouchableOpacity>;
                            })
                        }
                    </ScrollView> : <AnimatedLoader
                        visible={!isLoaded}
                        overlayColor="rgba(255,255,255,0.75)"
                        animationStyle={{ width: 150, height: 150 }}
                        speed={1.5}
                        source={require("../../assets/preloader.json")} />
                 }
            </View>
            <View style={style.nextButton}>
                <View style={style.nextButton}>
                    <Button title={'Next'} onPress={() => {
                        if (counter > 4) {
                            props.navigation.navigate('Feed');
                        }
                        else{
                            alert('Please subscribe at least 5 person ;) ');
                        }
                    }}/>
                </View>
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
