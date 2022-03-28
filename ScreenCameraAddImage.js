import React, { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LoadingAnimation } from './LoadingAnimation';
import { useIsFocused } from '@react-navigation/native';

export function ScreenCameraAddImage({navigation, route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const camera = useRef(undefined);
  const [cameraRatio, setCameraRatio] = useState("1:1");
  const [isRatioSet, setIsRatioSet] = useState(false);

  //get permission just once
  useEffect(() => {
    (async () => {
      // status will be 'granted', 'denied' or 'error'
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  //try to ascertain the best cameraRatio to use if 1:1 is not in the available
  //ratios
  async function setBestRatio(){
    try{
      let ratios = await camera.current.getSupportedRatiosAsync();
      if(!ratios.includes("1:1")){
        let bestRatio = null;
        let bestSelection = ratios[0];
        for(let i in ratios){
          const sides = ratios[i].split(":")
          if(i === 0){
            bestRatio = 1 - abs(sides[0]/sides[1]);
            bestSelection = ratios[i];
          } else if (1 - abs(sides[0]/sides[1]) < bestRatio){
            bestRatio = 1 - abs(sides[0]/sides[1]);
            bestSelection = ratios[i];
          }
        }
        setCameraRatio(bestSelection);
      } else {
        setCameraRatio("1:1")
      }
    } catch (e) {
      console.log("Error encountered setting cameraRatio -> " + e)
    }
    setIsRatioSet(true);
  }

  async function setCameraReady(){
    if(!isRatioSet){
      setBestRatio();
    }
  }

  //build the CameraView with touchable opacity overlayed
  const CameraView = (props) => {
    const isFocused = useIsFocused();
    return (
      <View>
        { isFocused &&
        <Camera
          style={styles.camera}
          type={cameraType}
          //ratio hard coded for my galaxyS20 - not ideal solution
          ratio={cameraRatio}
          onCameraReady={() => setCameraReady()}
          ref = {camera}
        >
          { isRatioSet &&
          <TouchableOpacity
            style={styles.captureButton}
            onPress={async () => {
              camera.current.takePictureAsync()
              .then((image) => (
                navigation.navigate("RecipeBookScreenStack", {screen: "ScreenReviewCocktailImage", params: {drinkId: route.params.drinkId, image: image}})
              )
            )}}
          >
            <Ionicons name="camera-outline" size={28} />
          </TouchableOpacity>
        }
        </Camera>
        }
      </View>
    )
  }


  if (hasPermission === null) {
    //this means permission hasn't yet been granted or denied
    // perhaps better here is a loading indicator or a different screen
    return (
      <LoadingAnimation
        loadingMessage="Accessing camera"
        style={{width: 200, height: 200}}
      />
    );
  } else if (hasPermission === false) {
    // permission has been denied.
    return (
      <Text>Access to camera was denied. Please check your permissions for this app in your device's settings and allow access to the camera.</Text>
    );
  } else {
    return (
      <View style={styles.container}>
        <CameraView />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: "100%",
    aspectRatio: 1,
    alignItems: "center"
  },
  captureButton: {
    backgroundColor: "white",
    position: "absolute",
    bottom: "10%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  }
});
