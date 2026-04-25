import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Default to Arabic
  currentLang = signal<'ar' | 'en'>(this.getSavedLang() || 'ar');

  translations: any = {
    ar: {
      nav: {
        newArrivals: 'وصلنا حديثاً',
        categories: 'الفئات',
        offers: 'العروض',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        logout: 'تسجيل الخروج'
      },
      hero: {
        badge: '🚀 مجموعة صيف 2026 الجديدة',
        title: 'أعد تعريف <span class="text-indigo-600">أناقتك</span> مع متجر الأولاد الثمانية.',
        desc: 'اكتشف مجموعة مختارة من الملابس والإكسسوارات الفاخرة المصممة للفرد العصري. الجودة تلتقي بالراحة في كل غرزة.',
        shopNow: 'تسوق الآن',
        viewCatalog: 'عرض الكتالوج',
        trustedBy: 'موثوق من قبل'
      },
      home: {
        storeName: 'متجر الأولاد الثمانية',
        featuredItem: 'قطعة مميزة',
        coatName: 'معطف الصوف الليلي',
        collections: 'مجموعات مختارة',
        collectionsDesc: 'استكشف الفئات الأكثر شهرة لدينا هذا الموسم.',
        viewAll: 'عرض الكل',
        footwear: 'أحذية',
        accessories: 'إكسسوارات',
        streetwear: 'ملابس عصرية',
        items: 'قطعة',
        newsletterTitle: 'انضم إلى دائرتنا الخاصة',
        newsletterDesc: 'احصل على وصول حصري لأحدث الصيحات، المبيعات الخاصة، ونصائح الموضة مباشرة إلى بريدك الإلكتروني.',
        subscribe: 'اشترك الآن',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        rights: 'جميع الحقوق محفوظة.'
      },
      login: {
        title: 'مرحباً بعودتك',
        subtitle: 'أدخل بياناتك للوصول إلى حسابك',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPass: 'نسيت كلمة المرور؟',
        submit: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        createAccount: 'إنشاء حساب جديد'
      },
      register: {
        title: 'إنشاء حساب',
        subtitle: 'انضم إلى 8Boys وابدأ رحلة التسوق الخاصة بك',
        fullName: 'الاسم الكامل',
        username: 'اسم المستخدم',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        password: 'كلمة المرور',
        passHint: 'يجب أن تتكون من 6 أحرف على الأقل مع أرقام وحروف.',
        agree: 'بإنشاء حساب، فإنك توافق على <a href="#" class="text-indigo-600 font-semibold underline">شروط الخدمة</a> و <a href="#" class="text-indigo-600 font-semibold underline">سياسة الخصوصية</a>.',
        submit: 'إنشاء حساب',
        hasAccount: 'لديك حساب بالفعل؟',
        signIn: 'سجل دخولك هنا'
      },
      admin: {
        dashboard: {
          title: 'لوحة التحكم'
        },
        nav: {
          products: 'المنتجات',
          categories: 'الفئات',
          colors: 'الألوان',
          badges: 'الأوسمة',
          orders: 'الطلبات'
        },
        sidebar: {
          products: 'إدارة المنتجات',
          categories: 'إدارة الـتصنيفات',
          colors: 'إدارة الألوان',
          badges: 'إدارة الأوسمة',
          orders: 'إدارة الطلبات',
          analysis: 'تحليل الأداء',
          status: 'حالة النظام',
          encrypted: 'اتصال مشفر',
          logout: 'تسجيل الخروج'
        },
        header: {
          protocol: 'بروتوكول المدير',
          welcome: 'مرحبا، المدير',
          desc: 'إدارة المتجر والمزامنة في الوقت الفعلي.',
          catalog: 'كتالوج المنتجات',
          hierarchy: 'هيكل الفئات',
          palette: 'لوحة الألوان',
          stamps: 'نظام الأوسمة',
          access: 'صلاحية المستوى 4',
          online: 'متصل',
          control: 'لوحة تحكم',
          addProduct: 'منتج جديد',
          newCategory: 'فئة جديدة',
          defineColor: 'تعريف لون',
          createBadge: 'إنشاء وسم',
          identity: 'الهوية',
          category: 'الفئة',
          price: 'السعر',
          stock: 'المخزون',
          actions: 'الإجراءات',
          units: 'قطعة',
          depleted: 'نفد',
          activeStamp: 'وسم نشط',
          destroy: 'حذف',
          sub: 'فرعي من',
          ordersTitle: 'وحدة الطلبات قيد الإنشاء',
          ordersDesc: 'سيتوفر تتبع الطلبات ومعالجتها في التحديث القادم.',
          addUnit: 'إضافة وحدة جديدة',
          createCategory: 'إنشاء فئة',
          addColor: 'إضافة لون',
          addBadge: 'إضافة وسم',
          adminPanel: 'لوحة التحكم الإدارية',
          unitName: 'اسم الوحدة',
          description: 'الوصف',
          selectCategory: 'اختر فئة',
          serialCode: 'الرمز التسلسلي',
          colorOption: 'خيار اللون',
          customNoColor: 'مخصص / بدون لون',
          badgeSticker: 'وسم (ملصق)',
          noBadge: 'بدون وسم',
          newColorName: 'اسم لون جديد',
          newHexCode: 'كود لون جديد',
          sizeSpec: 'الحجم / المواصفات',
          initialStock: 'المخزون الأولي',
          cost: 'التكلفة',
          sale: 'سعر البيع',
          disc: 'خصم%',
          unitImages: 'صور الوحدة',
          processing: 'جارٍ المعالجة...',
          deployUnit: 'نشر الوحدة',
          categoryName: 'اسم الفئة',
          parentCategory: 'الفئة الأساسية (اختياري)',
          mainCategory: 'فئة رئيسية',
          hexCode: 'كود اللون',
          colorName: 'اسم اللون',
          badgeName: 'اسم الوسم',
          cancel: 'إلغاء',
          confirm: 'تأكيد',
          confirmOp: 'تأكيد العملية',
          add: 'إضافة'
        },
        stats: {
          products: 'إجمالي المنتجات',
          orders: 'إجمالي الطلبات',
          revenue: 'الأرباح',
          customers: 'العملاء'
        },
        products: {
          title: 'كتالوج المنتجات',
          sync: 'مزامنة قاعدة البيانات نشطة',
          unit: 'تفاصيل الوحدة',
          category: 'المجموعة',
          valuation: 'التقييم',
          inventory: 'حالة المخزون',
          operations: 'العمليات',
          deploy: 'إرسال للمتجر',
          new: 'منتج جديد',
          name: 'اسم المنتج',
          badge: 'الوسم',
          price: 'السعر',
          stock: 'المخزون الأولي',
          img: 'رابط الصورة',
          desc: 'الوصف',
          add: 'إضافة منتج'
        },
        categories: {
          title: 'هيكل الفئات',
          sync: 'تخطيط هيكلي للفئات العالمية',
          new: 'فئة جديدة',
          name: 'اسم الفئة',
          parent: 'الفئة الأب (اختياري)',
          none: 'أساسي (رئيسي)',
          childOf: 'فرعي من: ',
          root: 'مستوى أساسي',
          sub: 'مستوى فرعي',
          map: 'ربط الفئة'
        },
        colors: {
          title: 'إدارة الألوان',
          new: 'لون جديد',
          name: 'اسم اللون',
          hex: 'كود اللون (HEX)',
          preview: 'معاينة',
          add: 'إضافة اللون'
        },
        badges: {
          title: 'إدارة الأوسمة',
          new: 'وسم جديد',
          name: 'اسم الوسم',
          add: 'إضافة الوسم'
        }
      },
      productDetail: {
        back: 'العودة للمتجر',
        backAdmin: 'العودة للوحة التحكم',
        loading: 'جارٍ التحميل...',
        selectOption: 'اختر خياراً',
        variants: 'المتغيرات',
        addVariant: 'إضافة متغير',
        description: 'الوصف',
        noDescription: 'لا يوجد وصف متاح.',
        stock: 'المخزون',
        code: 'الرمز',
        category: 'الفئة',
        price: 'السعر',
        off: '% خصم',
        save: 'وفّر',
        units: 'قطعة',
        outOfStock: 'نفد',
        general: 'عام',
        notFound: 'المنتج غير موجود',
        notFoundDesc: 'المنتج الذي تبحث عنه غير متوفر أو تم نقله.',
        goBack: 'العودة',
        default: 'افتراضي',
        soldOut: 'نفد من المخزون',
        addVariantTitle: 'إضافة متغير جديد',
        configureStock: 'تكوين المخزون لـ',
        size: 'الحجم / المقاس',
        sizePlaceholder: 'مثال: XL، 42، 50ml',
        internalCode: 'الرمز الداخلي',
        inventoryStock: 'كمية المخزون',
        existingColor: 'لون موجود',
        selectColor: 'اختر لوناً (اختياري)',
        newColorName: 'أو اسم لون جديد',
        newColorHex: 'كود اللون الجديد',
        realPrice: 'سعر التكلفة',
        salePrice: 'سعر البيع',
        discount: 'الخصم %',
        variantImages: 'صور المتغير (تحميل متعدد)',
        deploying: 'جارٍ الحفظ...',
        deployVariant: 'حفظ المتغير',
        cancel: 'إلغاء',
        delete: 'حذف',
        confirmDelete: 'هل أنت متأكد؟',
        deleteVariantMsg: 'سيتم حذف هذا المتغير نهائياً ولا يمكن التراجع.'
      }
    },
    en: {
      nav: {
        newArrivals: 'New Arrivals',
        categories: 'Categories',
        offers: 'Offers',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout'
      },
      hero: {
        badge: '🚀 New Summer Collection 2026',
        title: 'Redefine Your <span class="text-indigo-600">Style</span> with 8Boys.',
        desc: 'Discover a curated selection of premium apparel and accessories designed for the modern individual. Quality meets comfort in every stitch.',
        shopNow: 'Shop Now',
        viewCatalog: 'View Catalog',
        trustedBy: 'Trusted By'
      },
      home: {
        storeName: '8Boys Shop',
        featuredItem: 'Featured Item',
        coatName: 'Midnight Wool Coat',
        collections: 'Featured Collections',
        collectionsDesc: 'Explore our most popular categories this season.',
        viewAll: 'View all',
        footwear: 'Footwear',
        accessories: 'Accessories',
        streetwear: 'Streetwear',
        items: 'Items',
        newsletterTitle: 'Join the Inner Circle',
        newsletterDesc: 'Get exclusive access to new arrivals, private sales, and fashion tips delivered straight to your inbox.',
        subscribe: 'Subscribe',
        emailPlaceholder: 'Enter your email',
        rights: '8Boys Ecommerce. All rights reserved.'
      },
      login: {
        title: 'Welcome Back',
        subtitle: 'Enter your credentials to access your account',
        email: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPass: 'Forgot Password?',
        submit: 'Sign In',
        noAccount: "Don't have an account?",
        createAccount: 'Create account'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join 8Boys and start your shopping journey',
        fullName: 'Full Name',
        username: 'Username',
        email: 'Email Address',
        phone: 'Phone Number',
        password: 'Password',
        passHint: 'Must be at least 6 characters with letters and numbers.',
        agree: 'By creating an account, you agree to our <a href="#" class="text-indigo-600 font-semibold underline">Terms of Service</a> and <a href="#" class="text-indigo-600 font-semibold underline">Privacy Policy</a>.',
        submit: 'Create Account',
        hasAccount: 'Already have an account?',
        signIn: 'Sign in here'
      },
      admin: {
        dashboard: {
          title: 'Dashboard'
        },
        nav: {
          products: 'Products',
          categories: 'Categories',
          colors: 'Colors',
          badges: 'Badges',
          orders: 'Orders'
        },
        sidebar: {
          products: 'Manage Products',
          categories: 'Manage Categories',
          colors: 'Manage Colors',
          badges: 'Manage Badges',
          orders: 'Manage Orders',
          analysis: 'Performance Analysis',
          status: 'Node Status',
          encrypted: 'Encrypted Connection',
          logout: 'Terminal Logout'
        },
        header: {
          protocol: 'Admin Protocol',
          welcome: 'Welcome, Manager',
          desc: 'Real-time store management and synchronization.',
          catalog: 'Catalog Grid',
          hierarchy: 'Hierarchy Tree',
          palette: 'Color Palette',
          stamps: 'Badge System',
          access: 'Level 4 Access',
          online: 'Online',
          control: 'Control',
          addProduct: 'New Product',
          newCategory: 'New Category',
          defineColor: 'Define Color',
          createBadge: 'Create Badge',
          identity: 'Identity',
          category: 'Category',
          price: 'Price',
          stock: 'Stock',
          actions: 'Actions',
          units: 'Units',
          depleted: 'Depleted',
          activeStamp: 'Active Stamp',
          destroy: 'Destroy',
          sub: 'Sub',
          ordersTitle: 'Orders Module Under Construction',
          ordersDesc: 'Real-time order tracking and fulfillment will be available in the next update.',
          addUnit: 'Add New Unit',
          createCategory: 'Create Category',
          addColor: 'Define Color',
          addBadge: 'Create Badge',
          adminPanel: 'Administrative Control Panel',
          unitName: 'Unit Name',
          description: 'Description',
          selectCategory: 'Select Category',
          serialCode: 'Serial Code',
          colorOption: 'Color Option',
          customNoColor: 'Custom / No Color',
          badgeSticker: 'Badge (Sticker)',
          noBadge: 'No Badge',
          newColorName: 'New Color Name',
          newHexCode: 'New Hex Code',
          sizeSpec: 'Size / Spec',
          initialStock: 'Initial Stock',
          cost: 'Cost',
          sale: 'Sale',
          disc: 'Disc%',
          unitImages: 'Unit Images',
          processing: 'Processing...',
          deployUnit: 'Deploy Unit',
          categoryName: 'Category Name',
          parentCategory: 'Parent Category (Optional)',
          mainCategory: 'Main Category',
          hexCode: 'Hex Code',
          colorName: 'Color Name',
          badgeName: 'Badge Name',
          cancel: 'Cancel',
          confirm: 'Confirm',
          confirmOp: 'Confirm Operation',
          add: 'Add'
        },
        stats: {
          products: 'Total Products',
          orders: 'Total Orders',
          revenue: 'Revenue',
          customers: 'Customers'
        },
        products: {
          title: 'Product Catalog',
          sync: 'Live database synchronization active',
          unit: 'Unit Details',
          category: 'Collection',
          valuation: 'Valuation',
          inventory: 'Inventory Status',
          operations: 'Operations',
          deploy: 'Deploy to Store',
          new: 'New Product',
          name: 'Product Designation',
          badge: 'Product Badge',
          price: 'Price (USD)',
          stock: 'Initial Stock',
          img: 'Media Assets (URL)',
          desc: 'Description',
          add: 'Add Product'
        },
        categories: {
          title: 'System Hierarchy',
          sync: 'Structural mapping of global categories',
          new: 'New Category',
          name: 'Identifier Name',
          parent: 'Parent Entity Mapping',
          none: 'None (Primary)',
          childOf: 'Child of: ',
          root: 'Root Level',
          sub: 'Sub Level',
          map: 'Map Category'
        },
        colors: {
          title: 'Color Management',
          new: 'New Color',
          name: 'Color Name',
          hex: 'Hex Code',
          preview: 'Preview',
          add: 'Add Color'
        },
        badges: {
          title: 'Badge Management',
          new: 'New Badge',
          name: 'Badge Name',
          add: 'Add Badge'
        }
      },
      productDetail: {
        back: 'Back',
        backAdmin: 'Dashboard',
        loading: 'Loading...',
        selectOption: 'Select Option',
        variants: 'Variants',
        addVariant: 'Add Variant',
        description: 'Description',
        noDescription: 'No description available.',
        stock: 'Stock',
        code: 'Code',
        category: 'Category',
        price: 'Price',
        off: '% OFF',
        save: 'Save',
        units: 'units',
        outOfStock: 'Out',
        general: 'General',
        notFound: 'Product Not Found',
        notFoundDesc: 'The product you are looking for has been moved or is unavailable.',
        goBack: 'Go Back',
        default: 'Default',
        soldOut: 'Sold Out',
        addVariantTitle: 'Add New Variant',
        configureStock: 'Configure Stock for',
        size: 'Size / Dimensions',
        sizePlaceholder: 'e.g. XL, 42, 50ml',
        internalCode: 'Internal Code',
        inventoryStock: 'Inventory Stock',
        existingColor: 'Existing Color',
        selectColor: 'Select Color (Optional)',
        newColorName: 'Or New Color Name',
        newColorHex: 'New Color Hex Code',
        realPrice: 'Real Cost Price',
        salePrice: 'Sale Price',
        discount: 'Discount %',
        variantImages: 'Variant Images (Multi-upload)',
        deploying: 'Saving...',
        deployVariant: 'Deploy Variant',
        cancel: 'Cancel',
        delete: 'Delete',
        confirmDelete: 'Are you sure?',
        deleteVariantMsg: 'This variant will be permanently deleted and cannot be undone.'
      }
    }
  };

  constructor() {
    // Update document direction and lang attribute whenever currentLang changes
    effect(() => {
      const lang = this.currentLang();
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    });
  }

  toggleLang() {
    this.currentLang.set(this.currentLang() === 'ar' ? 'en' : 'ar');
  }

  t(key: string): string {
    const keys = key.split('.');
    let result = this.translations[this.currentLang()];
    for (const k of keys) {
      if (result) result = result[k];
    }
    return result || key;
  }

  private getSavedLang(): 'ar' | 'en' | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lang') as 'ar' | 'en';
    }
    return null;
  }
}
