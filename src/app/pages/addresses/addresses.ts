import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AddressService, Address, AddAddressDTO, UpdateAddressDTO } from '../../services/address';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { ShippingService, CityShipping } from '../../services/shipping';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './addresses.html'
})
export class AddressesComponent implements OnInit {
  addressService = inject(AddressService);
  shippingService = inject(ShippingService);
  langService = inject(LanguageService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  location = inject(Location);
  cartService = inject(CartService);

  addresses = signal<Address[]>([]);
  cities = signal<CityShipping[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  showModal = signal(false);
  notification = signal<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  confirmation = signal<{ message: string, action: () => void } | null>(null);

  addressForm = this.fb.group({
    id: [null as number | null],
    city: ['', Validators.required],
    street: ['', Validators.required],
    isDefault: [false]
  });

  ngOnInit() {
    this.loadAddresses();
    this.loadCities();
  }

  loadCities() {
    this.shippingService.getAllCityPrices().subscribe({
      next: (data) => this.cities.set(data),
      error: () => console.error('Failed to load cities')
    });
  }

  loadAddresses() {
    this.isLoading.set(true);
    this.addressService.getAll().subscribe({
      next: (data) => {
        // Sort default address first
        const sorted = data.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
        this.addresses.set(sorted);
        this.isLoading.set(false);
      },
      error: () => {
        this.showNotify(this.langService.t('addresses.loadError') || 'Failed to load addresses', 'error');
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.addressForm.reset({ isDefault: false, id: null });
    this.showModal.set(true);
  }

  openEditModal(address: Address) {
    this.addressForm.patchValue({
      id: address.id,
      city: address.city,
      street: address.street,
      isDefault: address.isDefault
    });
    this.showModal.set(true);
  }

  onSubmit() {
    if (this.addressForm.invalid) return;
    this.isSubmitting.set(true);

    const val = this.addressForm.value;
    
    if (val.id) {
      // Update
      const dto: UpdateAddressDTO = {
        id: val.id,
        city: val.city!,
        street: val.street!,
        isDefault: val.isDefault || false
      };
      this.addressService.update(val.id, dto).subscribe({
        next: () => {
          this.showNotify(this.langService.t('addresses.updateSuccess') || 'Address updated successfully', 'success');
          this.closeModalAndReload();
        },
        error: () => {
          this.showNotify(this.langService.t('addresses.updateError') || 'Failed to update address', 'error');
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Add
      const dto: AddAddressDTO = {
        city: val.city!,
        street: val.street!,
        isDefault: val.isDefault || false
      };
      this.addressService.add(dto).subscribe({
        next: () => {
          this.showNotify(this.langService.t('addresses.addSuccess') || 'Address added successfully', 'success');
          this.closeModalAndReload();
        },
        error: () => {
          this.showNotify(this.langService.t('addresses.addError') || 'Failed to add address', 'error');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  onDelete(id: number) {
    const message = this.langService.currentLang() === 'ar' 
      ? 'هل أنت متأكد من حذف هذا العنوان؟' 
      : 'Are you sure you want to delete this address?';

    this.confirmation.set({
      message,
      action: () => {
        this.addressService.delete(id).subscribe({
          next: () => {
            this.showNotify(this.langService.t('addresses.deleteSuccess') || 'Address deleted', 'success');
            this.loadAddresses();
            this.confirmation.set(null);
          },
          error: () => {
            this.showNotify(this.langService.t('addresses.deleteError') || 'Failed to delete address', 'error');
            this.confirmation.set(null);
          }
        });
      }
    });
  }

  onSetDefault(id: number) {
    this.addressService.setDefault(id).subscribe({
      next: () => {
        this.showNotify(this.langService.t('addresses.defaultSuccess') || 'Default address updated', 'success');
        this.loadAddresses();
      },
      error: () => {
        this.showNotify(this.langService.t('addresses.defaultError') || 'Failed to set default', 'error');
      }
    });
  }

  private closeModalAndReload() {
    this.showModal.set(false);
    this.isSubmitting.set(false);
    this.loadAddresses();
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
  }
}
