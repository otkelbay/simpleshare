import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const FeedScreen = props => {


    const [feedList, setFeedList] = useState([]);
    const [page, setPage] = useState(1);
    const [likesList, setLikesList] = useState({});
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

    const makeRequest = (page) => {
        let token = user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        axios.post(`http://b25c802f.ngrok.io/api/feed?page=${page}`, [], headers)
            .then((response) => {
                let data = response.data.data;
                let tempLikesList = {};
                data.forEach((item) => {
                    tempLikesList[item.id] = {
                        "liked": item.liked,
                        "likes": item.likes
                    };
                });
                setLikesList(tempLikesList);
                setFeedList(data);
            });
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
        axios.post(`http://b25c802f.ngrok.io/api/like`, req, headers);
    };

    return <View style={style.container}>
        <View style={style.feed}>
            <ScrollView>
                {
                    feedList.map((feed, index) => {
                        return <View key={index} style={style.feedCard}>
                            <View style={style.userCard}>
                                <Image source={{uri: feed.author.avatar}} style={style.avatar}/>
                                <Text style={style.userText}>{feed.author.login}</Text>
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
                                        putLike(feed.id, !likesList[feed.id].liked, index);
                                    }}>
                                        <Icon name="heart" size={30} color={likesList[feed.id].liked ? 'red' : 'white'}/>
                                    </TouchableOpacity>
                                    <Text style={style.likesAmount}>{likesList[feed.id].likes} likes</Text>
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
            </ScrollView>
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
