import React,{useEffect, useRef, useState} from 'react';
import {TouchableOpacity,ScrollView,StyleSheet,Text,View, PermissionsAndroid, ToastAndroid} from 'react-native';
import GoogleMapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import messaging from '@react-native-firebase/messaging';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';



const App = () => {
  const api_key_private = 'pri_b4657fb4c39642878a7f3c5173e98ba4';
  const api_key_public = 'pub_22e7ca71acc94b06907bde1b660f45a1';
  const google_api_key = 'AIzaSyCJ_UmDSelhqP0JZn-T-rG4tXR5fNy9Agc';
  const googlePlacesRef = useRef();
  const [currentRegion, setCurrentRegion] = useState({latitude:39,longitude:-97,latitudeDelta:45,longitudeDelta:45});
  const [currentVenue, setCurrentVenue] = useState();
  const [meDoc, setMeDoc] = useState();
  const [numFavs, setNumFavs] = useState(0);
  const apiVenueForecasted = 'https://besttime.app/api/v1/venues';
  const apiDebug = `https://besttime.app/api/v1/keys/${api_key_private}`;
  const venueGoldenPizza = 'ven_73373477642d7939674846526b49726d375a656d4f63634a496843';
  const ME = "ETHANKEMP293Meppz"
  const coordDeltas = {latitudeDelta: .1, longitudeDelta: .1};

  useEffect(() => {
    //const userId = auth().currentUser.uid;
    
    const init = async() => {
      Geocoder.init(google_api_key);
      await signInAnonymously();
      await firestoreInit();
      await setUserLocation();
      //const FCMtoken = await messaging().getToken();
    }
    init();
  }, [])

  
  const firestoreInit = async() => {
    setMeDoc(firestore().collection('Users').doc(ME));
    const user = await firestore().collection('Users').doc(ME).get();
    const favs = user.get('favoriteVenues');
    setNumFavs(favs.length)
    console.log(`got user favs`, favs)
  }
  
  const signInAnonymously = async() => {
    await firebase.auth().signInAnonymously()
    .then(() => {console.debug('user signed in anon')})
    .catch(e => {
      console.error('unable to auth anon, trying again',e);
      firebase.auth().signInAnonymously()
        .then(() => console.error('unable to auth anon, second time'))
    });
  }
  
  const mapClick = async(data) => {
    console.log(data);
    const coords = data.coordinate;
    const w = await Geocoder.from(coords);
    const add = w.results[0].formatted_address;
    ToastAndroid.show(add, ToastAndroid.SHORT);
    console.log(JSON.stringify(add))    
  }
  
  const setUserLocation = async() => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {});
    if(granted){
      Geolocation.getCurrentPosition(pos => setCurrentRegion({...{
        latitude:pos.coords.latitude,
        longitude:pos.coords.longitude,
      }, ...coordDeltas}));
      console.log(`set pos ${JSON.stringify(currentRegion)}`)
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

    //setRes(callTime+JSON.stringify(json,null,2));
  }

  const clearFavorites = () => {
    meDoc.update({favoriteVenues: []});
    setNumFavs(0)
  }
  
  const onGooglePlacesSubmit = (data, details) => {
    //console.log('data', JSON.stringify(data)); 
    //console.log('\n\ndetails', JSON.stringify(details));
    const coords = details.geometry.location;
    const venueName = details.name;
    const venueAddress = details.formatted_address;
    const venue = {venueName, venueAddress};
    ToastAndroid.show(JSON.stringify(venue), ToastAndroid.LONG);
    setCurrentVenue(venue);
    setCurrentRegion({...{latitude:coords.lat, longitude:coords.lng}, ...coordDeltas});
    console.log(`setting current venue: ${venueName, venueAddress}`);
  }

  const trackCurrentVenue = async() => {
    console.log(currentVenue);
    await meDoc.update({favoriteVenues: firestore.FieldValue.arrayUnion(currentVenue)})
    ToastAndroid.show(`tracking ${currentVenue.venueName}`, ToastAndroid.SHORT);
    const user = await firestore().collection('Users').doc(ME).get();
    const favs = user.get('favoriteVenues');
    setNumFavs(favs.length)
  }
  
  const GooglePlaces = () =>
    <GooglePlacesAutocomplete 
      placeholder="Search for places"
      onPress={onGooglePlacesSubmit}
      onFail={err=>console.error(err)}
      autoFocus={true}
      ref={googlePlacesRef}
      renderRightButton={() => <TouchableOpacity style={{justifyContent:'center'}} onPress={() => {console.log(googlePlacesRef.current.clear())}}><Text style={{fontSize:35, lineHeight:35, fontWeight:'900', paddingLeft:16, paddingRight:15}}>×</Text></TouchableOpacity>}
      fetchDetails
      keyboardShouldPersistTaps="handled"
      styles={{
        textInputContainer: {
          backgroundColor: '#000',
          color: '#40c',
          padding: 7,
        },
        textInput: {
          height: 35,
          color: '#40c'
        },
        listView: {
        },
        description: {
          color: '#40c',
          backgroundColor: '#ffd',
          
        }
      }}
      query={{
        key: google_api_key,
        language: 'en',
      }}
  />;
  
  const Map = ({children}) =>
    <GoogleMapView 
      style={{height:300, backgroundColor:'#f0f'}}
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
      region={currentRegion}
    >{children}</GoogleMapView>;
  
  
  return (
    <>
      <GooglePlaces />
      <Map>
        <Marker
          title="im here"
          description="additional fuckin details"
          coordinate={currentRegion}
          pinColor={'#9fa'}
          >
        </Marker>
      </Map>
      
      <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
        <TouchableOpacity style={styles.button} onPress={() => trackCurrentVenue()}>
          <Text>track venue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={clearFavorites}>
          <Text>clear favorites ({numFavs})</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    marginVertical: 5,
    width: 110, height:30,
    color: '#fff',
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  }
});


export default App;