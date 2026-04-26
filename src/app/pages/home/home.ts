import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService } from '../../services/language';
import { ProductImageService } from '../../services/product-image';
import { ProductService, Product } from '../../services/product';
import { CartService } from '../../services/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  langService = inject(LanguageService);
  productImageService = inject(ProductImageService);
  productService = inject(ProductService);
  cartService = inject(CartService);

  heroImages = signal<string[]>([]);
  featuredProducts = signal<Product[]>([]);
  activeImageIndex = signal(0);
  private slideInterval: any;

  ngOnInit() {
    this.productImageService.getAllImages().subscribe({
      next: (images) => {
        if (images && images.length > 0) {
          this.heroImages.set(images.map(img => img.imageUrl));
          this.startSlideshow();
        } else {
          this.heroImages.set(['https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop']);
        }
      },
      error: () => {
        this.heroImages.set(['https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop']);
      }
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products.slice(0, 8));
      }
    });
  }

  startSlideshow() {
    if (this.heroImages().length > 1) {
      this.slideInterval = setInterval(() => {
        this.activeImageIndex.update(idx => (idx + 1) % this.heroImages().length);
      }, 2500);
    }
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
