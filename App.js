import React,{useEffect, useState} from 'react';
import {TouchableOpacity,ScrollView,StyleSheet,Text,View} from 'react-native';
import dummyData from './dummydata/all forecasted venues (venues).json';
import MapView from 'react-native-maps';

const App = () => {
  const api_key_private = 'pri_b4657fb4c39642878a7f3c5173e98ba4';
  const api_key_public = 'pub_22e7ca71acc94b06907bde1b660f45a1';
  const google_api_key = 'AIzaSyDZ7TVAJGAhwA-3kUyZd943wuv_PwaLwRY';
  const [res,setRes] = useState();

  //previously forecasts venues
  const apiVenueForecasted = 'https://besttime.app/api/v1/venues';
  const apiDebug = `https://besttime.app/api/v1/keys/${api_key_private}`;
  const venueGoldenPizza = 'ven_73373477642d7939674846526b49726d375a656d4f63634a496843';

  useEffect(() => {
    
  }, [])

  
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
  
  // for mobile prototype:
  // subscribe to a venue found by googlemaps
  // set different alerts

  return (
    <>
      <View style={{flex:1}}>
        <TouchableOpacity style={styles.button} onPress={() => fetchApiDebug()}>
          <Text>API key debug</Text>
        </TouchableOpacity>
        <ScrollView className='code'><Text>{res}</Text></ScrollView>
      </View>
      
      <MapView 
        style={{flex:1, backgroundColor:'#f0f'}}
        region={{
         latitude: 35,
         longitude: -78,
         latitudeDelta: .2,
         longitudeDelta: .2,
       }}
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