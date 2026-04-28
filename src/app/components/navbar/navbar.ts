import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { AddressService, Address } from '../../services/address';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styles: [`
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
    .animate-slide-down { animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `]
})
export class NavbarComponent {
  @Input() mode: 'full' | 'simple' = 'full';
  
  isMenuOpen = signal(false);
  defaultAddress = signal<Address | null>(null);

  constructor(
    public langService: LanguageService,
    public authService: AuthService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    public addressService: AddressService,
    private router: Router
  ) {
    if (this.authService.currentUser()) {
      this.loadDefaultAddress();
    }
  }

  loadDefaultAddress() {
    this.addressService.getAll().subscribe({
      next: (data) => {
        const addr = data.find(a => a.isDefault) || (data.length > 0 ? data[0] : null);
        this.defaultAddress.set(addr);
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack() {
    window.history.back();
  }
}
