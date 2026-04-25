import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { LanguageService } from '../../../services/language';
import { ProductService, Product } from '../../../services/product';
import { CategoryService, Category, AddCategoryDTO } from '../../../services/category';
import { ColorService, Color, AddColorDTO } from '../../../services/color';
import { BadgeService, Badge, AddBadgeDTO } from '../../../services/badge';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, AdminSidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  langService = inject(LanguageService);
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  colorService = inject(ColorService);
  badgeService = inject(BadgeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);

  activeTab: 'products' | 'categories' | 'colors' | 'badges' | 'orders' = 'products';

  // Use Signals for better performance and reactivity
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  colors = signal<Color[]>([]);
  badges = signal<Badge[]>([]);

  showAddModal = false;
  showAddCategoryModal = false;
  showAddColorModal = false;
  showAddBadgeModal = false;
  isLoading = false;
  selectedFiles: File[] = [];

  searchQuery = signal('');
  selectedCategory = signal('');

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();
    
    return this.products().filter(p => {
      const matchSearch = (p.name || '').toLowerCase().includes(query) || (p.code || '').toLowerCase().includes(query);
      const matchCat = cat ? p.categoryName === cat : true;
      return matchSearch && matchCat;
    });
  });

  // Notification and Confirmation states
  notification = signal<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  confirmation = signal<{message: string, action: () => void} | null>(null);

  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    code: ['', Validators.required],
    colorId: [null as number | null],
    size: ['', Validators.required],
    realPrice: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    discount: [0],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    hexCode: ['', Validators.required],
    colorName: ['', Validators.required],
    badgeId: [null as number | null]
  });
 
  badgeForm = this.fb.group({
    name: ['', Validators.required]
  });

  colorForm = this.fb.group({
    name: ['', Validators.required],
    hexCode: ['', Validators.required]
  });

  categoryForm = this.fb.group({
    name: ['', Validators.required],
    parentCategoryId: [null as number | null]
  });

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.loadColors();
    this.loadBadges();

    this.productForm.get('colorId')?.valueChanges.subscribe(val => {
      const nameCtrl = this.productForm.get('colorName');
      const hexCtrl = this.productForm.get('hexCode');
      if (val) {
        nameCtrl?.clearValidators();
        hexCtrl?.clearValidators();
      } else {
        nameCtrl?.setValidators([Validators.required]);
        hexCtrl?.setValidators([Validators.required]);
      }
      nameCtrl?.updateValueAndValidity();
      hexCtrl?.updateValueAndValidity();
    });

    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      }
    });
  }

  onTabChange(tab: string) {
    this.activeTab = tab as any;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab },
      queryParamsHandling: 'merge'
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error loading products', err)
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadColors() {
    this.colorService.getColors().subscribe({
      next: (data) => this.colors.set(data),
      error: (err) => console.error('Error loading colors', err)
    });
  }

  loadBadges() {
    this.badgeService.getBadges().subscribe({
      next: (data) => this.badges.set(data),
      error: (err) => console.error('Error loading badges', err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onAddProduct() {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formData = new FormData();

      const val = this.productForm.value as any;
      Object.keys(val).forEach(key => {
        if (val.colorId && (key === 'colorName' || key === 'hexCode')) return;
        const value = val[key];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      this.selectedFiles.forEach(file => {
        formData.append('imageFiles', file, file.name);
      });

      // Show immediate feedback by closing modal before heavy upload if preferred, 
      // but for products with images we wait for the real data to show correctly.
      this.productService.addProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.showAddModal = false;
          this.productForm.reset();
          this.selectedFiles = [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding product', err);
          this.isLoading = false;
          alert('Error adding product. Please try again.');
        }
      });
    }
  }

  onAddCategory() {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      const dto: AddCategoryDTO = {
        name: this.categoryForm.value.name!,
        parentCategoryId: this.categoryForm.value.parentCategoryId ? Number(this.categoryForm.value.parentCategoryId) : undefined
      };

      this.categoryService.addCategory(dto).subscribe({
        next: () => {
          this.loadCategories();
          this.showAddCategoryModal = false;
          this.categoryForm.reset();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding category', err);
          this.isLoading = false;
          alert('Error adding category.');
        }
      });
    }
  }

  onAddColor() {
    if (this.colorForm.valid) {
      this.isLoading = true;
      const dto: AddColorDTO = {
        name: this.colorForm.value.name!,
        hexCode: this.colorForm.value.hexCode!
      };

      this.colorService.addColor(dto).subscribe({
        next: () => {
          this.loadColors();
          this.showAddColorModal = false;
          this.colorForm.reset();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding color', err);
          this.isLoading = false;
          alert('Error adding color.');
        }
      });
    }
  }

  onAddBadge() {
    if (this.badgeForm.valid) {
      this.isLoading = true;
      const dto: AddBadgeDTO = {
        name: this.badgeForm.value.name!
      };

      this.badgeService.addBadge(dto).subscribe({
        next: () => {
          this.loadBadges();
          this.showAddBadgeModal = false;
          this.badgeForm.reset();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error adding badge', err);
          this.isLoading = false;
          alert('Error adding badge.');
        }
      });
    }
  }

  onDeleteProduct(id: number) {
    this.confirmation.set({
      message: 'CRITICAL: Are you sure you want to permanently delete this product and all its variants?',
      action: () => {
        const previousState = this.products();
        this.products.update(prev => prev.filter(p => p.id !== id));
        this.confirmation.set(null);

        this.productService.deleteProduct(id).subscribe({
          next: () => this.showNotify('Product successfully deleted', 'success'),
          error: () => {
            this.products.set(previousState);
            this.showNotify('Failed to delete product. Database conflict.', 'error');
          }
        });
      }
    });
  }

  onDeleteCategory(id: number) {
    this.confirmation.set({
      message: 'Are you sure you want to delete this category?',
      action: () => {
        const previousState = this.categories();
        this.categories.update(prev => prev.filter(c => c.id !== id));
        this.confirmation.set(null);

        this.categoryService.deleteCategory(id).subscribe({
          next: () => this.showNotify('Category deleted', 'success'),
          error: () => {
            this.categories.set(previousState);
            this.showNotify('Error: Category might have sub-items.', 'error');
          }
        });
      }
    });
  }

  onDeleteColor(id: number) {
    this.confirmation.set({
      message: 'Permanently remove this color definition?',
      action: () => {
        const previousState = this.colors();
        this.colors.update(prev => prev.filter(c => c.id !== id));
        this.confirmation.set(null);

        this.colorService.deleteColor(id).subscribe({
          next: () => this.showNotify('Color removed', 'success'),
          error: () => {
            this.colors.set(previousState);
            this.showNotify('Failed to remove color.', 'error');
          }
        });
      }
    });
  }

  onDeleteBadge(id: number) {
    this.confirmation.set({
      message: 'Permanently remove this badge?',
      action: () => {
        const previousState = this.badges();
        this.badges.update(prev => prev.filter(b => b.id !== id));
        this.confirmation.set(null);

        this.badgeService.deleteBadge(id).subscribe({
          next: () => this.showNotify('Badge removed', 'success'),
          error: () => {
            this.badges.set(previousState);
            this.showNotify('Failed to remove badge.', 'error');
          }
        });
      }
    });
  }

  private showNotify(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notification.set({ message, type });
    setTimeout(() => this.notification.set(null), 3000);
  }
}
