import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist';
import { ProductService, Product } from '../../services/product';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './wishlist.html'
})
export class WishlistComponent implements OnInit {
  wishlistService = inject(WishlistService);
  productService = inject(ProductService);
  langService = inject(LanguageService);
  authService = inject(AuthService);
  location = inject(Location);
  router = inject(Router);

  allProducts = signal<Product[]>([]);
  wishlistProducts = computed(() => {
    const ids = this.wishlistService.wishlistProductIds();
    return this.allProducts().filter(p => ids.includes(p.id));
  });

  isLoading = signal(true);
  notification = signal<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  ngOnInit() {
    this.loadWishlistData();
  }

  loadWishlistData() {
    this.isLoading.set(true);
    // First load wishlist IDs
    this.wishlistService.getWishlist().subscribe({
      next: () => {
        // Then load all products to match
        this.productService.getProducts().subscribe({
          next: (products) => {
            this.allProducts.set(products);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => this.isLoading.set(false)
    });
  }

  removeFromWishlist(productId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.showNotify(this.langService.t('wishlist.removed') || 'Removed from wishlist', 'success');
      },
      error: () => {
        this.showNotify(this.langService.t('wishlist.error') || 'Failed to remove', 'error');
      }
    });
  }

  showNotify(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notification.set({ message, type });
    setTimeout(() => this.notification.set(null), 4000);
  }

  goBack() {
    this.location.back();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
