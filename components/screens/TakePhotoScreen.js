'use strict';
import React, {PureComponent, useState} from 'react';
import {TextInput, StyleSheet, Text, TouchableOpacity, View, Image, Button} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const TakePhotoScreen = props => {

    //AsyncStorage.removeItem('user')

    const [img, setImg] = useState(null);
    const [camera, setCamera] = useState(null);
    const [postText, setPostText] = useState(null);
    const [sendingRequest, setSendingRequest] = useState(false);

    const takePicture = async () => {
        if (camera) {
            const options = {quality: 0.8, width: 600 , base64: true};
            setImg(await camera.takePictureAsync(options));
        }
    };

    const uploadPost = () => {
        if (!postText) {
            return;
        }

        let data = {
            'photo_name': img.uri,
            'photo_content': img.base64,
            'text': postText,

        };
        setSendingRequest(true);
        axios.post('http://b25c802f.ngrok.io/api/upload-post', data, {
            headers: {
                'Authorization': 'Bearer pXqVE7BR98FQnpb2zTs3kyVSCg1crnXRazblWlemovbNaY6ma5wPOcJNcK2BYmaLTZ3eveHWzCO411P8',
            },
        }).then((response) => {
            console.log(response.data);
            props.navigation.navigate('Feed');
        }).finally(() => {
            setSendingRequest(false);
        });
    };

    const photoScreen = props => {
        return <View style={styles.container}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{uri: img.uri}} style={{width: '100%', height: '100%'}}/>
            </View>
            <TouchableOpacity style={styles.backContainer}>
                <Icon name="long-arrow-left" color={'#22ddee'} size={40}/>
            </TouchableOpacity>
            <View style={styles.writeTextContainer}>
                <TextInput style={styles.textInput}
                           onChangeText={(text) => {
                               setPostText(text);
                           }}
                           placeholder="Write your text here ..."
                           multiline={true}
                           numberOfLines={4}
                />
                <Button style={styles.submitButton} onPress={uploadPost} disabled={sendingRequest}
                        title={!sendingRequest ? 'Submit' : 'Submitting...'}/>
            </View>

        </View>;
    };

    const cameraScreen = props => {
        return <View style={styles.container}>
            <RNCamera
                ref={ref => {
                    setCamera(ref);
                }}
                style={styles.preview}
                type={RNCamera.Constants.Type.back}
                androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                }}
            />
            <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress={takePicture.bind(this)} style={styles.capture}>
                    <Text style={{fontSize: 14}}> SNAP </Text>
                </TouchableOpacity>
            </View>
        </View>;
    };


    return (
        <View style={styles.container}>
            {
                !img
                    ? cameraScreen()
                    : photoScreen()
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        marginLeft: 30,
        marginTop: 20,
        borderRadius: 5,
        paddingVertical: 0,
        paddingHorizontal: 15,
        backgroundColor: 'white',
    },
    writeTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    backText: {},
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        flex: 4,
    },
    submitButton: {
        flex: 1,
    },
});

export default TakePhotoScreen;
