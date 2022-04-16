const functions = require("firebase-functions");
const admin = require('firebase-admin');
const {getFirestore} = require('firebase-admin/firestore');
const {default: fetch} = require("node-fetch");
admin.initializeApp();

const api_key_private = 'pri_b4657fb4c39642878a7f3c5173e98ba4';
const apiLive = `https://besttime.app/api/v1/forecasts/live`;
const ME = "ETHANKEMP293Meppz"

const log = (msg) => {
	functions.logger.log(msg, {structuredData:true})
}
const err = (msg) => {
	functions.logger.error(msg, {structuredData:true})
}

const fetchOneVenueLive = async(venue_name, venue_address) => {
	log('fetching '+venue_name)
	const start = new Date().getTime();
	const params = new URLSearchParams({
		api_key_private,
	//  venue_id: venue_id,
		venue_name,
		venue_address
	});
	const res = await fetch(`${apiLive}?${params}`, {method: 'POST'} );
	
	if (!res.ok) {
		err(`${res.status} >> ${res.statusText}`);
		throw new Error(JSON.stringify(res,null,1));
	}
	
	const json = await res.json();
	const a = json.analysis;
	const name = json.venue_info.venue_name;
	const live = a.venue_live_busyness_available;
	const forecast = a.venue_forecasted_busyness_available;
  
	//only means the data didnt return what we were looking for, ie live foot traffic
	if (json.status.toUpperCase() !== 'OK') {
	  //still has json.venue_info, json.analysis, json.message (reason for error)
	  log(`besttime API: ${json.message}\n`);
	}
  
	const cached = res.headers.get('cf-cache-status').replace(/cf-cache-status/g,'');
	const debugTxt = `API call in ${(new Date().getTime() - start)} ms, cached? ${cached}\n\n`;
	log(debugTxt + JSON.stringify(json,null,2));
	
	return {
		live: live ? String(a.venue_live_busyness) : 'no live data',
		forecast: forecast ? String(a.venue_forecasted_busyness) : 'no forecast',
		diff: (live && forecast) ? String(a.venue_live_forecasted_delta) : '-',
	}
}

const sendToDevice = async(title, body) => {
	const myandroidtoken = 'cwZIlq7sTZiAWtoF1GGuD7:APA91bEVpVG08lDWZxWercT6YwQ3tBY9W-3zNLhCBaQHDhZdCb364ZioM_-QF_Q0mfR9wLe9pP6I3iBr0y_UYv2WE6oVPpqtRLSy0EBL5tpBNJlWY5z5AMDZpOW1ofhc84dO4-_aW2NO';
	const msg = {
		notification: {
			title,
			body,
		}
	}
	const res = await admin.messaging().sendToDevice(myandroidtoken, msg);
	log(`sent ${res.successCount} successfully`); 
	if (res.failureCount > 0) err('failed to send... ', JSON.stringify(res));
}

exports.scheduleTest = functions.pubsub.schedule('every 5 minutes').onRun(async(context) => {
//exports.scheduleTest = functions.pubsub.schedule('every 24 hours').onRun(async(context) => {
	
	//find venues that are being tracked by users
	//check with BestTime API (look into venues/search for multiple venue live data)
	//associate with respective users (multiple venues per user, multiple users per venue)

	const db = getFirestore();
	const doc = await db.collection('Users').doc(ME).get();
	const favs = doc.data().favoriteVenues;
	if (favs[0]){
		const name = favs[0].venueName;
		const address = favs[0].venueAddress;
		const data = await fetchOneVenueLive(name, address);
		const title = `${name} (${data.diff})`;
		const body = JSON.stringify(data,null,1);
		sendToDevice(title, body);
	} else log('no favs');
	
	log(`function done`);
	
	return null;
});


