import { AlertController, LoadingController } from "@ionic/angular";

export function convertSnaps<T>(snaps) {
  if (!snaps.length) {
    console.log("No Data Available");
    return false;
  }
  return <T[]>snaps.map(snap => {
    return {
      id: snap.payload.doc.id,
      ...snap.payload.doc.data()
    };

  });
}

export function convertSnapsPagination<T>(snaps) {
  if (!snaps.length) {
    console.log("No Data Available");
    return false;
  }
  return {
    model: <T[]>snaps.map(snap => {
    return  {
        id: snap.payload.doc.id,
        ...snap.payload.doc.data()
      };

  }),
  firstInResponse: snaps[0].payload.doc,
  lastInResponse: snaps[snaps.length - 1].payload.doc
}
}

export async function presentLoading(message1: string, loadingCtrl: LoadingController) {
  const loading = await loadingCtrl.create({
    message: message1,
    keyboardClose: true
  });
  return await loading.present();

  //const { role, data } = await loading.onDidDismiss();
  //return;
}

//   async getLoadingIndicator() {
//     const loading = await this.loadingController.create({
//         message: 'Please wait...'
//     });
//     loading.present();
//     return loading;
// }

export async function presentAlert(code: string, header: string, alertCtrl: AlertController) {
  let message;
  switch (code) {
    case 'EMAIL_EXISTS':
      message = 'The email address is already in use by another account.'
      break;
    case 'OPERATION_NOT_ALLOWED':
      message = 'Password sign-in is disabled for this project.'
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      message = 'We have blocked all requests from this device due to unusual activity. Try again later.'
      break;
    case 'EMAIL_NOT_FOUND':
      message = 'There is no user record corresponding to this identifier. The user may have been deleted.'
      break;
    case 'INVALID_PASSWORD':
      message = 'The password is invalid or the user does not have a password.'
      break;
    case 'USER_DISABLED':
      message = 'The user account has been disabled by an administrator.'
      break;
    default:
      message = 'Could not sign you up, please try again!'
  }
  const alert = await alertCtrl.create({
    header: header,
    subHeader: code,
    message: message,
    buttons: [{
      text: 'Okay',
      handler: () => {
        //this.router.navigate(['/places/tabs/discover']);
      }
    }]
  });

  await alert.present();
}

export function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}