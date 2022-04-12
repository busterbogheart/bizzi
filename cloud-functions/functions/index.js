const functions = require("firebase-functions");
const admin = require('firebase-admin');
const {default: fetch} = require("node-fetch");
admin.initializeApp();

const api_key_private = 'pri_b4657fb4c39642878a7f3c5173e98ba4';
const apiLive = `https://besttime.app/api/v1/forecasts/live`;

const log = (msg) => {
	functions.logger.log(msg, {structuredData:true})
}
const err = (msg) => {
	functions.logger.error(msg, {structuredData:true})
}

const fetchOneVenueLive = async(venue_id) => {
	const start = new Date().getTime();
	const params = new URLSearchParams({
	  api_key_private,
	  venue_id: venue_id,
	});
	const res = await fetch(`${apiLive}?${params}`, {method: 'POST'} );
  
	if (!res.ok) {
	  err(`${res.status} >> ${res.statusText}`);
	  throw new Error(JSON.stringify(res,null,1));
	}
  
	const json = await res.json();
	const a = json.analysis;
	const name = json.venue_info.venue_name;
  
	if (a.venue_forecast_busyness_available) {
	  const b = a.venue_forecasted_busyness;
	}
  
	if (a.venue_live_busyness_available) {
	  const b = a.venue_live_busyness;
	  log(`${name} >> live: ${b}`);
	} else {
	  //no live data available
	}
  
	//only means the data didnt return what we were looking for, ie live foot traffic
	if (json.status.toUpperCase() !== 'OK') {
	  //still has json.venue_info, json.analysis, json.message (reason for error)
	  log(`besttime API: ${json.message}\n`);
	}
  
	const cached = res.headers.get('cf-cache-status').replace(/cf-cache-status/g,'');
	const debugTxt = `API call in ${(new Date().getTime() - start)} ms, cached? ${cached}\n\n`;
	log(debugTxt + JSON.stringify(json,null,2));
}

//exports.scheduleTest = functions.pubsub.schedule('every 2 minutes').onRun(async(context) => {
exports.scheduleTest = functions.pubsub.schedule('every 24 hours').onRun(async(context) => {
	
	//find venues that are being tracked by users
	//check with BestTime API (look into venues/search for multiple venue live data)
	//associate with respective users (multiple venues per user, multiple users for one venue)
	//
	
	const start = new Date().getTime();
	await fetchOneVenueLive('ven_77625874356a7079514f6c526b49726b6a7931307a66714a496843');
	const myandroidtoken = 'cwZIlq7sTZiAWtoF1GGuD7:APA91bEVpVG08lDWZxWercT6YwQ3tBY9W-3zNLhCBaQHDhZdCb364ZioM_-QF_Q0mfR9wLe9pP6I3iBr0y_UYv2WE6oVPpqtRLSy0EBL5tpBNJlWY5z5AMDZpOW1ofhc84dO4-_aW2NO';
	const msg = {
		notification: {
			title: 'Boobs!',
			body: 'Body!',
		}
	}

	const elapsed = `${new Date().getTime() - start} ms`;
	log(`function done in ${elapsed}`);
	//const res = await admin.messaging().sendToDevice(myandroidtoken, msg);
	//log(res);
	
	return null;
});
