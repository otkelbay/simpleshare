import React, {useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TouchableNativeFeedback, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const PostScreen = props => {

    const [liked, setLiked] = useState(false);
    const [writeComment, setWriteComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [likes, setLikes] = useState(0);
    const [post, setPost] = useState({});
    const [user, setUser] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);

    if (!user) {
        AsyncStorage.getItem('user').then((userLocal) => {
            console.log('user ' + userLocal);
            let userObj = JSON.parse(userLocal);
            setUser(userObj);
            console.log(props);
            getPost(props.route.params.id, userObj.api_token);
        });
    }

    const getPost = (postId, apiToken) => {
        console.log('post id' + postId);
        let token = apiToken ? apiToken : user.api_token;
        let headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        };
        axios.get(`http://b25c802f.ngrok.io/api/post/${postId}`, headers)
            .then((response) => {
                setPost(response.data);
                console.log(response.data);
                setIsLoaded(true);
                setLiked(response.data.liked);
                setLikes(response.data.likes);
            });
    };

    function switchLike(val) {
        setLiked(val);
        setLikes(val ? likes + 1 : likes - 1);
    }

    const comments = () => {
        return <ScrollView style={style.comments}>
            {
                post.comments.map((item, index) => {
                    return <View key={index} style={style.comment}>
                        <View style={style.commentUser}>
                            <Image source={{uri: item.user.avatar}} style={style.commentAvatar}/>
                            <Text style={style.commentUserName}>{item.user.login}</Text>
                        </View>
                        <Text>{item.text}</Text>
                    </View>;
                })
            }
        </ScrollView>;
    };

    const uploadComment = () => {
        if (!commentText) {
            return;
        }

        let data = {
            'post_id': post.id,
            'text': commentText,
        };
        setSendingRequest(true);
        axios.post('http://b25c802f.ngrok.io/api/comment', data, {
            headers: {
                'Authorization': `Bearer ${user.api_token}`,
            },
        }).then((response) => {
            post.comments.push(response.data);
            setCommentText('');
            //setWriteComment(false);
        }).finally(() => {
            setSendingRequest(false);
        });
    };

    const writeCommentView = () => {
        return <View style={style.writeTextContainer}>
                <TextInput style={style.textInput}
                           onChangeText={(text) => {
                               setCommentText(text);
                           }}
                           placeholder="Write your text here ..."
                           value={commentText}
                           multiline={true}
                           numberOfLines={4}
                />
                <Button style={style.submitButton} onPress={uploadComment} disabled={sendingRequest}
                        title={!sendingRequest ? 'Submit' : 'Submitting...'}/>
            </View>;
    };

    return <View style={style.container}>
        {
            isLoaded ? <View style={style.feedCard}>
                <View style={style.userCard}>
                    <Image source={{uri: post.author.avatar}} style={style.avatar}/>
                    <Text style={style.userText}>{post.author.login}</Text>
                </View>
                <View style={style.feedImageContainer}>
                    <TouchableOpacity style={style.feedImage} onPress={() => {
                        switchLike(!liked);
                    }}>
                        <Image style={style.feedImage} source={{uri: post.photo_url}}/>
                    </TouchableOpacity>
                    <View style={{padding: 10}}>
                        <Text style={{fontSize: 16}}>{post.post_text}</Text>
                    </View>
                </View>
                <View style={style.feedActionBar}>
                    <View style={style.likeContainer}>
                        <TouchableOpacity>
                            <Icon name="heart" size={30} color={liked ? 'red' : 'white'}/>
                        </TouchableOpacity>
                        <Text style={style.likesAmount}>{likes + ' likes'}</Text>
                    </View>
                    <View style={{flex: 2, justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => {
                            setWriteComment(!writeComment);
                        }}>
                            <Icon style={style.commentsIcon} name="commenting-o" size={30} color={'white'}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {!writeComment ? comments() : writeCommentView()}
            </View> : null
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
        flex: 2,
    },
    feedImage: {
        flex: 1,
        height: 200,
        width: 400,
    },
    feedActionBar: {
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
        paddingVertical: 8,
        paddingHorizontal: '5%',
        backgroundColor: '#eee',
    },
    commentsIcon: {},
    comments: {
        flex: 2,
    },
    comment: {
        paddingHorizontal: '5%',
        paddingVertical: 5,
        borderWidth: 1,
        marginTop: 3,
    },
    commentAvatar: {
        borderRadius: 5,
        width: 20,
        height: 20,
        marginRight: 5,
    },
    commentUser: {
        flexDirection: 'row',
    },
    commentUserName: {
        fontWeight: 'bold',
    },
    writeTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    submitButton: {
        flex: 1,
    },
    textInput: {
        flex: 4,
    },
});


export default PostScreen;
