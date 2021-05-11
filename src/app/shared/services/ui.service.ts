import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  isLoading = false;
  constructor(private toastController: ToastController, private loadingCtrl: LoadingController) { }

  async presentToast(message:string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
  }



  async presentLoading(message: string = 'Loading...') {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: message,
      keyboardClose: true,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed')).catch(
      err => console.log('Loading aborted before dismissing',err)
    );
  }
}
