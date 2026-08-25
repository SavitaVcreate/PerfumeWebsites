import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterModule } from '@angular/router';
import { SignupService } from '../../../core/services/signup/signup-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment/environment';
import { AlertService } from '../../../core/services/alert/alertservice';
@Component({
  selector: 'app-adminprofile',
  imports: [ Adminnav, RouterModule, FormsModule, CommonModule],
  templateUrl: './adminprofile.html',
  styleUrl: './adminprofile.css',
})
export class Adminprofile {
  profile: any = {};
  imageUrl = environment.imageUrl;
  selectedFile!: File;
  previewImage: any;
  isEditMode = false;
  authService = inject(SignupService);

  constructor(private cd: ChangeDetectorRef, private alertService:AlertService) {
    this.getProfile();

  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {

      const reader = new FileReader();

      reader.onload = () => {

        this.previewImage = reader.result;

      };

      reader.readAsDataURL(this.selectedFile);

    }

  }
  getProfile() {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  updateProfile() {
    const formData = new FormData();
    formData.append("firstName", this.profile.firstName);
    formData.append("lastName", this.profile.lastName);
    formData.append("email", this.profile.email);
    formData.append("moblieNo", this.profile.moblieNo);
    formData.append("dob", this.profile.dob);
    formData.append("location", this.profile.location);
    formData.append("biography", this.profile.biography);
    if (this.selectedFile) {
      formData.append("profileImage", this.selectedFile);
    }
    this.authService.updateProfile(formData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alertService.success('res.message')
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  deleteImage() {
    this.authService.deleteProfileImage().subscribe((res: any) => {
      this.alertService.success(res.message)
      // alert(res.message);
      // this.getProfile();
    });
  }
  editProfile() {
    this.isEditMode = true;
  }
  cancelEdit() {
    this.isEditMode = false;
  }
}

