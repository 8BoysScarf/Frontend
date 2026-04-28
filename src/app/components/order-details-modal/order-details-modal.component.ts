import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="closeModal()"></div>
      <div class="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-black text-slate-900 uppercase tracking-widest">
                {{ langService.t('orders.orderDetails') || 'Order Details' }}
              </h2>
              @if (order) {
                <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                  [ngClass]="getStatusClass(order.status)">
                  {{ order.status }}
                </span>
              }
            </div>
            @if (order) {
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: #{{ order.id }}</p>
            }
          </div>
          <button (click)="closeModal()" class="text-slate-400 hover:text-slate-900 transition-colors p-2 bg-white rounded-full shadow-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
          @if (isLoading) {
            <div class="flex flex-col items-center justify-center py-20 space-y-4">
              <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Protocol...</p>
            </div>
          } @else if (order) {
            <div class="space-y-6">
              <!-- Customer Card (Admin Only) -->
              @if (authService.currentUser()?.roles?.includes('Admin') && order.customerName) {
              <div class="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  @if (order.customerProfile) {
                    <img [src]="order.customerProfile" class="w-full h-full object-cover">
                  } @else {
                    <span class="text-xl font-black text-indigo-400 uppercase">{{ order.customerName?.[0] }}</span>
                  }
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Order Owner</p>
                  <h3 class="text-base font-black text-slate-900 truncate">{{ order.customerName }}</h3>
                  <p class="text-[10px] font-bold text-slate-500">ID: {{ order.customerId }}</p>
                </div>
              </div>
              }

              <!-- Items List -->
              <div class="space-y-3">
                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Payload</h4>
                <div class="space-y-2">
                  @for (item of order.items; track item.productVariantId) {
                    <div (click)="navigateToProduct(item.productId, item.productVariantId)"
                      class="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                      <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                        <img [src]="item.thumbnail || 'https://placehold.co/100x100'" class="w-full h-full object-cover">
                      </div>
                      <div class="flex-1 min-w-0">
                        <h5 class="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">{{ item.productName }}</h5>
                        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{{ item.variantCode }}</p>
                      </div>
                      <div class="text-end">
                        <p class="font-black text-slate-900 text-sm">$\{{ item.price }}</p>
                        <p class="text-[9px] font-bold text-slate-400">Qty: \{{ item.quantity }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Totals -->
              <div class="bg-slate-50 rounded-3xl p-6 space-y-3 border border-slate-100">
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Subtotal</span>
                  <span class="font-black text-slate-900">$\{{ order.totalAmount }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Shipping</span>
                  <span class="font-black text-emerald-600">$\{{ order.shippingPrice }}</span>
                </div>
                <div class="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span class="text-sm font-black text-slate-900 uppercase tracking-widest">Grand Total</span>
                  <span class="text-xl font-black text-indigo-600">$\{{ order.totalAmount + order.shippingPrice }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
    .animate-zoom-in { animation: zoom-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoom-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class OrderDetailsModalComponent {
  langService = inject(LanguageService);
  authService = inject(AuthService);
  router = inject(Router);

  @Input() order: any | null = null;
  @Input() isOpen = false;
  @Input() isLoading = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  navigateToProduct(productId: number, variantId: number) {
    this.closeModal();
    this.router.navigate(['/product', productId], { queryParams: { variantId } });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
}
