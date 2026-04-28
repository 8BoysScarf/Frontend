import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, PagedResult } from '../../services/product';
import { CategoryService, Category } from '../../services/category';
import { ColorService, Color } from '../../services/color';
import { LanguageService } from '../../services/language';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FormsModule, ProductCardComponent],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  public productService = inject(ProductService);
  public categoryService = inject(CategoryService);
  public colorService = inject(ColorService);
  public langService = inject(LanguageService);
  public wishlistService = inject(WishlistService);
  public cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  colors = signal<Color[]>([]);
  
  totalCount = signal(0);
  page = signal(1);
  pageSize = 12;

  // Filters
  name = signal('');
  categoryId = signal<number | null>(null);
  colorId = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  isLoading = signal(true);

  ngOnInit() {
    // Sync with query params
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.categoryId.set(Number(params['category']));
      if (params['q']) this.name.set(params['q']);
      this.loadData();
    });

    this.loadFilters();
  }

  loadFilters() {
    this.categoryService.getCategories().subscribe(data => this.categories.set(data));
    this.colorService.getColors().subscribe(data => this.colors.set(data));
  }

  loadData() {
    this.isLoading.set(true);
    const params: any = {
      page: this.page(),
      pageSize: this.pageSize
    };
    if (this.name()) params.name = this.name();
    if (this.categoryId()) params.categoryId = this.categoryId();
    if (this.colorId()) params.colorId = this.colorId();
    if (this.minPrice()) params.minPrice = this.minPrice();
    if (this.maxPrice()) params.maxPrice = this.maxPrice();

    this.productService.getCards(params).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.totalCount.set(res.totalCount);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilterChange() {
    this.page.set(1);
    this.loadData();
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleWishlist(productId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.wishlistService.toggleWishlist(productId).subscribe();
  }

  totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
}
