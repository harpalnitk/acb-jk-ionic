//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');
//const uuid = require('uuid');

const { v4: uuidv4 } = require('uuid');
//uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const fbAdmin = require('firebase-admin');

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'acb-jk-ionic'
});

//fbAdmin needed to send auth token to the backend
var serviceAccount = require("./acb-jk-ionic-firebase-sdk-key.json");
fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount),
  databaseURL: "https://acb-jk-ionic.firebaseio.com"
});

console.log('fbAdmin initialized');

exports.storeImage = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({ message: 'Not allowed.' });
    }
    //new code for authorization
    console.log('Before checking for authorization in the function');
if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
  console.log('req.header',req.headers);
  console.log('req.header authorization',req.headers.authorization);
return res.status(401).json({error: 'Unauthorized'});
}
let idToken;
//splitting the string from 'Bearer ' and then getting the value after that portion
// which will be token
idToken = req.headers.authorization.split('Bearer ')[1];

    const busboy = new Busboy({ headers: req.headers });
    let uploadData;
    let oldImagePath;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filePath = path.join(os.tmpdir(), filename);
      uploadData = { filePath: filePath, type: mimetype, name: filename };
      file.pipe(fs.createWriteStream(filePath));
    });

    busboy.on('field', (fieldname, value) => {
      oldImagePath = decodeURIComponent(value);
    });

    busboy.on('finish', () => {
      const id = uuidv4();
      let imagePath = 'images/' + id + '-' + uploadData.name;
      if (oldImagePath) {
        imagePath = oldImagePath;
      }

      //new code for authorization
      return fbAdmin.auth().verifyIdToken(idToken).then(decodedToken => {
        console.log('decodedToken', decodedToken);
        console.log(uploadData.type);
        return storage
          .bucket('acb-jk-ionic.appspot.com')
          .upload(uploadData.filePath, {
            uploadType: 'media',
            destination: imagePath,
            metadata: {
              metadata: {
                contentType: uploadData.type,
                firebaseStorageDownloadTokens: id
              }
            }
          })
      }).then(() => {
          return res.status(201).json({
            imageUrl:
              'https://firebasestorage.googleapis.com/v0/b/' +
              storage.bucket('acb-jk-ionic.appspot.com').name +
              '/o/' +
              encodeURIComponent(imagePath) +
              '?alt=media&token=' +
              id,
            imagePath: imagePath
          });
        })
        .catch(error => {
          console.log(error);
          return res.status(401).json({ error: 'Unauthorized!' });
        });
    });
    return busboy.end(req.rawBody);
  });
});








exports.listUsers = functions.https.onRequest((req, res) => {
  console.log('Inside listUsers method');
  return cors(req, res, () => {
    if (req.method !== 'GET') {
      return res.status(500).json({ message: 'Not allowed.' });
    }
    //Check user authentication
    console.log('req.header',req.headers);
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({error: 'Unauthorized'});
    }
    let idToken;
    let nextPageToken;
    let resultSize = 100;

        idToken = req.headers.authorization.split('Bearer ')[1];
        //Check query params
        if(req.query) {
          console.log('Query',req.query);
          if(req.query.nextPageToken){
            console.log('nextPageToken',req.query.nextPageToken);
            nextPageToken = req.query.nextPageToken === 'undefined' ? null : req.query.nextPageToken;
            console.log('nextPageToken',nextPageToken);
          }
          if(req.query.resultSize){
            resultSize = parseInt(req.query.resultSize);
            console.log('resultSize',resultSize);
          }

        }
    
    return fbAdmin.auth().verifyIdToken(idToken).then(decodedToken => {
      //console.log('decodedToken', decodedToken);
if(nextPageToken){
  // If tokenFrom is provided i.e. next set of results in userList
  console.log('nextPageToken is present', nextPageToken);
  return fbAdmin.auth().listUsers(resultSize,nextPageToken)
  .then(function(listUsersResult) {
    let users = [];
    listUsersResult.users.forEach(function(userRecord) {
     
     // console.log('userRecord', userRecord);
     // console.log('userRecord.toJSON()', userRecord.toJSON());
      let jsonUser = userRecord.toJSON();
      users.push({
        uid: jsonUser.uid,
         email: jsonUser.email,
          displayName: jsonUser.displayName,
           photoURL: jsonUser.photoURL,
            disabled: jsonUser.disabled 
          });
    });
    let pageToken = listUsersResult.pageToken;
    console.log('pageToken', pageToken);
    return {'users' : users, 'pageToken' : pageToken};
  })
  .catch(function(error) {
    console.log('Error listing users:', error);
    return res.status(400).json({ message: 'Error listing users', 'error' : error });
  });
}else {
   // If tokenFrom is not provided i.e. next set of results in userList
  return fbAdmin.auth().listUsers(resultSize)
  .then(function(listUsersResult) {
    let users = [];
    listUsersResult.users.forEach(function(userRecord) {
     
     // console.log('userRecord', userRecord);
     // console.log('userRecord.toJSON()', userRecord.toJSON());
      let jsonUser = userRecord.toJSON();
      users.push({
        uid: jsonUser.uid,
         email: jsonUser.email,
          displayName: jsonUser.displayName,
           photoURL: jsonUser.photoURL,
            disabled: jsonUser.disabled 
          });
    });
    let pageToken = listUsersResult.pageToken;
    console.log('pageToken', pageToken);
    return {'users' : users, 'pageToken' : pageToken};
  })
  .catch(function(error) {
    console.log('Error listing users:', error);
    return res.status(400).json({ message: 'Error listing users', 'error' : error });
  });

}
    }
    ).then(value => {
      console.log('users before sending Json response', value);
      return res.status(201).json(value);
    })
    .catch(error => {
      console.log(error);
      return res.status(401).json({ error: 'Unauthorized!' });
    });
});

  });


  exports.deleteUser = functions.https.onRequest((req, res) => {
    console.log('Inside deleteUser method');
    return cors(req, res, () => {
      if (req.method !== 'DELETE') {
        return res.status(500).json({ message: 'Not allowed.' });
      }
      //Check user authentication
      console.log('req.header',req.headers);
      if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Unauthorized'});
      }
      let idToken;
  
  idToken = req.headers.authorization.split('Bearer ')[1];
  let userId;
          //Check query params
          if(req.query && req.query.userId) {
            userId = req.query.userId;
          }
          console.log('UserId of deleting User', userId);
      
      return fbAdmin.auth().verifyIdToken(idToken).then(decodedToken => {
        //console.log('decodedToken', decodedToken);
        return fbAdmin.auth().deleteUser(userId)
        .then(function() {
          return res.status(201).json({message: 'Success'});
        })
        .catch(function(error) {
          console.log('Error deleting users:', error);
          return res.status(400).json({ message: 'Error deleting user' });
        })
      }
      ).then(res => {
        return res;
      })
      .catch(error => {
        console.log(error);
        return res.status(401).json({ error: 'Unauthorized!' });
      });
  });
    });

    exports.editUser = functions.https.onRequest((req, res) => {
      console.log('Inside editUser method');
      return cors(req, res, () => {
        if (req.method !== 'PATCH') {
          return res.status(500).json({ message: 'Not allowed.' });
        }
        //Check user authentication
        console.log('req.header',req.headers);
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
          return res.status(401).json({error: 'Unauthorized'});
        }
        // console.log('req.body',req.body);
        // console.log('req.body',JSON.parse(req.body));
        // let data = {};
        // data = Json.parse(req.body);

        let idToken;
    
    idToken = req.headers.authorization.split('Bearer ')[1];
    let userId;
            //Check query params
            if(req.query && req.query.userId) {
              userId = req.query.userId;
            }
            console.log('UserId of deleting User', userId);
        
        return fbAdmin.auth().verifyIdToken(idToken).then(decodedToken => {
          //console.log('decodedToken', decodedToken);
          return fbAdmin.auth().updateUser(userId, req.body)
          .then(function(userRecord) {
            let jsonUser = userRecord.toJSON();
            return res.status(200).json({
                  uid: jsonUser.uid,
                  email: jsonUser.email,
                  displayName: jsonUser.displayName,
                  photoURL: jsonUser.photoURL,
                  disabled: jsonUser.disabled 
                });
          })
          .catch(function(error) {
            console.log('Error deleting users:', error);
            return res.status(400).json({ message: 'Error deleting user' });
          })
        }
        ).then(res => {
          return res;
        })
        .catch(error => {
          console.log(error);
          return res.status(401).json({ error: 'Unauthorized!' });
        });
    });
      });


    exports.getUser = functions.https.onRequest((req, res) => {
      console.log('Inside getUser method');
      return cors(req, res, () => {
        if (req.method !== 'GET') {
          return res.status(500).json({ message: 'Not allowed.' });
        }
        //Check user authentication
        console.log('req.header',req.headers);
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
          return res.status(401).json({error: 'Unauthorized'});
        }
        let idToken;
    
    idToken = req.headers.authorization.split('Bearer ')[1];
    let userId;
            //Check query params
            if(req.query && req.query.userId) {
              userId = req.query.userId;
            }
            console.log('UserId of  User', userId);
        
        return fbAdmin.auth().verifyIdToken(idToken).then(decodedToken => {
          //console.log('decodedToken', decodedToken);
          return fbAdmin.auth().getUser(userId)
          .then(function(userRecord) {
            let jsonUser = userRecord.toJSON();
            return res.status(200).json({
              uid: jsonUser.uid,
               email: jsonUser.email,
                displayName: jsonUser.displayName,
                 photoURL: jsonUser.photoURL,
                  disabled: jsonUser.disabled 
                });
          })
          .catch(function(error) {
            console.log('Error fetching user:', error);
            return res.status(400).json({ message: 'Error fetching user' });
          })
        }
        ).then(res => {
          return res;
        })
        .catch(error => {
          console.log(error);
          return res.status(401).json({ error: 'Unauthorized!' });
        });
    });
      });

  // function listAllUsers(nextPageToken) {
  //   console.log('Inside listAllUsers function');
  //   // List batch of users, 1000 at a time.
  //   fbAdmin.auth().listUsers(1000, nextPageToken)
  //     .then(function(listUsersResult) {
  //       let users = [];
  //       listUsersResult.users.forEach(function(userRecord) {
  //         users.push(userRecord)
  //         console.log('user', userRecord.toJSON());
  //       });
  //       console.log('listUsersResult', users.toJSON());
  //       return listUsersResult;
  //       // if (listUsersResult.pageToken) {
  //       //   // List next batch of users.
  //       //   listAllUsers(listUsersResult.pageToken);
  //       // }
  //     })
  //     .catch(function(error) {
  //       console.log('Error listing users:', error);
  //     });
  // }
