import { IProduct } from "./Classes";

export const DEFAULT_PRODUCT: IProduct = {

  productName: '',
  shortName: '',
  description: '',
  brand: '',

  gender: [],
  fragranceFamily: '',
  concentration: '',
  volume: '',
  form: '',
  projection: '',
  longevity: '',

  topNotes: '',
  middleNotes: '',
  baseNotes: '',

  occasion: [],
  season: '',

  countryOfOrigin: '',
  manufacturer: '',
  ingredients: '',

  warranty: '',
  launchDate: '',
  shelfLife: '',
  sku: '',
  barcode: '',
  tags: '',

  costPrice: 0,
  mrp: 0,
  sellingPrice: 0,
  discount: 0,
  gst: 18,

  stockQuantity: 0,
  minimumStock: 0,
  maximumStock: 0,
  stockStatus: 'In Stock',
  availability: 'Available',

  manufacturingDate: '',
  expiryDate: '',

  mainImage: '',
  galleryImages: []
};