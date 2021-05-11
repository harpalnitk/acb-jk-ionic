npm install -g ionic
TO INSTALL IONIC GLOBALLY
ionic start
FROM WEBSPHERE PROJECTS FOLDER TO CREATE A NEW IONIC PROJECT
GIVE NAME TO PROJECT
ionic-angular-course
CHOOSE A TEMPLATE e.g. blank
and then CD to the newly created directory cd ionic-angular-course/
AND RUN COMMAND
ionic serve TO LAUNCH YOUR APP


/////////////////////////////////////////////
CORE BUILDING BLOCKS OF IONIC APP

1. UI COMPONENTS: ION-CARD,ION-IMAGE
2.THEMES AND STYLES: CSS AND CSS VARIABLES
3. NAVIGATION: CUSTOM OR BUILT IN ROUTER
4.STATE MANAGEMENT: PASSING DATA AROUND
5.NATIVE DVICE FEATURES: CAMERA
6. IONIC CLI AND PUBLISHING: FROM DEVELOPMENT TO DEPLOYMENT
///////////////////////////////////////
IONIC COMPONENT UNDER THE HOOD

<ION-BUTTON>
1. HTML <BUTTON><SPAN></SPAN><BUTTON>
2. CSS .button-native { color:}
3. JAVA SCRIPT: ONcLICK(EVENT)

uNDER THE HOOD IT ALSO USES A TECHNIQUE CALLED
Shadow DOM and CSS Variables which helps in encapsulating the styles of 
the component so that styling applied to the elements in
in this component doesn't spill over to your app
 or to other components
 IONIC WEB COMPONENTS AUTOMATICALLY LOAD ANY POLYFILL
 THAT MIGHT BE REQUIRED FOR THEM TO RUN
 ON OLDER BROWSERS

 TOOL CALLED STENCIL IS USED BY THE IONIC TEAM TO BUILD THESE
 COMPONENTS
 IN GITHUB REPOSITORY OF IONIC
 DO TO : master/core/src/components/button/button.tsx file to see the stencil 
 code on how to create a web component

 ////////////////////////////////////////////////////////
LAZY LOADING: IMPORTANT LESSON  
 /////////////////////////////////////////////////////////
 while using lazy loading inside lazy loading each lazy loaded module must have it's own
 routing module file and module file
 ///////////////////////////////////////////////////////
 ion-grid vs ion-list

 ion-list can only have ion-items inside it
 ion-list can be wrapped inside ion-grid to control it's size


 ion-label vs ion-items 

 ion-label is generallu used inside ion-item for 
 wrapping text


 /////////////////////////////////////
 STYLING IONIC APP////
 //////////////////////////////////////
 in src->app->theme->variable.scss you can change default theme Variables
variables starting with 
IMPORTANT
--(two dashes are CSS variables and not scss variables)



any global style should be set in the global.scss file in the 
app folder

to set the color of toolbar of all the pages
go to variables.scss file and add

--ion-toolbar-background

/////////////////////////////////////////////////////
CONNECTING TO FIREBASE BACKEND
///////////////////////////////////////////////////
GO TO FIREBASE CONSOLE https://console.firebase.google.com/
AND CREATE A NEW PROJECT
IN THIS PROJECT I ADDED GOOGLE ANALYTICS ALSO WITH NAME: harpalnitk
click on real-time-database
click on create database
choose start in test-mode
 database will have this URL
 https://ionic-angular-course-cf93d.firebaseio.com/

  add HttpClientModule to app.module.ts imports
  import {HttpClientModule} from '@angular/common/http';

      // in the firebase database-> rules add this{
    //     "rules": {
    //       ".read": "now < 1601058600000",  // 2020-9-26
    //       ".write": "now < 1601058600000",  // 2020-9-26
    //         "bookings":{
    //           ".indexOn": ["userId"]
    //         }
    //     }
    //   }
    // To search by UserId

    ///////////////////////////////////////////////////////
    GOOGLE MAP API 
    //////////////////////////////////////////////////////
    search for google maps javascript API in google and go to the page 
    inside the page click on get an API key

    key for PWgram project: AIzaSyCns0MnByiMXnz6dJ2EcBBRn-fi8CakjgI

    key for ionic-angular-course project: AIzaSyDt_xtRKEoUBPJ6fdGv7-_licPd0_XzZ9o 


    <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
  type="text/javascript"></script>

  NOTE: A PACKAGE CALLED ANGULAR GOOGLE MAPS CAN ALSO BE USED 
  BUT IN THIS PROJECT WE WILL BE DIRECTLY CHANGHING DOM FROM 
  INSIDE OUR TYPESCRIPT FILE WHICH IS NOT RECOMMENDED 


  //////////////////////////////////////////////
TO USE IONIC FEATURES IN DESKTOP AS PWA(progressive web app) 
desktop camera and location features
  ////////////////////////////////////////////
  install 
  > npm install --save @ionic/pwa-elements

  add this import in main.ts file
  //for using desktop PWA features of ionic
import { defineCustomElements } from '@ionic/pwa-elements/loader';

and add this line in main.ts file 
// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

////////////////////////////////////////////
To store images on firebase 
///////////////////////////////////////////
install firebase-tools
> npm install -g firebase-tools
RUN
>firebase init 

it will run a CLI based options menu
select only functions 
select your project  (Your project created on Firebase)
select javascript language 
select EsLInt  AS No 

afte that go to functions folder
and install  busboy,cors,uuid,@google-cloud/storage@2.3.4
Note install version2.3.4 of @googel-cloud/storage because installing latest 
version will require node 10 

then make changes in index,js file in functions folder (Write your server functions) 
then go back to main project folder 
and run >firebase deploy to deploy your functions on the firebase server 

in package.json file in functions folder 
change   "engines": {
    "node": "8"
  },

  node version to 8 as node version 9 and above requires you to set up billing 
  account on firebase



  /////////////////////////////////////////
  AFTER ADDING FIREBASE AUTHENTICATION
  ///////////////////////////////////////
  CHANNGE FIREBASE DATABASE RULES FROM 
  {
  "rules": {
    ".read": "now < 1601058600000",  // 2020-9-26
    ".write": "now < 1601058600000",  // 2020-9-26
      "bookings":{
        ".indexOn": ["userId"]
      }
  }
}

TO

{
  "rules": {
    ".read": "auth != null",//"now < 1601058600000",  // 2020-9-26
    ".write": "auth != null",//"now < 1601058600000",  // 2020-9-26
      "bookings":{
        ".indexOn": ["userId"]
      }
  }
}

AND IN FIREBASE STORAGE FROM 

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
      //request.auth != null;
    }
  }
}

TO 

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

CHANGE FIREBASE CLOUD FUNCTION ALSO

for that go to firebase settings-> service accounts
 and click on generate new private key and a file will be downloaded
 save that file in functions folder of your project

 //fbAdmin needed to send auth token to the backend
var serviceAccount = require("./ionic-angular-course-firebase-sdk-key.json");
fbAdmin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ionic-angular-course-cf93d.firebaseio.com"
});

add code for AUTHENTICATION 
and run >firebase deploy
to deploy cloud function again on firebase server

>firebase deploy --only functions 
to deploy only functions on firebase
>firebase deploy --only "functions:listUsers"
To deploy a particular fucntion only

//////////////////////////////
PWA
/////////////////////////////////
To turn your web app into a progressive web app rin the COMMAND
ng add @angular/pwa

It will install following files

C:\Users\HP\Documents\projects\htdocs\ionic-angular-course>ng add @angular/pwa
Your global Angular CLI version (10.0.6) is greater than your local
version (9.1.12). The local Angular CLI version is used.

To disable this warning use "ng config -g cli.warnings.versionMismatch false".
Installing packages for tooling via npm.
Installed packages for tooling via npm.
CREATE ngsw-config.json (620 bytes)
CREATE src/manifest.webmanifest (1330 bytes)
CREATE src/assets/icons/icon-128x128.png (1253 bytes)
CREATE src/assets/icons/icon-144x144.png (1394 bytes)
CREATE src/assets/icons/icon-152x152.png (1427 bytes)
CREATE src/assets/icons/icon-192x192.png (1790 bytes)
CREATE src/assets/icons/icon-384x384.png (3557 bytes)
CREATE src/assets/icons/icon-512x512.png (5008 bytes)
CREATE src/assets/icons/icon-72x72.png (792 bytes)
CREATE src/assets/icons/icon-96x96.png (958 bytes)
UPDATE angular.json (5433 bytes)
UPDATE package.json (1744 bytes)
UPDATE src/app/app.module.ts (1384 bytes)
UPDATE src/index.html (909 bytes)

///////////////////////////////////////
HOST ON FIREBASE
////////////////////////////////////////
run ng buiild --prod
run firebase init 
again and select HOSTING also this time 
use www as public folder 
say yes to single page application 
overwrite index.html file   select no

////////////////////////////////////////////////////////////////
INSTALL @angular/fire and firebase
////////////////////////////////////////////////////////////////
>npm install firebase @angular/fire --save
> npm install @types/firebase --dev

Go to firebase and create a webapp and copy this
firebaseConfig = {
    apiKey: "AIzaSyAnAMhkxN2k7i8HUKQjWKVD8gjYjnDe7DY",
    authDomain: "acb-jk-ionic.firebaseapp.com",
    databaseURL: "https://acb-jk-ionic.firebaseio.com",
    projectId: "acb-jk-ionic",
    storageBucket: "acb-jk-ionic.appspot.com",
    messagingSenderId: "628908872100",
    appId: "1:628908872100:web:31820abd0f9e0dfedc7131",
    measurementId: "G-FYRDCWS7F1"
  }

  and paste in environment.ts file and prod file