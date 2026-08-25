import { Component, inject } from '@angular/core';
import { Navbar } from "../../../layouts/navbar/navbar";
import { Footer } from "../../../layouts/footer/footer";
import { ContactService } from '../../../core/services/contact-us/contact-service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../core/services/alert/alertservice';
@Component({
  selector: 'app-contactus',
  imports: [Navbar, Footer, CommonModule, FormsModule],
  templateUrl: './contactus.html',
  styleUrl: './contactus.css',
})
export class Contactus {
  loading = false;
  private contactService = inject(ContactService);
  private alertService = inject(AlertService)
  contactData = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  };

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.contactService.sendContact(this.contactData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.alertService.success(res.message);
        form.resetForm();
      },
      error: (err) => {
        this.loading = false;
        this.alertService.error(err.error?.message || 'Something went wrong')
      }
    });
  }
}
