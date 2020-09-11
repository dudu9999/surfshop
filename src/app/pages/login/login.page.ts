import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController  } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public wavesPosition: number = 0;
  public wavesDifference: number = 80;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    public keyboard: Keyboard,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  segmentChanged(event: any){
    if (event.detail.value == "login") {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    }else{
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async login(){
    await this.presentLoading();
    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case "auth/email-already-in-use":
            message = "Email já em uso!"
          break;

        case "auth/invalid-email":
            message = "Email invalido ou em falta!"
          break;
        
        case "auth/argument-error":
            message = "Digite a senha!"
          break;
        
        case "auth/weak-password":
            message = "A senha deve ter 6 digitos ou mais!"
          break;
        
        default:
            message = "Erro desconhecido!"
            console.error(error);
          break;
      }
      this.presentToast(message);
    } finally{
      this.loading.dismiss();
    }
    this.loading.dismiss();
  }

  async register(){
    console.log(this.userRegister);
    await this.presentLoading();
    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      let message: string;
      switch (error.code) {
        case "auth/email-already-in-use":
            message = "Email já em uso!"
          break;

        case "auth/invalid-email":
            message = "Email invalido ou em falta!"
          break;
        
        case "auth/argument-error":
            message = "Digite a senha!"
          break;
        
        default:
            message = "Erro desconhecido!"
            console.error(error);
          break;
      }
      
      
      this.presentToast(message);

    } finally{
      this.loading.dismiss();
    }

    this.loading.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ cssClass: 'my-custom-class', message: 'Por favor, aguarde...', });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

}
