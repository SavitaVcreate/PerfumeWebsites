import { Component } from '@angular/core';
import { Sidebar } from '../adminLayouts/sidebar/sidebar';
import { Adminnav } from '../adminLayouts/adminnav/adminnav';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/products/product-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IProduct } from '../../../core/models/Classes';
import { DEFAULT_PRODUCT } from '../../../core/models/product-default';
@Component({
  selector: 'app-addproduct',
  imports: [ Adminnav, RouterModule, FormsModule, CommonModule],
  templateUrl: './addproduct.html',
  styleUrl: './addproduct.css',
})

export class Addproduct {
  mainImage!: File;
  productData: IProduct = structuredClone(DEFAULT_PRODUCT);
  galleryImages: File[] = [];
  mainImagePreview: any = "assets/images/no-image.png";
  galleryPreview: any[] = [];
  loading = false;
  constructor(private productService: ProductService) { }
  onMainImage(event: any) {
    if (event.target.files.length > 0) {
      this.mainImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.mainImagePreview = e.target.result;
      };
      reader.readAsDataURL(this.mainImage);
    }
  }
  onGalleryImages(event: any) {
    this.galleryImages = [];
    this.galleryPreview = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.galleryImages.push(files[i]);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galleryPreview.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }
  removeGallery(index: number) {
    this.galleryImages.splice(index, 1);
    this.galleryPreview.splice(index, 1);
  }
  toggleGender(value: string, event: any) {
    if (event.target.checked) {
      this.productData.gender.push(value);
    } else {
      this.productData.gender = this.productData.gender.filter(
        (g: string) => g !== value
      );
    }
  }
  saveProduct() {
    this.loading = true;
    const formData = new FormData();
    formData.append("productName", this.productData.productName);
    formData.append("shortName", this.productData.shortName);
    formData.append("description", this.productData.description);
    formData.append("brand", this.productData.brand);
    formData.append("gender", JSON.stringify(this.productData.gender));
    formData.append("fragranceFamily", this.productData.fragranceFamily);
    formData.append("concentration", this.productData.concentration);
    formData.append("volume", this.productData.volume);
    formData.append("form", this.productData.form);
    formData.append("projection", this.productData.projection);
    formData.append("longevity", this.productData.longevity);
    formData.append("topNotes", this.productData.topNotes);
    formData.append("middleNotes", this.productData.middleNotes);
    formData.append("baseNotes", this.productData.baseNotes);
    formData.append("occasion", JSON.stringify(this.productData.occasion));
    formData.append("season", this.productData.season);
    formData.append("countryOfOrigin", this.productData.countryOfOrigin);
    formData.append("manufacturer", this.productData.manufacturer);
    formData.append("ingredients", this.productData.ingredients);
    formData.append("warranty", this.productData.warranty);
    formData.append("launchDate", this.productData.launchDate);
    formData.append("shelfLife", this.productData.shelfLife);
    formData.append("sku", this.productData.sku);
    formData.append("barcode", this.productData.barcode);
    formData.append("tags", this.productData.tags);
    formData.append("costPrice", this.productData.costPrice.toString());
    formData.append("mrp", this.productData.mrp.toString());
    formData.append("sellingPrice", this.productData.sellingPrice.toString());
    formData.append("discount", this.productData.discount.toString());
    formData.append("gst", this.productData.gst.toString());
    formData.append("stockQuantity", this.productData.stockQuantity.toString());
    formData.append("minimumStock", this.productData.minimumStock.toString());
    formData.append("maximumStock", this.productData.maximumStock.toString());
    formData.append("stockStatus", this.productData.stockStatus);
    formData.append("availability", this.productData.availability);
    formData.append("manufacturingDate", this.productData.manufacturingDate);
    formData.append("expiryDate", this.productData.expiryDate);
    if (this.mainImage) { formData.append("mainImage", this.mainImage); }
    this.galleryImages.forEach(image => {
      formData.append("galleryImages", image);
    });
    this.productService.addProduct(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        alert("Product Added Successfully");
        console.log(res);
        this.resetForm();
      },
      error: (err: any) => {
        this.loading = false;
        console.log(err);
        alert(err.error.message);
      }
    });
  }


  resetForm() {
    this.productData = structuredClone(DEFAULT_PRODUCT);
    this.mainImage = undefined as any;
    this.mainImagePreview = "assets/images/no-image.png";
    this.galleryImages = [];
    this.galleryPreview = [];
  }



  cancel() {
    this.resetForm();
  }

  toggleOccasion(value: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.productData.occasion.push(value);
    } else {
      this.productData.occasion = this.productData.occasion.filter((o: string) => o !== value);
    }
  }
}

