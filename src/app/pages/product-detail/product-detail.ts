import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService, ProductDetails, ProductVariant } from '../../services/product';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { VariantService } from '../../services/variant';
import { ColorService, Color } from '../../services/color';
import { CategoryService, Category } from '../../services/category';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AdminSidebarComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private variantService = inject(VariantService);
  private colorService = inject(ColorService);
  private categoryService = inject(CategoryService);
  public langService = inject(LanguageService);
  public authService = inject(AuthService);
  private location = inject(Location);
  private fb = inject(FormBuilder);

  product = signal<ProductDetails | null>(null);
  selectedVariant = signal<ProductVariant | null>(null);
  colors = signal<Color[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  showAddVariantModal = signal(false);
  showEditProductModal = signal(false);
  activeImage = signal<string>('');

  variantForm = this.fb.group({
    id: [null as number | null],
    productId: [0],
    colorId: [null as number | null],
    colorName: ['', Validators.required],
    hexCode: ['#000000', Validators.required],
    size: ['', Validators.required],
    realPrice: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    discount: [0],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    code: ['', Validators.required]
  });

  productEditForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    categoryId: [null as number | null, Validators.required]
  });

  notification = signal<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  confirmation = signal<{ message: string, action: () => void } | null>(null);
  selectedFiles: File[] = [];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
      this.loadColors();
      this.loadCategories();
    }

    this.variantForm.get('colorId')?.valueChanges.subscribe(val => {
      const nameCtrl = this.variantForm.get('colorName');
      const hexCtrl = this.variantForm.get('hexCode');
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
  }

  showNotify(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notification.set({ message, type });
    setTimeout(() => this.notification.set(null), 4000);
  }

  getErrorMessage(err: any, defaultMsg: string): string {
    if (!err) return defaultMsg;
    
    // If backend returns a plain string containing the message
    if (typeof err.error === 'string') {
      // Sometimes ASP.NET returns raw text with exception type: "System.Exception: Message here \n stack trace..."
      if (err.error.includes(': ')) {
        const parts = err.error.split(': ');
        const firstLine = parts.length > 1 ? parts[1].split('\n')[0] : parts[0];
        return firstLine.trim();
      }
      return err.error;
    }

    // If backend returns a JSON object (like ProblemDetails or custom error object)
    if (err.error && typeof err.error === 'object') {
      if (err.error.message) return err.error.message;
      if (err.error.detail) return err.error.detail;
      if (err.error.title) return err.error.title;
      
      // Sometimes it returns an array of errors
      if (err.error.errors) {
         const firstKey = Object.keys(err.error.errors)[0];
         if (firstKey && err.error.errors[firstKey].length > 0) {
            return err.error.errors[firstKey][0];
         }
      }
    }

    return err.message || defaultMsg;
  }

  loadColors() {
    this.colorService.getColors().subscribe(data => this.colors.set(data));
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => this.categories.set(data));
  }

  loadProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        if (!data) {
          this.isLoading.set(false);
          return;
        }
        this.product.set(data);
        if (data.variants && data.variants.length > 0) {
          const currentId = this.selectedVariant()?.id;
          const found = data.variants.find((v: any) => v.id === currentId);
          this.selectVariant(found || data.variants[0]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.showNotify('Failed to synchronize product data', 'error');
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  openAddVariantModal() {
    this.variantForm.reset({ productId: this.product()?.id || 0, hexCode: '#000000', id: null });
    this.showAddVariantModal.set(true);
  }

  openEditVariantModal(v: ProductVariant) {
    this.variantForm.patchValue({
      id: v.id,
      productId: this.product()?.id || 0,
      colorId: v.colorId || null,
      colorName: v.colorName || '',
      hexCode: v.colorHex || '#000000',
      size: v.size,
      realPrice: v.realPrice,
      price: v.price,
      discount: v.discount || 0,
      stockQuantity: v.stockQuantity,
      code: v.code
    });
    this.showAddVariantModal.set(true);
  }

  onSubmitVariant() {
    if (this.variantForm.invalid || !this.product()) return;

    this.isSubmitting.set(true);
    const formData = new FormData();
    const val = this.variantForm.value;

    if (val.id) formData.append('id', val.id.toString());
    formData.append('productId', this.product()!.id.toString());
    if (val.colorId) {
      formData.append('colorId', val.colorId.toString());
    } else {
      if (val.colorName) formData.append('colorName', val.colorName);
      if (val.hexCode) formData.append('hexCode', val.hexCode);
    }
    formData.append('size', val.size!);
    formData.append('realPrice', val.realPrice!.toString());
    formData.append('price', val.price!.toString());
    formData.append('discount', (val.discount || 0).toString());
    formData.append('stockQuantity', val.stockQuantity!.toString());
    formData.append('code', val.code!);

    this.selectedFiles.forEach(file => {
      formData.append('imageFiles', file);
    });

    const request$ = val.id 
      ? this.variantService.updateVariant(val.id, formData)
      : this.variantService.addVariant(formData);

    request$.subscribe({
      next: () => {
        this.showAddVariantModal.set(false);
        this.variantForm.reset({ productId: this.product()!.id, hexCode: '#000000', id: null });
        this.selectedFiles = [];
        this.loadProduct(this.product()!.id);
        this.isSubmitting.set(false);
        this.showNotify(val.id ? 'Variant updated successfully' : 'Variant successfully deployed', 'success');
      },
      error: (err) => {
        const msg = this.getErrorMessage(err, 'Operation failed. Please check inputs.');
        this.showNotify(msg, 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  openEditProductModal() {
    const p = this.product();
    if (!p) return;
    this.productEditForm.patchValue({
      name: p.name,
      description: p.description,
      categoryId: p.categoryId
    });
    this.showEditProductModal.set(true);
  }

  onSubmitProductEdit() {
    if (this.productEditForm.invalid || !this.product()) return;

    this.isSubmitting.set(true);
    const val = this.productEditForm.value;
    
    const dto = {
      name: val.name,
      description: val.description,
      categoryId: val.categoryId
    };

    this.productService.updateProduct(this.product()!.id, dto).subscribe({
      next: () => {
        this.showEditProductModal.set(false);
        this.loadProduct(this.product()!.id);
        this.isSubmitting.set(false);
        this.showNotify('Product updated successfully', 'success');
      },
      error: (err) => {
        const msg = this.getErrorMessage(err, 'Failed to update product');
        this.showNotify(msg, 'error');
        this.isSubmitting.set(false);
      }
    });
  }

  onDeleteVariant(id: number) {
    const message = this.langService.currentLang() === 'ar' ? 'هل أنت متأكد من حذف هذا النوع؟' : 'Are you sure you want to delete this variant?';
    
    this.confirmation.set({
      message,
      action: () => {
        this.variantService.deleteVariant(id).subscribe({
          next: () => {
            this.loadProduct(this.product()!.id);
            this.showNotify('Variant removed successfully', 'success');
            this.confirmation.set(null);
          },
          error: (err) => {
            const msg = this.getErrorMessage(err, 'Failed to remove variant');
            this.showNotify(msg, 'error');
            this.confirmation.set(null);
          }
        });
      }
    });
  }

  selectVariant(v: ProductVariant) {
    this.selectedVariant.set(v);
    if (v.imageUrls && v.imageUrls.length > 0) {
      this.activeImage.set(v.imageUrls[0]);
    }
  }

  changeImage(url: string) {
    this.activeImage.set(url);
  }

  goBack() {
    this.location.back();
  }
}
