import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { replaceImageForDrink, copyImageFromCache } from './RecipeBook';

export function ScreenCameraAddImage({navigation, route}) {
  const [hasPermission, setHasPermission ] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(undefined);
  const newImageCacheUri = useRef(undefined);

  //get permission just once
  useEffect(() => {
    (async () => {
      // status will be 'granted', 'denied' or 'error'
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    //this means permission hasn't yet been granted or denied
    // perhaps better here is a loading indicator or a different screen
    return (
      <View />
    );
  } else if (hasPermission === false) {
    // permission has been denied. Keep in mind that there are situations where
    // the user might not even get promted to allow the camera permission, instead
    // it is automatically denied. For example a phone with child locks on for the
    // camera. Or a business phone where the company has blocked use of the Camera
    // The denied permission state is therefore and important one to consider what
    // to display.
    return (
      <Text>Access to camera is denied</Text>
      // good to guide user here on how to change the permission in their settings
    );
  } else {
    // we have permission.
    // You might notice on android the ratio is incorrect. Need to use
    // getSupportedRatiosAsync() to find the available ratios and set this
    // in the Camera component with the 'ratio' property. It gets a little tricky
    // because you also need to know the screen ratio to pick the best camera
    // ratio.
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={cameraType}
          //ratio hard coded for my galaxyS20 - not ideal solution
          ratio="20:9"
          onCameraReady={() => setCameraReady(true)}
          ref = {cameraRef}
        >
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setCameraType(
                cameraType === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Ionicons name="camera-reverse-outline" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={async () => {
              let image = await cameraRef.current.takePictureAsync();
              // let newImageUri = await replaceImageForDrink(route.params.drinkId, newImageCacheUri)
              let newImageUri = await replaceImageForDrink(route.params.drinkId, image.uri);
              navigation.navigate("CocktailDetailRecipeBook", {newImageUri: newImageUri})
            }}
          >
            <Ionicons name="camera-outline" size={28} />
          </TouchableOpacity>
        </Camera>
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
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center"
  },
  flipButton: {
    backgroundColor: "white",
    position: "absolute",
    bottom: "10%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  captureButton: {
    backgroundColor: "white",
    position: "absolute",
    bottom: "25%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  }
});
