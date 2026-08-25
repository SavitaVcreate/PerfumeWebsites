import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Register } from '../../../core/models/Classes';
import { SignupService } from '../../../core/services/signup/signup-service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../core/services/model/modal-service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  showPassword = false;
  showConfirmPassword = false;

  registerData: Register = {
   firstName: '',
    lastName: '',
    email: '',
    moblieNo: '',
    password: '',
    acceptTerms: false,
    role: 'User'
  };

  constructor(private signupService: SignupService, private router: Router,private model:ModalService) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
register() {
  this.signupService.register(this.registerData).subscribe({
    next: (res: any) => {
      this.model.show({
        title: 'Success',
        message: res.message,
        type: 'success'
      });

      this.router.navigate(['/auth/login']);
    },

    error: (err: any) => {
      this.model.show({
        title: 'Error',
        message: err.error.message,
        type: 'error'
      });
    }
  });
}
  // register() {

  //   this.signupService.register(this.registerData).subscribe({

  //     next: (res: any) => {

  //       console.log(res);

  //       alert(res.message);
  //       this.router.navigate(['/auth/login']);

  //     },

  //     error: (err: any) => {

  //       console.log(err);

  //       alert(err.error.message);

  //     }

  //   });

  // }
}
