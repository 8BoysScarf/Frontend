import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService, OrderSummaryDTO } from '../../services/order';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';
import { Location } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { OrderDetailsModalComponent } from '../../components/order-details-modal/order-details-modal.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, OrderDetailsModalComponent],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {
  orderService = inject(OrderService);
  langService = inject(LanguageService);
  authService = inject(AuthService);
  location = inject(Location);

  orders = signal<OrderSummaryDTO[]>([]);
  isLoading = signal(true);
  
  selectedOrderDetails = signal<any | null>(null);
  showOrderDetailsModal = false;
  isOrderLoading = false;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        console.log(data);
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
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

  viewOrderDetails(id: number) {
    this.isOrderLoading = true;
    this.showOrderDetailsModal = true;
    this.selectedOrderDetails.set(null);
    
    this.orderService.getOrderDetails(id).subscribe({
      next: (data) => {
        this.selectedOrderDetails.set(data);
        this.isOrderLoading = false;
      },
      error: () => {
        this.isOrderLoading = false;
        this.showOrderDetailsModal = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
