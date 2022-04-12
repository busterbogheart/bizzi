import React,{useEffect, useState} from 'react';
import {TouchableOpacity,ScrollView,StyleSheet,Text,View, PermissionsAndroid} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';


const App = () => {
  const api_key_private = 'pri_b4657fb4c39642878a7f3c5173e98ba4';
  const api_key_public = 'pub_22e7ca71acc94b06907bde1b660f45a1';
  const google_api_key = 'AIzaSyCJ_UmDSelhqP0JZn-T-rG4tXR5fNy9Agc';
  const [res,setRes] = useState();
  const [userCoordinates, setUserCoordinates] = useState({latitude:39,longitude:-97,latitudeDelta:45,longitudeDelta:45});

  //previously forecasts venues
  const apiVenueForecasted = 'https://besttime.app/api/v1/venues';
  const apiDebug = `https://besttime.app/api/v1/keys/${api_key_private}`;
  const venueGoldenPizza = 'ven_73373477642d7939674846526b49726d375a656d4f63634a496843';

  useEffect(() => {
    //const userId = auth().currentUser.uid;
    Geocoder.init(google_api_key);
    
    const init = async() => {
      await setUserLocation();
      const FCMtoken = await messaging().getToken();
    }
    init();
  }, [])

  const mapClick = async(data) => {
    console.log(data);
    const coords = data.coordinate;
    const w = await Geocoder.from(coords);
    console.log(JSON.stringify(w.results[0].formatted_address))    
  }
  
  const setUserLocation = async() => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {});
    if(granted){
      Geolocation.getCurrentPosition(pos => setUserCoordinates({
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude,
        latitudeDelta: .1,
        longitudeDelta: .1,
      }));
      console.log(`set pos ${JSON.stringify(userCoordinates)}`)
    }
  }
  
  const fetchIt = async (endPoint,params,method) => {
    const start = new Date().getTime();
    const plain = Object.keys(params).length == 0;
    const url = `${endPoint}${plain ? '': `?${params}`}`;
    const res = await fetch(
      url, {method}
    );
    const json = await res.json();
    const cached = res.headers.get('cf-cache-status').replace(/cf-cache-status/g,'');
    let debugTxt = `API call in ${(new Date().getTime() - start)} ms, CDN cached? ${cached}\n`;
    debugTxt += `full url: ${url}\n\n${JSON.stringify(json,null,2)}`;
    console.log(debugTxt);
    setRes(debugTxt);
  }
  
  const fetchApiDebug = async () => {
    const start = new Date().getTime();
    const res = await fetch(
      apiDebug,
      {method: 'GET'}
    );
    const json = await res.json();
    const callTime = `API call in ${(new Date().getTime() - start)} ms\n`;

    setRes(callTime+JSON.stringify(json,null,2));
  }

  const fetchApiOneVenue = async () => {
    const start = new Date().getTime();
    const params = new URLSearchParams({
      api_key_public,
    });
    const res = await fetch(
      `${apiVenueForecasted}/${venueGoldenPizza}?${params}`,
      {method: 'GET'}
    );
    const json = await res.json();
    const cached = res.headers.map['cf-cache-status'].replace(/cf-cache-status/g,'');
    const callTime = `API call in ${(new Date().getTime() - start)} ms, cached? ${cached}\n`;

    setRes(callTime+JSON.stringify(json,null,2));
  }
  
  
  return (
    <>
      <View style={{flex:1}}>
        <TouchableOpacity style={styles.button} onPress={() => fetchApiDebug()}>
          <Text>API key debug</Text>
        </TouchableOpacity>
        <ScrollView className='code'><Text>{res}</Text></ScrollView>
      </View>
      
      <MapView 
        style={{flex:2, backgroundColor:'#f0f'}}
        //mapPadding={{top:30,left:30,right:30,bottom:40}}
        toolbarEnabled
        loadingEnabled
        showsBuildings
        showsPointsOfInterest
        showsCompass
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        onPress={e => mapClick(e.nativeEvent)}
        onPoiClick={e => mapClick(e.nativeEvent)}
        region={userCoordinates}
      />
    </>
  );
};


const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    marginVertical: 10,
    backgroundColor: '#666',
    alignItems: 'center'
  }
});


export default App;