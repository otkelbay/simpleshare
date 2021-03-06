import React, {useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity, NativeEventEmitter,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedLoader from 'react-native-animated-loader';

const PostScreen = props => {

    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMe, setIsMe] = useState(false);
    const [following, setFollowing] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);

    console.log(props.route);

    const checkPropUserId = () => {
        if (user
            && typeof (props.route.params) !== 'undefined'
            && typeof (props.route.params.user_id) !== 'undefined')
        {
            return props.route.params.user_id === user.id;
        }
        return true;
    };

    if (!user) {
        AsyncStorage.getItem('user').then((userLocal) => {
            console.log('user ' + userLocal);
            let userObj = JSON.parse(userLocal);
            setUser(userObj);
            console.log('before', typeof (props.route.params));
            if (typeof (props.route.params) !== 'undefined' && typeof (props.route.params.user_id) !== 'undefined') {
                setIsMe(props.route.params.user_id === userObj.id);
            } else {
                setIsMe(true);
            }
            console.log('after');
            getUserInfo(userObj.api_token);
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

    const getUserInfo = (apiToken) => {
        let token = apiToken ? apiToken : user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        let body = {};
        console.log('props',props.route.params);
        if (typeof (props.route.params) !== 'undefined' && typeof (props.route.params.user_id) !== 'undefined') {
            body['user_id'] = props.route.params.user_id;
        }
        axios.post(`http://185.125.46.87:8004/api/user-posts`, body, headers)
            .then((response) => {
                setUserInfo(response.data);
                setIsLoaded(true);
                setFollowing(response.data.following);
            });
    };

    const quit = () => {
        AsyncStorage.removeItem('user').then(() => {
            (new NativeEventEmitter()).emit('loggedOut');
        });
    };

    const headerView = () => {
        return <View style={style.headerContainer}>
            <View style={style.flexOne}>
                <Image source={{uri: userInfo.avatar}} style={style.avatar}/>
            </View>
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 20}}>
                    <View style={style.flexOne}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{userInfo.login}</Text>
                    </View>
                    {
                        !isMe ? <View style={style.flexOne}>
                            <Button title={following ? 'Un-follow'  : 'Follow'} color={following ? 'blue'  : 'red' } onPress={() => {
                                follow(userInfo.id,!following);
                            }}/>
                        </View> : null
                    }

                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text onPress={() => props.navigation.navigate('Followers', {
                            followers: userInfo.followers
                        })}  style={{fontSize: 15}}>Followers</Text>
                        <Text onPress={() => props.navigation.navigate('Followers', {
                            followers: userInfo.followers
                        })}  style={{fontSize: 17, fontWeight: 'bold'}}>{userInfo.followers.length}</Text>
                    </View>
                    <View style={style.flexOne}>
                        <Text onPress={() => props.navigation.navigate('Subscriptions', {
                            subscriptions: userInfo.subscribes
                        })} style={{fontSize: 15}}>Subs</Text>
                        <Text onPress={() => props.navigation.navigate('Subscriptions', {
                            subscriptions: userInfo.subscribes
                        })} style={{fontSize: 17, fontWeight: 'bold'}}>{userInfo.subscribes.length}</Text>
                    </View>
                </View>
            </View>
            {
                isMe ? <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
                    <TouchableOpacity onPress={quit}>
                        <Ionicons name="ios-exit" color="red" size={30}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ios-settings" style={{marginTop: 20}} size={30}/>
                    </TouchableOpacity>
                </View> : null
            }
        </View>;
    };

    const postsView = () => {
        return <View style={style.postsContainer}>
            <ScrollView>
                <View style={style.postsScrollContainer}>
                    {
                        userInfo.posts.map((item, index) => {
                            return <View key={index} style={style.post}><TouchableOpacity
                                onPress={() => props.navigation.navigate('Post', {id: item.id})}
                            >
                                <Image source={{uri: item.photo_url}} style={style.postImage}/>
                            </TouchableOpacity></View>;
                        })
                    }
                </View>
            </ScrollView>
        </View>;
    };

    return <View style={style.container}>
        {
            isLoaded ? <View style={style.container}>{headerView()}{postsView()}</View> : <AnimatedLoader
                visible={!isLoaded}
                overlayColor="rgba(255,255,255,0.75)"
                animationStyle={{ width: 150, height: 150 }}
                speed={1.5}
                source={require("../../assets/preloader.json")} />
        }
    </View>;
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    feed: {
        flex: 1,
    },
    feedCard: {
        flex: 1,
        /*flexDirection: 'column',
        paddingVertical: 10,*/
    },
    avatar: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    userText: {
        fontFamily: 'monospace',
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedImageContainer: {
        flex: 2,
    },
    feedImage: {
        flex: 1,
        height: 200,
        width: 400,
    },
    subscribe: {
        backgroundColor: 'pink',
        color: 'pink',
    },
    userCard: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: '5%',
        backgroundColor: '#eee',
    },
    post: {
        width: '33%',
        marginBottom: 5,
        paddingRight: 5,
    },
    postsContainer: {
        flex: 4,
    },
    postsScrollContainer: {
        flex: 1,
        flexWrap: 'wrap',
        width: '100%',
        paddingLeft: 10,
        flexDirection: 'row',
    },
    headerContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    postImage: {
        width: '100%',
        height: 120,
    },
    flexOne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default PostScreen;
