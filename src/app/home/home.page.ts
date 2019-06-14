import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imageURI:any;
  imageFileName:any;
  toast: any;

  constructor(
   private transfer: FileTransfer,
   private camera: Camera,
   public loadingCtrl: LoadingController,
   public toastCtrl: ToastController
  ) {}

    getImage() {
	  const options: CameraOptions = {
	    quality: 100,
	    destinationType: this.camera.DestinationType.FILE_URI,
	    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
	  }

	  this.camera.getPicture(options).then((imageData) => {
	    this.imageURI = imageData;
	    console.log("imagedata is",imageData);
	  }, (err) => {
	    console.log(err);
	    //this.presentToast(err);
	  });
    }

  async uploadFile() {
      const loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });
    await loading.present();
		  const fileTransfer: FileTransferObject = this.transfer.create();
      let options = {
         fileKey: 'file',
         fileName: 'ohmwa.jpg',
         chunkedMode: false,
         httpMethod: 'post',
         mimeType: "multipart/form-data",
         headers: {}
      }

		  fileTransfer.upload(this.imageURI, 'http://192.168.0.109:3000/api/containers/uploadcontainerimage?access_token=rpqQcqiYBrtkgYXnYlrG2dXQDHftidzkEtWT9gjAobij2dD3Im5qzPLqFGjN2zEW', options)
		    .then((data) => {
           let response = JSON.parse(data.response);
           console.log("response is",response);
          this.imageFileName = response.Location;
          (async function () {
              await loading.dismiss();
          })();
          this.showToast();
          //toast.present()
		  }, (err) => {
        console.log(err);
        loading.onDidDismiss();
      //  this.presentToast(err);
		  });
    }

    showToast() {
    this.toast = this.toastCtrl.create({
      message: 'Image uploaded successfully',
      duration: 2000,
      color:"success"
    }).then((toastData)=>{
      console.log(toastData);
      toastData.present();
    });
  }
}
