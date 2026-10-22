'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Package, Truck, X, ShoppingCart, Trash2, MessageCircle, Phone, Share2, QrCode, Layers, Printer, Tag, Menu, FileText, CheckCircle2, ChevronRight, Info, ChevronLeft, UserCheck, ChevronDown, PartyPopper, Plus, Minus, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CONTACT_CONFIG } from '@/lib/contact-config';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  sku: string;
  price_retail: number;
  price_wholesale: number;
  moq: number;
  stock: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const categoriesList = [
  { id: 'All', name: 'عرض الكل' },
  { id: 'Fuser', name: '🔥 سخانات (Fuser)' },
  { id: 'Drum', name: '⚙️ أسطوانات (Drum)' },
  { id: 'Roller', name: '📄 بكرات سحب (Roller)' },
  { id: 'Mechanical', name: '🔧 ميكانيكي (Mechanical)' },
  { id: 'Consumables', name: '💡 مستلزمات (Consumables)' }
];

const brandsList = ['HP', 'Canon', 'Kyocera', 'Epson', 'Brother', 'Xerox', 'Ricoh'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'category' | 'brand' | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTechnicianModalOpen, setIsTechnicianModalOpen] = useState(false);
  
  const [isWholesaleQuoteOpen, setIsWholesaleQuoteOpen] = useState(false);
  const [wholesaleName, setWholesaleName] = useState('');
  const [wholesalePhone, setWholesalePhone] = useState('');
  const [wholesaleEmail, setWholesaleEmail] = useState('');
  const [wholesaleMessage, setWholesaleMessage] = useState('');

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [savedOrderDetails, setSavedOrderDetails] = useState('');

  const [deleteToast, setDeleteToast] = useState<{show: boolean, message: string}>({ show: false, message: '' });

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // إشعار الإضافة السريع للسلة (Toast)
  const [toastNotification, setToastNotification] = useState<{show: boolean, productName: string}>({ show: false, productName: '' });

  const contactModalRef = useRef<HTMLDivElement>(null);
  const techModalRef = useRef<HTMLDivElement>(null);
  const successModalRef = useRef<HTMLDivElement>(null);
  const wholesaleModalRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        setProducts(data);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (contactModalRef.current && !contactModalRef.current.contains(event.target as Node)) {
        setIsContactOpen(false);
      }
      if (techModalRef.current && !techModalRef.current.contains(event.target as Node)) {
        setIsTechnicianModalOpen(false);
      }
      if (successModalRef.current && !successModalRef.current.contains(event.target as Node)) {
        setIsSuccessModalOpen(false);
      }
      if (wholesaleModalRef.current && !wholesaleModalRef.current.contains(event.target as Node)) {
        setIsWholesaleQuoteOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMainMenuOpen(false);
        setActiveSubMenu(null);
        setSelectedCategory('All');
        setSelectedBrand('All');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAllMenus = () => {
    setIsMainMenuOpen(false);
    setActiveSubMenu(null);
  };

  const openCart = () => {
    closeAllMenus();
    setSelectedCategory('All');
    setSelectedBrand('All');
    setIsCartOpen(true);
  };

  const openContact = () => {
    closeAllMenus();
    setSelectedCategory('All');
    setSelectedBrand('All');
    setIsContactOpen(true);
  };

  // دالة الإضافة الهادئة والمشجعة للتسوق المتعدد
  const handleAddToCart = (product: Product) => {
    closeAllMenus();
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // إظهار إشعار سريع دون مقاطعة التصفح
    setToastNotification({ show: true, productName: product.name });
    setTimeout(() => {
      setToastNotification({ show: false, productName: '' });
    }, 2500);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number, itemName: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    setDeleteToast({ show: true, message: `تم حذف "${itemName}" من السلة` });
    setTimeout(() => {
      setDeleteToast({ show: false, message: '' });
    }, 2500);
  };

  const totalCartAmount = cart.reduce((sum, item) => {
    return sum + (item.price_retail * item.quantity);
  }, 0);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendWholesaleQuote = () => {
    if (!wholesaleName || !wholesalePhone || !wholesaleEmail || !wholesaleMessage) {
      alert('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    let message = `📋 *طلب تسعيرة جملة / كميات جديد (B2B)*\n\n`;
    message += `👤 *معلومات الزبون / المحل:*\n`;
    message += ` - الاسم: ${wholesaleName}\n`;
    message += ` - الهاتف: ${wholesalePhone}\n`;
    message += ` - البريد الإلكتروني: ${wholesaleEmail}\n\n`;
    message += `📦 *الاستفسار والكميات المطلوبة:*\n`;
    message += `${wholesaleMessage}\n\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "213558166474"; 
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');
    setIsWholesaleQuoteOpen(false);
    setWholesaleName('');
    setWholesalePhone('');
    setWholesaleEmail('');
    setWholesaleMessage('');
    alert('تم إرسال طلبك بنجاح عبر الواتساب!');
  };

  const handleProcessOrder = () => {
    if (cart.length === 0) {
      alert('السلة فارغة!');
      return;
    }
    if (!customerName || !customerPhone || !customerAddress) {
      alert('يرجى ملء الاسم، رقم الهاتف، وعنوان التوصيل بدقة.');
      return;
    }
    if (!agreeTerms) {
      alert('يرجى الموافقة على شروط إتمام الشراء.');
      return;
    }

    let message = `🛒 *طلب تجزئة جديد عبر متجر Aira Pro*\n\n`;
    message += `👤 *معلومات الزبون:*\n`;
    message += ` - الاسم: ${customerName}\n`;
    message += ` - الهاتف: ${customerPhone}\n`;
    message += ` - العنوان: ${customerAddress}\n\n`;
    message += `📦 *المنتجات المطلوبة:*\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (SKU: ${item.sku}) - الكمية: ${item.quantity} - السعر: ${item.price_retail} دج\n`;
    });

    message += `\n-------------------\n`;
    message += `💰 *المبلغ الإجمالي للمنتجات: ${totalCartAmount} دج*\n`;
    message += `🚚 *ملاحظة الشحن:* يتم الاتفاق على شركة الشحن المناسبة (Yalidine / World Express / Kazi Tour) وتكلفته عبر الواتساب.\n\n`;
    message += `✅ وافق الزبون على شروط الطلب.`;

    setSavedOrderDetails(message);
    setIsCartOpen(false);
    setIsSuccessModalOpen(true);
  };

  const sendToWhatsAppFinal = () => {
    const encodedMessage = encodeURIComponent(savedOrderDetails);
    const whatsappNumber = "213558166474"; 
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
    setIsSuccessModalOpen(false);
    setCart([]);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();

    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 relative overflow-x-hidden" dir="rtl">
      
      {/* إشعار الإضافة السريع المشجع للتسوق المتعدد (Toast) */}
      {toastNotification.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-orange-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-500">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <div className="text-xs">
              <p className="font-bold">أُضيف للسلة بنجاح!</p>
              <p className="text-[11px] text-orange-100 line-clamp-1">{toastNotification.productName}</p>
            </div>
            <button 
              onClick={() => { setToastNotification({ show: false, productName: '' }); openCart(); }}
              className="bg-white text-orange-700 hover:bg-orange-50 px-2.5 py-1 rounded-lg text-[10px] font-extrabold mr-2 shadow-sm transition"
            >
              عرض السلة ({totalItemsCount})
            </button>
          </div>
        </div>
      )}

      {deleteToast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-800">
            <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />
            <span className="text-xs font-semibold">{deleteToast.message}</span>
          </div>
        </div>
      )}

      {/* نافذة التهنئة للزبون */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          <div ref={successModalRef} className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative text-center border-4 border-orange-100" dir="rtl">
            <button onClick={() => setIsSuccessModalOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <PartyPopper className="w-8 h-8"/>
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-2">تهانينا الحارة! 🎉</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              شكراً لثقتك بـ <strong className="text-orange-600">Aira Pro</strong>. تم تسجيل طلبيتك بنجاح تام وجاهزة للإرسال إلى فريقنا لتأكيدها وتحديد شركة الشحن الأنسب لك.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={sendToWhatsAppFinal}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> تأكيد وإرسال الطلبية عبر الواتساب
              </button>
              <button 
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-2xl text-xs transition"
              >
                متابعة تصفح المتجر
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة طلب تسعيرة الجملة */}
      {isWholesaleQuoteOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          <div ref={wholesaleModalRef} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative" dir="rtl">
            <button onClick={() => setIsWholesaleQuoteOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <MessageCircle className="w-6 h-6 text-orange-600"/>
              <h3 className="font-bold text-base text-gray-900">طلب تسعيرة الجملة أو استفسار عن كميات</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">الاسم أو اسم المحل / الورشة:</label>
                <input 
                  type="text" 
                  placeholder="مثال: ورشة الطابعات السريعة"
                  value={wholesaleName}
                  onChange={(e) => setWholesaleName(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-600"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">رقم الهاتف:</label>
                  <input 
                    type="text" 
                    placeholder="0550000000"
                    value={wholesalePhone}
                    onChange={(e) => setWholesalePhone(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">البريد الإلكتروني (Email):</label>
                  <input 
                    type="email" 
                    placeholder="example@domain.com"
                    value={wholesaleEmail}
                    onChange={(e) => setWholesaleEmail(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">القطع والكميات المطلوبة:</label>
                <textarea 
                  rows={4}
                  placeholder="اكتب هنا أسماء القطع، أرقام SKU، والكميات..."
                  value={wholesaleMessage}
                  onChange={(e) => setWholesaleMessage(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-600"
                ></textarea>
              </div>

              <button 
                onClick={handleSendWholesaleQuote}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-xs transition shadow flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4 h-4" /> إرسال الطلب عبر الواتساب مباشرة
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-orange-600 text-white text-[11px] sm:text-xs py-2 px-3 text-center font-medium leading-relaxed">
        متجر Aira Pro - العلمة: توزيع قطع غيار ومستلزمات الطابعات لكافة ولايات الوطن (58 ولاية).
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-40 w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="w-full md:w-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-black tracking-wider font-[family-name:var(--font-audiowide)]">
                AIRA PRO
              </span>
              <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-bold">B2B</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); setIsTechnicianModalOpen(true); }}
                className="hidden md:flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg border border-emerald-200 transition"
              >
                <UserCheck className="w-4 h-4"/> التقنيون
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
                className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
              >
                <Menu className="w-5 h-5"/>
              </button>
            </div>
          </div>

          <div className="w-full md:flex-1 max-w-2xl flex">
            <input 
              type="text" 
              placeholder="البحث برقم القطعة (SKU) أو موديل الطابعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-orange-300 rounded-r-lg rounded-l-none px-3 py-2 focus:outline-none focus:border-orange-600 text-xs text-right"
            />
            <button className="bg-orange-600 text-white px-4 sm:px-6 rounded-l-lg rounded-r-none flex items-center justify-center hover:bg-orange-700 transition">
              <Search className="w-4 h-4"/>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-gray-50 px-3 py-2 rounded-lg border border-gray-200" href="/" onClick={() => { closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); }}>
              <Package className="w-4 h-4 text-orange-600"/>
              <span>الكتالوج</span>
            </Link>

            <button 
              onClick={(e) => { e.stopPropagation(); closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); setIsWholesaleQuoteOpen(true); }}
              className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg border border-orange-200 transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-orange-600"/>
              <span>طلب تسعيرة جملة / كميات</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); openContact(); }}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
            >
              <Phone className="w-4 h-4 text-green-600"/>
              <span>اتصل بنا</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); openCart(); }}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-black px-4 py-2 rounded-lg transition relative shadow"
            >
              <ShoppingCart className="w-4 h-4"/>
              <span>السلة</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex md:hidden items-center justify-between w-full gap-1 pt-1 border-t">
            <Link className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-50 py-1.5 rounded border" href="/" onClick={() => { closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); }}>
              <Package className="w-3.5 h-3.5 text-orange-600"/> الكتالوج
            </Link>
            <button onClick={(e) => { e.stopPropagation(); closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); setIsWholesaleQuoteOpen(true); }} className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 py-1.5 rounded border border-orange-200">
              <MessageCircle className="w-3.5 h-3.5 text-orange-600"/> تسعيرة جملة
            </button>
            <button onClick={(e) => { e.stopPropagation(); openCart(); }} className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold text-white bg-gray-900 py-1.5 rounded relative">
              <ShoppingCart className="w-3.5 h-3.5"/> السلة
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* الشريط الجانبي */}
        <aside className="relative z-30 flex justify-start" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <div className="relative w-48 sm:w-56 lg:w-full">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                const newState = !isMainMenuOpen;
                setIsMainMenuOpen(newState);
                if (!newState) {
                  setActiveSubMenu(null);
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                }
              }}
              className={`bg-white p-3.5 sm:p-4 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-between cursor-pointer border-2 select-none ${
                isMainMenuOpen ? 'border-orange-500 shadow-md bg-orange-50' : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <span className="flex items-center gap-2 font-extrabold text-xs sm:text-sm text-gray-900">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0"/> 
                <span>منتجاتنا المعتمدة</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMainMenuOpen ? 'text-orange-600 rotate-90' : 'text-gray-400'}`} />
            </div>

            {isMainMenuOpen && (
              <div className="absolute top-0 right-full w-44 sm:w-52 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
                
                <div className="relative border-b border-gray-100">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSubMenu(activeSubMenu === 'category' ? null : 'category');
                    }}
                    className={`flex items-center justify-between text-xs sm:text-sm font-bold p-3.5 cursor-pointer rounded-t-xl transition select-none ${
                      activeSubMenu === 'category' ? 'bg-orange-50 text-orange-700' : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-500 shrink-0"/>
                      <span>نوع القطعة</span>
                    </span>
                    <span className="text-gray-400 text-xs">◀</span>
                  </div>

                  {activeSubMenu === 'category' && (
                    <div className="absolute top-0 right-full w-48 sm:w-56 bg-white shadow-2xl rounded-xl border border-gray-200 p-2 z-50">
                      <ul className="space-y-1 text-xs">
                        {categoriesList.map((cat) => (
                          <li 
                            key={cat.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(cat.id);
                              closeAllMenus();
                            }}
                            className={`p-2.5 rounded-lg cursor-pointer font-medium transition flex items-center justify-between ${
                              selectedCategory === cat.id 
                                ? 'bg-orange-600 text-white font-bold shadow-sm' 
                                : 'hover:bg-orange-50 text-gray-700'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {selectedCategory === cat.id && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSubMenu(activeSubMenu === 'brand' ? null : 'brand');
                    }}
                    className={`flex items-center justify-between text-xs sm:text-sm font-bold p-3.5 cursor-pointer rounded-b-xl transition select-none ${
                      activeSubMenu === 'brand' ? 'bg-orange-50 text-orange-700' : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-orange-500 shrink-0"/>
                      <span>نوع الطابعة (Brand)</span>
                    </span>
                    <span className="text-gray-400 text-xs">◀</span>
                  </div>

                  {activeSubMenu === 'brand' && (
                    <div className="absolute top-0 right-full w-48 sm:w-56 bg-white shadow-2xl rounded-xl border border-gray-200 p-2 z-50">
                      <ul className="space-y-1 text-xs">
                        <li 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBrand('All');
                            closeAllMenus();
                          }}
                          className={`p-2.5 rounded-lg cursor-pointer font-bold transition flex items-center justify-between ${
                            selectedBrand === 'All' 
                              ? 'bg-orange-600 text-white font-bold shadow-sm' 
                              : 'hover:bg-orange-50 text-gray-700'
                          }`}
                        >
                          <span>جميع الطابعات</span>
                          {selectedBrand === 'All' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                        </li>
                        {brandsList.map((brand) => (
                          <li 
                            key={brand} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBrand(brand);
                              closeAllMenus();
                            }}
                            className={`p-2.5 rounded-lg cursor-pointer font-medium transition flex items-center justify-between ${
                              selectedBrand === brand 
                                ? 'bg-orange-600 text-white font-bold shadow-sm' 
                                : 'hover:bg-orange-50 text-gray-700'
                            }`}
                          >
                            <span>طابعات {brand}</span>
                            {selectedBrand === brand && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </aside>

        <section className="lg:col-span-3 relative z-10" onClick={() => { closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); }}>
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500">عرض {filteredProducts.length} منتج</span>
            <h1 className="font-bold text-sm sm:text-base text-gray-800 text-center">قائمة قطع الغيار والمستهلكات المتوفرة</h1>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-lg text-center text-gray-500 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-500">لا توجد منتجات مطابقة لتحديداتك حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="h-40 w-full bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border">
                      {product.image && typeof product.image === 'string' && product.image.trim().startsWith('http') ? (
                        <img src={product.image.trim()} alt={product.name} className="h-full w-full object-contain p-2" />
                      ) : (
                        <span className="text-4xl">{product.image || '📦'}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">{product.category || 'General'}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-bold">SKU: {product.sku}</span>
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm mt-2 text-gray-800 line-clamp-2 leading-relaxed">{product.name}</h3>
                    
                    <div className="mt-3 bg-gray-50 p-2 rounded-lg border border-gray-100 flex justify-between items-center">
                      <span className="text-[11px] text-gray-600">السعر:</span>
                      <span className="font-black text-gray-900 text-sm">{product.price_retail} دج</span>
                    </div>
                    <div className="mt-1 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); closeAllMenus(); setSelectedCategory('All'); setSelectedBrand('All'); setIsWholesaleQuoteOpen(true); }}
                        className="text-[11px] text-orange-600 hover:text-orange-800 font-bold underline transition"
                      >
                        هل تطلب كميات أو جملة؟ اطلب التسعيرة الخاصة بك
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                        className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs px-2 py-2.5 rounded-lg font-bold transition flex justify-center items-center gap-1 border border-gray-200"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> إضافة
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); openCart(); }}
                        className="flex-1 bg-orange-600 text-white hover:bg-orange-700 text-xs px-2 py-2.5 rounded-lg font-bold transition shadow-sm"
                      >
                        شراء الآن
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* نافذة حساب التقنيين */}
      {isTechnicianModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div ref={techModalRef} className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative text-center" dir="rtl">
            <button onClick={() => setIsTechnicianModalOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6"/>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">حساب خاص بالتقنيين</h3>
            <p className="text-xs text-gray-500 mb-4">هذا الفضاء مخصص للتقنيين المعتمدين للاستفادة من أسعار خاصة ودعم فني مباشر.</p>
            
            <div className="space-y-3 text-right">
              <input type="text" placeholder="اسم التقني أو الورشة" className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600" />
              <input type="text" placeholder="رقم الهاتف" className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600" />
              <input type="text" placeholder="رقم الاعتماد أو ولاية النشاط" className="w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-600" />
            </div>

            <button 
              onClick={() => { alert('تم إرسال طلب انضمام كتقني بنجاح! سنتصل بك قريباً.'); setIsTechnicianModalOpen(false); }}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
            >
              طلب فتح حساب تقني
            </button>
          </div>
        </div>
      )}

      {/* نافذة الاتصال */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <div ref={contactModalRef} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative" dir="rtl">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Phone className="w-6 h-6 text-orange-600"/>
              <h3 className="font-bold text-base sm:text-lg text-gray-800">معلومات الاتصال (Aira Pro)</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">تواصل معنا مباشرة عبر الهاتف، الواتساب، الويشات، أو صفحة الفيسبوك:</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-500 transition group">
                <a href={CONTACT_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full">
                    <MessageCircle className="w-5 h-5"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-green-700">واتساب / هاتف</h4>
                    <span className="text-xs text-gray-500">{CONTACT_CONFIG.phone}</span>
                  </div>
                </a>
              </div>
            </div>
            <button onClick={() => setIsContactOpen(false)} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg text-xs transition mt-4 shadow">
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* سلة الطلبات */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-600"/>
                <h2 className="font-bold text-sm sm:text-base text-gray-800">سلة الطلبات ({totalItemsCount})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="py-4 space-y-4 border-b">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  السلة فارغة
                </div>
              ) : (
                cart.map((item) => {
                  return (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3 gap-3">
                      <div className="h-10 w-10 bg-gray-50 rounded flex items-center justify-center overflow-hidden border shrink-0">
                        {item.image && typeof item.image === 'string' && item.image.trim().startsWith('http') ? (
                          <img src={item.image.trim()} alt={item.name} className="h-full w-full object-contain p-1" />
                        ) : (
                          <span className="text-lg">{item.image || '📦'}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-xs text-gray-800 line-clamp-1">{item.name}</h4>
                        <div className="text-xs font-bold text-orange-600 mt-0.5">
                          {item.price_retail} دج للقطعة
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-6 h-6 rounded flex items-center justify-center font-bold text-xs border"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-6 h-6 rounded flex items-center justify-center font-bold text-xs border"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] text-gray-400 mr-2">(المجموع: {item.price_retail * item.quantity} دج)</span>
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(item.id, item.name)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 space-y-3">
                <h3 className="font-bold text-xs text-gray-800">معلومات الزبون لإنهاء الطلب:</h3>
                <input 
                  type="text" 
                  placeholder="الاسم ولقب أو اسم المحل / الورشة" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-orange-600"
                />
                <input 
                  type="text" 
                  placeholder="رقم الهاتف (مثال: 0550000000)" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-orange-600"
                />
                <input 
                  type="text" 
                  placeholder="عنوان الاستلام الدقيق (المدينة / الحي)" 
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-orange-600"
                />

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="terms" className="text-[11px] text-gray-600 select-none">
                    أوافق على صحة الطلبية وشروط التوصيل والاستلام.
                  </label>
                </div>

                <div className="bg-orange-50 p-2.5 rounded-lg text-[11px] text-orange-800 leading-relaxed border border-orange-200">
                  🚚 <strong>ملاحظة التوصيل:</strong> يتم الاتفاق على شركة الشحن (Yalidine / World Express / Kazi Tour) وتكلفته هاتفياً عبر الواتساب بعد تأكيد الطلب.
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-gray-900 pt-2 border-t">
                  <span>المبلغ الإجمالي للمنتجات:</span>
                  <span className="text-green-700 text-base">{totalCartAmount} دج</span>
                </div>

                <button 
                  onClick={handleProcessOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition text-xs shadow flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" /> إتمام الشراء الآن وتأكيد الطلب
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}