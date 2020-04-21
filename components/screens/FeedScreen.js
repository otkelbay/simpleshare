import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import AnimatedLoader from "react-native-animated-loader";



const FeedScreen = props => {

    const [feedList, setFeedList] = useState([]);
    const [page, setPage] = useState(1);
    const [likesList, setLikesList] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user) {
            makeRequest(page);
        }
    }, [user]);


    if (!user) {
        AsyncStorage.getItem('user').then((userLocal) => {
            console.log('user ' + userLocal);
            setUser(JSON.parse(userLocal));
        });
    }

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        makeRequest(page);
    };

    const makeRequest = (page) => {
        console.log('making request');
        let token = user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        axios.post(`http://185.125.46.87:8004/api/feed?page=${page}`, [], headers)
            .then((response) => {
                let data = response.data.data;
                let tempLikesList = {};
                data.forEach((item) => {
                    tempLikesList[item.id] = {
                        "liked": item.liked,
                        "likes": item.likes
                    };
                });
                console.log('fucking response has ended');
                setLikesList(tempLikesList);
                setFeedList(data);
                setIsLoaded(true);
                console.log('fucking response has ended',isLoaded);

                setRefreshing(false);
            });
    };

    const likeOrNot =  (id) => {
        if(likesList.hasOwnProperty(id)){
            return  likesList[id].liked;
        }
        return false;
    };

    const likesOrZero =  (id) => {
        if(likesList.hasOwnProperty(id)){
            return  likesList[id].likes;
        }
        return 0;
    };

    const putLike = (postId, switchLike, index) => {
        let tempObj = {...likesList};
        tempObj[postId].liked = switchLike;
        tempObj[postId].likes = switchLike ? tempObj[postId].likes + 1 : tempObj[postId].likes -1;
        setLikesList(tempObj);

        let token = user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        let req = {
            post_id: postId,
            like: switchLike,
        };
        axios.post(`http://185.125.46.87:8004/api/like`, req, headers);
    };

    return <View style={style.container}>
        <View style={style.feed}>
            {
                isLoaded ?
                    <ScrollView refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    {
                        feedList.map((feed, index) => {
                            return <View key={index} style={style.feedCard}>
                                <View style={style.userCard}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('FeedProfile', {
                                        user_id: feed.author.id
                                    })}>
                                        <Image source={{uri: feed.author.avatar}} style={style.avatar}/>
                                    </TouchableOpacity>
                                    <Text onPress={() => props.navigation.navigate('FeedProfile', {
                                        user_id: feed.author.id
                                    })} style={style.userText}>{feed.author.login}</Text>
                                </View>
                                <View style={style.feedImageContainer}>
                                    <TouchableOpacity>
                                        <Image height={100} width={100} style={style.feedImage}
                                               source={{uri: feed.photo_url}}/>
                                    </TouchableOpacity>
                                    <View style={{padding: 10}}>
                                        <Text style={{fontSize: 16}}>{feed.post_text}</Text>
                                    </View>
                                </View>
                                <View style={style.feedActionBar}>
                                    <View style={style.likeContainer}>
                                        <TouchableOpacity onPress={() => {
                                            putLike(feed.id, !likeOrNot(feed.id), index);
                                        }}>
                                            <Icon name="heart" size={30} color={likeOrNot(feed.id) ? 'red' : 'white'}/>
                                        </TouchableOpacity>
                                        <Text style={style.likesAmount}>{likesOrZero(feed.id)} likes</Text>
                                    </View>
                                    <View style={{flex: 2, justifyContent: 'center'}}>
                                        <TouchableOpacity onPress={() => props.navigation.navigate('Post', {id: feed.id})}>
                                            <Icon style={style.commentsIcon} name="commenting-o" size={30} color={'white'}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1}}></View>
                                </View>
                            </View>;
                        })
                    }
                </ScrollView> :
                    <AnimatedLoader
                    visible={!isLoaded}
                    overlayColor="rgba(255,255,255,0.75)"
                    animationStyle={{ width: 150, height: 150 }}
                    speed={1.5}
                    source={require("../../assets/preloader.json")} />

                }

        </View>
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
        flexDirection: 'column',
        paddingVertical: 10,
    },
    avatar: {
        borderRadius: 10,
        width: 30,
        height: 30,
        marginRight: 10,
    },
    userText: {
        fontFamily: 'monospace',
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedImageContainer: {
        flex: 4,
    },
    feedImage: {
        flex: 1,
        height: 200,
        width: 'auto',
    },
    feedActionBar: {
        flex: 1,
        paddingHorizontal: '5%',
        backgroundColor: '#9ee3ee',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    subscribe: {
        backgroundColor: 'pink',
        color: 'pink',
    },
    likeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 3,
    },
    likesAmount: {
        marginLeft: 5,
    },
    userCard: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: '5%',
        backgroundColor: '#eee',
    },
    commentsIcon: {},
});


export default FeedScreen;
