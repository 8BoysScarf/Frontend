import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/product';
import { WishlistService } from '../../services/wishlist';
import { LanguageService } from '../../services/language';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() index: number = 0;

  public wishlistService = inject(WishlistService);
  public langService = inject(LanguageService);

  toggleWishlist(productId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(productId).subscribe();
  }
}
