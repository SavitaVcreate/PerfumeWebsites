import { Component, AfterViewInit, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Navbar } from '../../../layouts/navbar/navbar';
import { DispyedProducts } from '../dispyed-products/dispyed-products';
import { Footer } from '../../../layouts/footer/footer';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, DispyedProducts, Footer, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnInit, OnDestroy {
  currentIndex = 0;

  interval: any;

  testimonials = [

    {
      text: 'AL-MARSOOS is a masterpiece in a bottle. Its rich, captivating fragrance lasts all day and leaves a powerful impression wherever I go. Truly a premium scent that defines confidence and class.',
      name: 'Abdullah Shekeel',
      role: 'CEO'
    },

    {
      text: 'The fragrance is incredibly luxurious and long-lasting. The blend of oud and amber is perfectly balanced, making it my favorite Arabian perfume.',
      name: 'Syed Waleed Ali',
      role: 'Business Owner'
    },

    {
      text: 'Every spray reflects elegance and sophistication. I receive compliments everywhere I go. Abdullah Parfume has become my signature fragrance.',
      name: 'Mohammed Faisal',
      role: 'Entrepreneur'
    },

    {
      text: 'A perfect combination of rich oud, musk, and saffron. The quality is exceptional, and the fragrance lasts from morning until night.',
      name: 'Ahmed Khan',
      role: 'Perfume Enthusiast'
    },

    {
      text: 'Abdullah Parfume delivers true Arabian luxury. The elegant bottle, premium ingredients, and unforgettable scent make it worth every moment.',
      name: 'Zain Ali',
      role: 'Fashion Consultant'
    }

  ];


  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {

    // Bootstrap Carousel
    const carouselElement = document.querySelector('#heroCarousel');

    if (carouselElement) {
      new bootstrap.Carousel(carouselElement, {
        interval: 4000,
        ride: 'carousel',
        pause: false,
        wrap: true
      });
    }

    // Animation Observer
    const observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }

      });

    }, {
      threshold: 0.3
    });

    document.querySelectorAll('.fade-left, .fade-right')
      .forEach(el => observer.observe(el));

    this.cdr.detectChanges();
  }


  ngOnInit(): void {
    this.startAutoSlide();
  }

  startAutoSlide(): void {

    this.stopAutoSlide();

    this.interval = setInterval(() => {
      this.next(false);
      this.cdr.detectChanges();
    }, 2000);

  }

  stopAutoSlide(): void {

    if (this.interval) {
      clearInterval(this.interval);
    }

  }

  next(resetTimer: boolean = true): void {

    this.currentIndex =
      (this.currentIndex + 1) % this.testimonials.length;

    if (resetTimer) {
      this.startAutoSlide();
    }

  }

  prev(): void {

    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;

    this.startAutoSlide();

  }

  goToSlide(index: number): void {

    this.currentIndex = index;

    this.startAutoSlide();

  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

}
