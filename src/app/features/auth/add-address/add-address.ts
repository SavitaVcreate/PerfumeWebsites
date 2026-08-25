import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Sidebar } from '../../../layouts/sidebar/sidebar';
import { AddressService } from '../../../core/services/address/address-service';
import { AlertService } from '../../../core/services/alert/alertservice';
@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './add-address.html',
  styleUrl: './add-address.css'
})
export class AddAddress implements OnInit {
  showAddressForm = false;
  addresses: any[] = [];
  addressForm!: FormGroup;
  constructor(private fb: FormBuilder, private addressService: AddressService, private cd: ChangeDetectorRef, private alertService: AlertService) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNo: ['', Validators.required],
      pincode: ['', Validators.required],
      locality: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      landmark: [''],
      alternatePhone: [''],
      addressType: ['Home']
    });
  }
  ngOnInit(): void {
    this.getAddresses();
  }
  openAddressForm() {
    this.showAddressForm = true;
  }
  closeAddressForm() {
    this.showAddressForm = false;
    this.addressForm.reset({ addressType: 'Home' });
  }

  saveAddress() {
    console.log(this.addressForm.value);
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.addressService.addAddress(this.addressForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alertService.success(res.message);
        this.getAddresses();
        this.closeAddressForm();
      },
      error: (err) => {
        this.alertService.error("err.error");
      }
    });
  }

  getAddresses() {
    this.addressService.getAddresses().subscribe({
      next: (res: any) => {
        if (res.success) { this.addresses = res.data; }
        this.cd.detectChanges();
      },
      error: (err) => { this.alertService.error(err); }
    });
  }

  deleteAddress(id: string) {
    if (!confirm('Delete Address?')) { return; }
    this.addressService.deleteAddress(id).subscribe({ next: () => { this.getAddresses(); } });
  }
}