// export interface Register {
//   // firstName:string,
//   // lastName:string,
//   fullName: string;
//   email: string;
//   moblieNo:string;
//   password: string;
//   acceptTerms: boolean;
// }
export interface Register {

  firstName: string;

  lastName: string;

  email: string;

  moblieNo: string;

  password: string;

  acceptTerms: boolean;

  role?: string;

}

export interface ILogin {
  email: string;
  password: string;
}

export interface IProduct {

  // Basic Details
  productName: string;
  shortName: string;
  description: string;
  brand: string;

  // Fragrance Details
  gender: string[];
  fragranceFamily: string;
  concentration: string;
  volume: string;
  form: string;
  projection: string;
  longevity: string;

  // Notes
  topNotes: string;
  middleNotes: string;
  baseNotes: string;

  // Occasion
  occasion: string[];
  season: string;

  // Manufacturer
  countryOfOrigin: string;
  manufacturer: string;
  ingredients: string;

  // Product
  warranty: string;
  launchDate: string;
  shelfLife: string;
  sku: string;
  barcode: string;
  tags: string;

  // Pricing
  costPrice: number;
  mrp: number;
  sellingPrice: number;
  discount: number;
  gst: number;

  // Stock
  stockQuantity: number;
  minimumStock: number;
  maximumStock: number;
  stockStatus: string;
  availability: string;

  // Dates
  manufacturingDate: string;
  expiryDate: string;

  // Images
  mainImage: string;
  galleryImages: string[];
}