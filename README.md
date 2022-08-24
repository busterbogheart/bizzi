
# bizzi
Google "busy times" but with more focused use cases.  BestTime API + Cloud Functions + Firestore + Cloud Messaging running in React Native.


## Pitch, USP
Distinguished from Google 'popular times' feature (and apps that just re-display it) because:
it's built around discovery (?)
it pushes notifications when venues have changed "busyness"
it addresses specific use cases

## Product Development, Guiding Thoughts
must be easy to use, and intuitive
must solve a specific problem
"state the problem narrowly"
who is the customer?  ideal first customer
frequent problems (car buying example)
how intense is the problem?
hold the solution "loosely", and be willing to change it

get a functional protoype out… dont worry about scaling or monetization initially
talk to target customers (interviews, paid?), but be flexible on who those are
MVP– get anyone using the product and see if they get any value out it
MVP is just a base to iterate on
launch something bad quickly!
lean MVP– focus on the highest order problems

motivation (problem) + ability (app) + trigger (reminder, etc)

talk to customers, develop a thesis
listen to their problems, not their solutions.  listen but dig deeper, what job are they trying to accomplish?
rapid prototyping, build a solution
test the solution
did it work?  if not goto 1

figure out the story customers will tell at the dinner table; how to make them talk about the product


## Next Steps
It has to work.
build common use cases and test them in the real world
build scheduler to test accuracy and timing of notifications:  
1) call API every X minutes with user's subscribed venue_ids
2) filter out based on user's notification preferences ie busyness level and timeframes?
3) notify if any pass
(save API credits by consolidating venue ids, then sending notifications)


build a mobile prototype for my own use
understand what all the relative metrics mean in real life

setting up subscription must involve looking at forecasts– if user wants 20% busyness it might be too rare, etc (more setting of expectations)

see similar apps, why they failed, what the feedback is
user interviews

## User Interviews
do it at every stage
talk about their life, not the product, and be specific.  listen, don't talk
"when is the last time you had this problem?"
"what have you tried to solve the problem?"
"what don't you love about the solutions you've tried?"
take notes, keep it casual, be careful with their time
how large is their budget?
be in love with the problem and customer, treat the problem in a way that can change

questions to ask:
comparison of features– live view, subscriptions, explore mode

### Summarized
What has worked or not worked?
Ask management to get more cashiers
Go early, or 2 hours before store closes
Self-checkout
"I tried making reservations at Texas Roadhouse... they were full, hour wait, I decided to try Red Robin. They were also full and it was over an hour wait so I ended up going to a Hibachi Grill."
I leave the place, wasting time
Try to go when you think people are at work
Download the restaurant's app, but then it's just a digital line!
Go early in the morning, or late (off-peak)
Or don't go at all
Curbside, pickup, delivery
Buy online
Calling ahead

Most frustrating places?
Harris Teeter, Walmart, Sheetz, McDonalds, grocery store, gas, Target, gamestop, groceries, restaurants, sports, concerts

Why is it hard?
Impatient, time crunch, physical pain, frustration, wasting time, 

Other data
Google "busy times" are not accurate (reporting not busy but actually busy)
Sometimes they go to another location, if there is one, but usually it's just as busy

## Research
app name:  crowd avoid, no waiting, nowait, no lines, howbusy, busyness (taken for iOS), KnowCrowds, crowd aware, people aware, BIZZI
domains:  nowaiting.app, nolinesplease.com, nocrowds.app, howbusy.app, knowcrowds.app, bizzi.app
nowait.com bought by Yelp, "guest manager" requiring opt-in from businesses, line system etc

shouldn't be restricted to hating lines… or not waiting, sometimes you want a crowd – but should focus on one thing?

Family Feud: name a place youd visit more often if it wasnt so crowded: mall, zoo, bar/club, disney, beach, park

angle for businesses– fill their slow times; spread out the crowd
busy neighborhoods in general?  for scouting a place to live (loud vs busy) 
drink reps/promoters looking for busy spots
just moved to a new city?  find spots.  which spots?  doesnt foursquare/yelp/etc do this?  people searching for highly rated or popular places vs people wanting to avoid wait times
while traveling through, stopping into cities
THE GOOGLE/BESTTIME DATA IS RELATIVE– how to communicate this?  Set expectations!  "quieter than normal" could still be fairly busy relative to other places.  It's relative to that one location's historical data.  
Google: "Popular times are based on average popularity over the last few months. Predicted popularity for any given hour is shown relative to the typical peak popularity for the business for the week. "  What does this mean for live data?  Is it also relative to the peak for the week?  Or for that hour?

Besttimes:  "The [live foot traffic] response includes information regarding the live busyness at this moment compared to the forecasted busyness of the corresponding hour." 
but also
"Live busyness at the venue for current, based on the weekly forecast.
In most cases, the live percentage will be between 0% and 100%. However, a value above 100% means it is busier than the highest forecasted peak of the week. E.g. 200% meaning it is two times as busy as the normal forecasted peak (100%) of the week.  "

If the foot traffic forecast e.g. says it will be 70%, but the live data says it is currently 90%, it means that it is currently approximately 20% more busy than usual for this hour of the week.

disclaimer about busyness correlating to wait times; sit down vs drive through etc

## User Stories
Find the least busy gym in the area (chain)
See how busy my gym is right now (live, favorite)
Find the least busy fast food in the area (venue type)
Track a favorite Trader Joe's location (one venue)
Track a favorite Trader Joe's within a certain time period
See how busy an airport is right now

## Features - User
### Primary
shortcuts for most common use cases like least busy gyms & fast food, gas stations, public transit, dining, coffee/tea, groceries (Trader Joes, Costco), museums, parks, other shopping (Target), mall, 7-11, theme parks, DMV, airport, beach, mechanic
notify when quiet after being busy, "no one else is monitoring", "there are others waiting too" (watch, monitor, track).  Solution->stagger?  Can be one-time or a subscribe type (aka favorite) until removed, can be within certain timeframes, certain busyness.  at higher usage could eventually cause a bottleneck, a self fulfilling/perpetuating prophecy.  Variations on this feature:
alert once when venue is a certain busyness
alert during specific timeframes S-S 00:00-24:00 when a venue is a certain busyness
explore mode: nearby hot spots, nearby quiet spots (only good reviews?  aka make good recommendations)

### Secondary
least busy one of [type of restaurant, type of place, specific chain]
multiple searches like "[food, gas] within 10 miles not busy" or "busiest spots in my area" (relative to each other)
one-click share on social ("no lines at Cookout!!!", pre-filled options based on recent activity/reason for search), share via SMS etc
save favorite places, options to query all favorite places at once, options to subscribe
on venue detail page: hours, most people leave time, least busy day, least busy time today, live, uber/lyft

start with one feature?  =>  alerts on specific venues.

"was Bizzi right about the crowd level?"   😁  /  😢       👍  / 👎  
keep it general and let the common use cases float to the top?
see LineScouts– shows all the grocery venues in the user's area at a glance how busy they are red/green/orange

make feedback easy

Other
"find an alternative" when you're already at a crowded place?  also from the venue's detail page
easy link to similar & nearby venues:  when current result is too busy or otherwise not what they're looking for

besttime has "automatically curated city guides"

how to deal with COVID testing related waiting times?  must be accurate– so must come from a different source

besttime only updates "live" status if it's more or less busy than normal

be aware of places closed permanently, recently opened, recently closed, etc

voice controlled

clear link to directions



besttime has a natural language search endpoint "quiet restaurants tonight with high reviews", "quiet tourist spot this morning around me", "places not likely to be busy in an hour", "is Trader Joe's busy?", "quiet places right now"

COVID implications– people want to avoid other people

i18n

"discover quiet places nearby"-- about solitude?  or discovering a well-reviewed venue that is abnormally quiet?


## Features - Tech
tracking to see if features are used
tracking to get data on common use cases; suggest popular ones programatically; build autocomplete database
preload users data based on previous searches
tracking of failures (different kinds: server errors, venue searches with zero or bad results, natural language searches that aren't supported)

Some sort of job to refresh most used forecast regions (offline)
accept deep links from Yelp, Happy Cow, etc?  some sort of integration with existing user's apps

Typescript, Jest

API retries for >1500ms

## UX/UI
design UX around most common use cases.  how to find those?  interviews, keyword searches, twitter,etc
different ways to present on home screen– grouped by intention (quiet v busy), grouped by venue type (bar v store v food), grouped by ?

simple fill in the blank style interface?  "find a __ that's __ near me"

colors and design should suggest: friendly, easy, calm? (opposite of stressful)


## Monetization
free to use, then upgrade to subscription
different features have different costs per use… how "free" could a user be and still experience the app?
higher tier API plans have better cost per month, absolute vs relative

value should feel like 10X the price
cost / price / value (cost plus pricing NO, value based pricing YES)

## Marketing
like/share tweets and ig, sms
watermark shares
go after early adopters
snapchat geofilter

## Besttime API
Overview
Forecasts are slow, and stored on the BT server and realistically useful for a few weeks (recommendation is 2-4 weeks).  Deleted automatically after a year.  This doesn't mean they are free!  Still 2 credits to fetch.  (Check this because it returned new forecasting data as if running api/v1/update)    CHECK ALL THIS AGAIN
Gives hour, day, week forecasts, as well as peaks, surges (up and down), busy hours, and quiet hours.

Queries are fast, and use existing forecasted venues as input.  Can include additional data (like time until quiet/busy hours).   No queries get live data (this makes sense because it uses existing forecasts which is past data).

