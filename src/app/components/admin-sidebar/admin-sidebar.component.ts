import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LanguageService } from '../../services/language';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ─── Mobile Top Bar ───────────────────────────────────── -->
    <header class="lg:hidden bg-slate-900 text-white px-4 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl shadow-slate-900/30">
      <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
        <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <div>
          <span class="font-black text-base tracking-tight leading-none">{{ langService.t('home.storeName').split(' ')[0] }}</span>
          <span class="block text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-0.5">Admin</span>
        </div>
      </div>
      <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())"
        class="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all">
        @if (isMobileMenuOpen()) {
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        } @else {
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        }
      </button>
    </header>

    <!-- ─── Sidebar ───────────────────────────────────────────── -->
    <aside
      class="fixed inset-y-0 start-0 z-[60] w-72 flex flex-col
             bg-slate-900 text-white
             transition-transform duration-300 ease-in-out
             lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:shadow-none shadow-2xl shadow-slate-900/50"
      [class.translate-x-0]="isMobileMenuOpen()"
      [class.-translate-x-full]="!isMobileMenuOpen() && langService.currentLang() !== 'ar'"
      [class.translate-x-full]="!isMobileMenuOpen() && langService.currentLang() === 'ar'">

      <!-- Logo (desktop) -->
      <div class="p-6 border-b border-white/10 hidden lg:flex items-center gap-4 cursor-pointer group" routerLink="/">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-indigo-500/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <div>
          <span class="font-black text-xl tracking-tighter leading-none block">{{ langService.t('home.storeName').split(' ')[0] }}</span>
          <span class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] mt-1 block">Admin Protocol</span>
        </div>
      </div>

      <!-- Section Label -->
      <div class="px-6 pt-6 pb-2">
        <p class="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Management</p>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
        @for (item of menuItems; track item.id) {
          <button (click)="handleNav(item.id)"
            class="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-start group relative overflow-hidden"
            [class.bg-white]="activeTab() === item.id"
            [class.shadow-lg]="activeTab() === item.id"
            [class.text-slate-900]="activeTab() === item.id"
            [class.text-white/60]="activeTab() !== item.id"
            [class.hover:bg-white/10]="activeTab() !== item.id">

            <!-- Active glow -->
            @if (activeTab() === item.id) {
              <div class="absolute inset-0 bg-gradient-to-r from-indigo-50 to-violet-50 opacity-80"></div>
            }

            <span class="relative w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
              [innerHTML]="item.icon"
              [class.text-indigo-600]="activeTab() === item.id">
            </span>
            <span class="relative font-black text-sm tracking-tight flex-1"
              [class.text-slate-900]="activeTab() === item.id">
              {{ langService.t('admin.sidebar.' + item.id) }}
            </span>

            @if (activeTab() === item.id) {
              <div class="relative w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse shrink-0"></div>
            }
          </button>
        }
      </nav>

      <!-- Footer Actions -->
      <div class="p-4 border-t border-white/10 space-y-2 bg-slate-900 shrink-0">
        <button (click)="langService.toggleLang()"
          class="w-full px-4 py-2.5 rounded-xl border border-white/10 text-[9px] font-black text-white/50 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
          </svg>
          {{ langService.currentLang() === 'ar' ? 'English' : 'عربي' }}
        </button>

        <button (click)="onLogout()"
          class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group">
          <svg class="w-4 h-4 shrink-0 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="font-bold text-xs">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Overlay (mobile) -->
    @if (isMobileMenuOpen()) {
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden"
        (click)="isMobileMenuOpen.set(false)">
      </div>
    }
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
  `]
})
export class AdminSidebarComponent {
  public langService = inject(LanguageService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = input<string>('products');
  tabChange = output<string>();

  isMobileMenuOpen = signal(false);

  menuItems = [
    {
      id: 'products',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
    },
    {
      id: 'categories',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
    },
    {
      id: 'orders',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`
    },
    {
      id: 'reviews',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`
    },
    {
      id: 'colors',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>`
    },
    {
      id: 'badges',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"/></svg>`
    },
    {
      id: 'users',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
    },
    {
      id: 'shipping',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>`
    }
  ];

  handleNav(id: string) {
    this.isMobileMenuOpen.set(false);
    this.tabChange.emit(id);
    this.router.navigate(['/admin'], {
      queryParams: { tab: id },
      queryParamsHandling: 'merge'
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
