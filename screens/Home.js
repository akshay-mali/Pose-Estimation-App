import React, { useContext, useState } from 'react'
import { View , Text, StyleSheet, Button, Image, ScrollView} from 'react-native'
import {AuthContext} from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';

import ImgToBase64 from 'react-native-image-base64';

import * as ImagePicker from 'react-native-image-picker';

function Home() {
  const {user} = useContext(AuthContext);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [errImg, setErrImg] = useState(null);

  const [error, setError] = useState('');

  const handleChoosePhoto1 = () => {
    const options = {mediaType : 'photo'};
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log("response", response);
      if(response.uri){
        setPhoto1(response);
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {setImage1(base64String)})
          .catch(err => console.log(err));
      }
    })
  }

  const handleChoosePhoto2 = () => {
    const options = {mediaType : 'photo'};
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log("response", response);
      if(response.uri){
        setPhoto2(response);
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {setImage2(base64String);})
          .catch(err => console.log(err));
      }
    })
  }

  // Handle Upload
  const handleUpload = () => {
    if(!(photo1 && photo2)){
      setError("You need to upload both images");
      return
    }
    setError('');
    var mystrings = [];
    mystrings[0] = image1;
    mystrings[1] = image2;

    var formdata = new FormData();
    formdata.append('javascript_data', JSON.stringify({
      'images': mystrings
    }));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formdata,
    };

    fetch('https://posestimation.pythonanywhere.com/comparejs', requestOptions)
        .then(async response => {
            const data = await response.text();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            
            var result = JSON.parse(data)
            setImg1(result.Image1);
            setImg2(result.Image2);
            setErrImg(result.ErrorImage)
            console.log(result.Match);
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            console.log('There was an error!', error.toString());
        });  
  }
  return (
    <ScrollView>
      <View style={styles.container}>
          <Text>Home Screen</Text>
          <Text>{user.uid}</Text>

          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
            <View style={{margin: 2}}>
              {
                photo1 && (
                  <Image source={{uri: photo1.uri}} style={{width: 200, height: 200}} />
                )
              }
              <Button 
                title = "Chooose Photo1"
                onPress = {() => handleChoosePhoto1()}
              />
              {
                img1 && (
                  <Image source={{uri: img1}} style={{width: 200, height: 200}} />
                )
              }
            </View>
            <View style={{margin: 2}}>
              {
                photo2 && (
                  <Image source={{uri: photo2.uri}} style={{width: 200, height: 200}} />
                )
              }
              <Button 
                title = "Chooose Photo2"
                onPress = {() => handleChoosePhoto2()}
              />
              {
                img2 && (
                  <Image source={{uri: img2}} style={{width: 200, height: 200}} />
                )
              }
            </View>
          </View>
          {
            errImg && (
              <Image source={{uri: errImg}} style={{width: 200, height: 200}} />
            )
          }
          <Text>{error}</Text>
          <FormButton 
            buttonTitle="Upload Images"
            onPress={() => handleUpload()}
          />
      </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });


export default Home
