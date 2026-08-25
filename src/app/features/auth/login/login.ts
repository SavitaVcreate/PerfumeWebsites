import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ILogin } from '../../../core/models/Classes';
import { SignupService } from '../../../core/services/signup/signup-service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/model/modal-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  showPassword = false;
  showConfirmPassword = false;
  loginData: ILogin = {
    email: '',
    password: ''
  };
  constructor(
    private signupService: SignupService,
    private router: Router, private model: ModalService
  ) { }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  //  onLogin() {

  //   this.signupService.login(this.loginData).subscribe({

  //     next: (res) => {

  //       console.log(res);

  //       localStorage.setItem('token', res.token);

  //       localStorage.setItem('user', JSON.stringify(res.user));

  //       alert('Login Successful');
  //   this.router.navigate(['/admin']);

  //       // this.router.navigate(['/dashboard']);

  //     },

  //     error: (err) => {

  //       console.log(err);

  //       alert(err.error.message);

  //     }

  //   });

  // }
  onLogin() {
    this.signupService.login(this.loginData).subscribe({
      next: (res: any) => {
        console.log('Login Response:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('role', res.user.role);
        console.log('Token:', localStorage.getItem('token'));
        console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));
        this.model.show({ title: 'Success', message: res.message, type: 'success' });
        setTimeout(() => {
          if (res.user.role === 'Admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (err) => {
        this.model.show({ title: 'Error', message: err.error.message, type: 'error' });
      }
    });
  }
  // onLogin() {

  //   this.signupService.login(this.loginData).subscribe({

  //     next: (res: any) => {

  //       console.log(res);

  //       localStorage.setItem('token', res.token);
  //       localStorage.setItem('user', JSON.stringify(res.user));
  //       localStorage.setItem('role', res.user.role);
  //       this.model.show({
  //         title: 'Success',
  //         message: res.message,
  //         type: 'success'
  //       });
  //       // alert('Login Successful');

  //       if (res.user.role === 'Admin') {
  //         this.router.navigate(['/admin']);
  //       } else {
  //         this.router.navigate(['/']);
  //       }

  //     },

  //     error: (err) => {

  //       console.log(err);
  //       this.model.show({
  //         title: 'Error',
  //         message: err.error.message,
  //         type: 'error'
  //       });
  //       // alert(err.error.message);

  //     }

  //   });

  // }


}
