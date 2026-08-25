import { Component } from '@angular/core';
import { Sidebar } from '../../../layouts/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SignupService } from '../../../core/services/signup/signup-service';
import { AlertService } from '../../../core/services/alert/alertservice';

@Component({
  selector: 'app-myprofile',
  imports: [Sidebar, CommonModule, ReactiveFormsModule],
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.css',
})
export class Myprofile {
  isEdit = false;
  profileForm!: FormGroup;
  user: any = {};
  constructor(
    private fb: FormBuilder,
    private profileService: SignupService, private alertService: AlertService
  ) { }
  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobileNo: ['']
    });
    this.getProfile();
  }

  getProfile() {
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        if (res.status) {
          this.user = res.data;
          const names = this.user.fullName
            ? this.user.fullName.split(' ')
            : [];
          this.profileForm.patchValue({
            firstName: names[0] || '',
            lastName: this.user.lastName || names.slice(1).join(' '),
            email: this.user.email || '',
            mobileNo: this.user.moblieNo || ''
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  editProfile() {
    this.isEdit = true;
  }
  cancelEdit() {
    this.isEdit = false;
    this.profileForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      mobileNo: this.user.moblieNo
    });
  }
  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const formValue = this.profileForm.value;
    const formData = new FormData();
    formData.append('firstName', formValue.firstName || '');
    formData.append('lastName', formValue.lastName || '');
    formData.append('email', formValue.email || '');
    formData.append('moblieNo', formValue.mobileNo || '');
    this.profileService.updateProfile(formData).subscribe({
      next: (res: any) => {
        this.alertService.success(res.message)
        this.isEdit = false;
        this.user = res.data;
        this.getProfile();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}


