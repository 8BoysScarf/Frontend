import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, Cart, CartItem } from '../../services/cart';
import { AddressService, Address } from '../../services/address';
import { OrderService } from '../../services/order';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  addressService = inject(AddressService);
  orderService = inject(OrderService);
  langService = inject(LanguageService);
  authService = inject(AuthService);
  location = inject(Location);
  router = inject(Router);

  cart = signal<Cart | null>(null);
  addresses = signal<Address[]>([]);
  selectedAddressId = signal<number | null>(null);
  isLoading = signal(true);
  isCheckingOut = signal(false);
  notification = signal<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  ngOnInit() {
    this.loadCart();
    this.loadAddresses();
  }

  loadCart() {
    this.isLoading.set(true);
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadAddresses() {
    this.addressService.getAll().subscribe({
      next: (data) => {
        this.addresses.set(data);
        const defaultAddress = data.find(a => a.isDefault);
        if (defaultAddress) {
          this.selectedAddressId.set(defaultAddress.id);
        } else if (data.length > 0) {
          this.selectedAddressId.set(data[0].id);
        }
      }
    });
  }

  removeItem(variantId: number) {
    this.cartService.removeItem(variantId).subscribe({
      next: () => {
        this.loadCart();
      },
      error: () => {
        this.showNotify(this.langService.t('cart.removeError') || 'Failed to remove item', 'error');
      }
    });
  }

  selectAddress(id: number) {
    this.selectedAddressId.set(id);
  }

  checkout() {
    const addressId = this.selectedAddressId();
    if (!addressId) {
      this.showNotify(this.langService.t('cart.selectAddress') || 'Please select an address', 'error');
      return;
    }

    this.isCheckingOut.set(true);
    this.orderService.createFromCart(addressId).subscribe({
      next: (res) => {
        this.showNotify(this.langService.t('cart.checkoutSuccess') || 'Order placed successfully!', 'success');
        this.isCheckingOut.set(false);
        this.cart.set(null); // Clear local cart
        this.cartService.cartItemCount.set(0); // Clear global count
        
        setTimeout(() => {
          this.router.navigate(['/order', res.orderId]); // Redirect to order details
        }, 2000);
      },
      error: (err) => {
        this.showNotify(this.langService.t('cart.checkoutError') || 'Failed to checkout', 'error');
        this.isCheckingOut.set(false);
      }
    });
  }

  calculateTotal(): number {
    const currentCart = this.cart();
    if (!currentCart || !currentCart.items) return 0;
    
    return currentCart.items.reduce((total, item) => {
      // Fallback to 0 if productVariant or price is undefined
      const price = item.productVariant?.price || 0;
      return total + (price * item.quantity);
    }, 0);
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
