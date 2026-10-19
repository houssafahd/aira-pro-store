'use client';
import { useState, useEffect } from 'react';
import { Search, Package, Truck, ChevronRight, X, ShoppingCart, Trash2, MessageCircle, Phone, Share2, QrCode, Layers, Printer, Tag, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CONTACT_CONFIG } from '@/lib/contact-config';

const wilayas = [
  { id: 1, name: '01 - أدرار', homeFee: 1000, deskFee: 800 },
  { id: 2, name: '02 - الشلف', homeFee: 650, deskFee: 450 },
  { id: 3, name: '03 - الأغواط', homeFee: 800, deskFee: 600 },
  { id: 4, name: '04 - أم البواقي', homeFee: 500, deskFee: 350 },
  { id: 5, name: '05 - باتنة', homeFee: 550, deskFee: 400 },
  { id: 6, name: '06 - بجاية', homeFee: 500, deskFee: 350 },
  { id: 7, name: '07 - بسكرة', homeFee: 700, deskFee: 500 },
  { id: 8, name: '08 - بشار', homeFee: 1000, deskFee: 800 },
  { id: 9, name: '09 - البليدة', homeFee: 600, deskFee: 400 },
  { id: 10, name: '10 - البويرة', homeFee: 550, deskFee: 400 },
  { id: 11, name: '11 - تمنراست', homeFee: 1200, deskFee: 1000 },
  { id: 12, name: '12 - تبسة', homeFee: 650, deskFee: 450 },
  { id: 13, name: '13 - تلمسان', homeFee: 800, deskFee: 600 },
  { id: 14, name: '14 - تيارت', homeFee: 700, deskFee: 500 },
  { id: 15, name: '15 - تيزي وزو', homeFee: 600, deskFee: 400 },
  { id: 16, name: '16 - الجزائر العاصمة', homeFee: 600, deskFee: 400 },
  { id: 17, name: '17 - الجلفة', homeFee: 750, deskFee: 550 },
  { id: 18, name: '18 - جيجل', homeFee: 550, deskFee: 400 },
  { id: 19, name: '19 - سطيف (العلمة)', homeFee: 300, deskFee: 200 },
  { id: 20, name: '20 - سعيدة', homeFee: 750, deskFee: 550 },
  { id: 21, name: '21 - سكيكدة', homeFee: 550, deskFee: 400 },
  { id: 22, name: '22 - سيدي بلعباس', homeFee: 800, deskFee: 600 },
  { id: 23, name: '23 - عنابة', homeFee: 600, deskFee: 400 },
  { id: 24, name: '24 - قالمة', homeFee: 600, deskFee: 400 },
  { id: 25, name: '25 - قسنطينة', homeFee: 500, deskFee: 350 },
  { id: 26, name: '26 - المدية', homeFee: 650, deskFee: 450 },
  { id: 27, name: '27 - مستغانم', homeFee: 700, deskFee: 500 },
  { id: 28, name: '28 - المسيلة', homeFee: 600, deskFee: 400 },
  { id: 29, name: '29 - معسكر', homeFee: 750, deskFee: 550 },
  { id: 30, name: '30 - ورقلة', homeFee: 900, deskFee: 700 },
  { id: 31, name: '31 - وهران', homeFee: 700, deskFee: 450 },
  { id: 32, name: '32 - البيض', homeFee: 900, deskFee: 700 },
  { id: 33, name: '33 - إليزي', homeFee: 1300, deskFee: 1100 },
  { id: 34, name: '34 - برج بوعريريج', homeFee: 450, deskFee: 300 },
  { id: 35, name: '35 - بومرداس', homeFee: 600, deskFee: 400 },
  { id: 36, name: '36 - الطارف', homeFee: 650, deskFee: 450 },
  { id: 37, name: '37 - تندوف', homeFee: 1300, deskFee: 1100 },
  { id: 38, name: '38 - تيسمسيلت', homeFee: 700, deskFee: 500 },
  { id: 39, name: '39 - الوادي', homeFee: 850, deskFee: 650 },
  { id: 40, name: '40 - خنشلة', homeFee: 600, deskFee: 400 },
  { id: 41, name: '41 - سوق أهراس', homeFee: 650, deskFee: 450 },
  { id: 42, name: '42 - تيبازة', homeFee: 650, deskFee: 450 },
  { id: 43, name: '43 - ميلة', homeFee: 500, deskFee: 350 },
  { id: 44, name: '44 - عين الدفلى', homeFee: 650, deskFee: 450 },
  { id: 45, name: '45 - النعامة', homeFee: 900, deskFee: 700 },
  { id: 46, name: '46 - عين تموشنت', homeFee: 800, deskFee: 600 },
  { id: 47, name: '47 - غرداية', homeFee: 850, deskFee: 650 },
  { id: 48, name: '48 - غليزان', homeFee: 750, deskFee: 550 },
  { id: 49, name: '49 - تقرت', homeFee: 900, deskFee: 700 },
  { id: 50, name: '50 - المغير', homeFee: 850, deskFee: 650 },
  { id: 51, name: '51 - المنيعة', homeFee: 800, deskFee: 600 },
  { id: 52, name: '52 - أولاد جلال', homeFee: 750, deskFee: 550 },
  { id: 53, name: '53 - بني عباس', homeFee: 1000, deskFee: 800 },
  { id: 54, name: '54 - عين صالح', homeFee: 1200, deskFee: 1000 },
  { id: 55, name: '55 - عين قزام', homeFee: 1300, deskFee: 1100 },
  { id: 56, name: '56 - تقرت', homeFee: 900, deskFee: 700 },
  { id: 57, name: '57 - جانت', homeFee: 1300, deskFee: 1100 },
  { id: 58, name: '58 - المغير', homeFee: 850, deskFee: 650 }
];

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
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<'whatsapp' | 'wechat' | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState(wilayas[18]);
  const [shippingType, setShippingType] = useState<'home' | 'desk'>('home');

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

  const currentFee = shippingType === 'home' ? selectedWilaya.homeFee : selectedWilaya.deskFee;

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: product.moq }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const totalCartAmount = cart.reduce((sum, item) => {
    const unitPrice = item.quantity >= item.moq ? item.price_wholesale : item.price_retail;
    return sum + (unitPrice * item.quantity);
  }, 0);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
    <div className="min-h-screen bg-gray-100 text-gray-800 relative" dir="rtl">
      <div className="bg-orange-600 text-white text-xs py-1.5 px-4 text-center font-medium">
        متجر Aira Pro - العلمة: توزيع قطع غيار ومستلزمات الطابعات لكافة ولايات الوطن (58 ولاية).
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-black tracking-wider font-[family-name:var(--font-audiowide)]">
              AIRA PRO
            </span>
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-bold">B2B</span>
          </div>

          <div className="flex-1 max-w-2xl flex">
            <input 
              type="text" 
              placeholder="البحث برقم القطعة (OEM Code) أو موديل الطابعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-orange-300 rounded-r-md rounded-l-none px-4 py-2 focus:outline-none focus:border-orange-600 text-sm text-right"
            />
            <button className="bg-orange-600 text-white px-6 rounded-l-md rounded-r-none flex items-center justify-center hover:bg-orange-700 transition">
              <Search className="w-5 h-5"/>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-gray-50 px-3 py-2 rounded-lg border border-gray-200" href="/">
              <Package className="w-4 h-4 text-orange-600"/>
              <span>الكتالوج</span>
            </Link>

            <Link className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-gray-50 px-3 py-2 rounded-lg border border-gray-200" href="/inventory">
              <Package className="w-4 h-4 text-orange-600"/>
              <span>المخزون</span>
            </Link>
            
            <button 
              onClick={() => setIsShippingOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
            >
              <Truck className="w-4 h-4 text-orange-600"/>
              <span>الشحن</span>
            </button>

            <button 
              onClick={() => setIsContactOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-orange-600 transition bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
            >
              <Phone className="w-4 h-4 text-green-600"/>
              <span>اتصل بنا</span>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition relative shadow"
            >
              <ShoppingCart className="w-4 h-4"/>
              <span>السلة</span>
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            
            <div className="font-extrabold text-gray-900 border-b pb-2 mb-3 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600"/> التصنيفات
              </span>
            </div>

            <div 
              className="mb-3 border-b pb-3"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <div 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between text-xs font-bold text-gray-700 cursor-pointer p-2 hover:bg-orange-50 rounded-lg transition select-none"
              >
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-orange-500"/> نوع القطعة
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </div>

              {isCategoriesOpen && (
                <ul className="space-y-1 text-xs mt-2 pr-2 animate-fadeIn">
                  {categoriesList.map((cat) => (
                    <li 
                      key={cat.id} 
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2 rounded-lg cursor-pointer font-medium transition ${selectedCategory === cat.id ? 'bg-orange-600 text-white font-bold shadow-sm' : 'hover:bg-orange-50 text-gray-600'}`}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div 
              onMouseEnter={() => setIsBrandsOpen(true)}
              onMouseLeave={() => setIsBrandsOpen(false)}
            >
              <div 
                onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                className="flex items-center justify-between text-xs font-bold text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition select-none"
              >
                <span className="flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5 text-orange-500"/> نوع الطابعة (Brand)
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isBrandsOpen ? 'rotate-180' : ''}`} />
              </div>

              {isBrandsOpen && (
                <ul className="space-y-1 text-xs mt-2 pr-2 animate-fadeIn">
                  <li 
                    onClick={() => setSelectedBrand('All')}
                    className={`p-1.5 rounded-lg cursor-pointer font-medium transition ${selectedBrand === 'All' ? 'bg-black text-white font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    جميع الطابعات
                  </li>
                  {brandsList.map((brand) => (
                    <li 
                      key={brand} 
                      onClick={() => setSelectedBrand(brand)}
                      className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer font-medium transition ${selectedBrand === brand ? 'bg-black text-white font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400"/>
                      <span>طابعات {brand}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </aside>

        <section className="md:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">عرض {filteredProducts.length} منتج</span>
            <h1 className="font-bold text-base text-gray-800">قائمة قطع الغيار والمستهلكات المتوفرة</h1>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-lg text-center text-gray-500 shadow-sm">
              <p className="text-sm text-gray-500">لا توجد منتجات مطابقة لتحديداتك حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="h-40 w-full bg-gray-50 rounded-md mb-3 flex items-center justify-center overflow-hidden border">
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
                    <h3 className="font-semibold text-sm mt-2 text-gray-800 line-clamp-2">{product.name}</h3>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-gray-800">{product.price_retail} دج</span>
                        <span className="text-gray-500">التجزئة:</span>
                      </div>
                      <div className="flex justify-between text-xs bg-orange-50 p-1 rounded">
                        <span className="font-bold text-orange-700">{product.price_wholesale} دج</span>
                        <span className="text-orange-800 font-medium">الجملة (MOQ: {product.moq}+):</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-orange-600 text-white text-xs px-3 py-2 rounded hover:bg-orange-700 font-bold transition"
                    >
                      إضافة للسلة
                    </button>
                    <span className="text-xs text-green-600 font-semibold">متوفر ({product.stock})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {isContactOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative" dir="rtl">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Phone className="w-6 h-6 text-orange-600"/>
              <h3 className="font-bold text-lg text-gray-800">معلومات الاتصال (Aira Pro)</h3>
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
                <button 
                  onClick={() => setActiveQrModal('whatsapp')}
                  className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 transition"
                >
                  <QrCode className="w-4 h-4"/> QR Code
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-emerald-50 hover:border-emerald-500 transition group">
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => { navigator.clipboard.writeText(CONTACT_CONFIG.wechatId); alert('تم نسخ معرف الويشات بنجاح!'); }}>
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                    <MessageCircle className="w-5 h-5"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-emerald-700">ويشات (WeChat)</h4>
                    <span className="text-xs text-gray-500">ID: {CONTACT_CONFIG.wechatId} (اضغط للنسخ)</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveQrModal('wechat')}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                >
                  <QrCode className="w-4 h-4"/> QR Code
                </button>
              </div>

              <a 
                href={CONTACT_CONFIG.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-500 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <Share2 className="w-5 h-5"/>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-700">صفحة فيسبوك</h4>
                    <span className="text-xs text-gray-500">Aira Pro Official</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">زيارة</span>
              </a>
            </div>

            <button 
              onClick={() => setIsContactOpen(false)}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg text-xs transition mt-4 shadow"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {activeQrModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative text-center" dir="rtl">
            <button onClick={() => setActiveQrModal(null)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              {activeQrModal === 'whatsapp' ? 'مسح رمز الواتساب' : 'مسح رمز الويشات (WeChat)'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {activeQrModal === 'whatsapp' ? 'وجه كاميرا هاتفك لمسح الكود والتواصل فوراً' : 'امسح الـ QR Code الخاص بـ WeChat لإضافتي مباشرة'}
            </p>

            <div className="bg-gray-50 p-4 rounded-xl border flex items-center justify-center mb-4">
              {activeQrModal === 'whatsapp' ? (
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(CONTACT_CONFIG.whatsappUrl)}`} 
                  alt="WhatsApp QR Code" 
                  className="w-48 h-48 object-contain rounded"
                />
              ) : (
                <div className="w-full flex flex-col items-center justify-center bg-white border rounded-xl p-4 shadow-inner">
                  <span className="text-xs font-bold text-gray-500 mb-1">:WeChat ID</span>
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-lg font-mono font-bold text-emerald-700 text-sm mb-3">
                    {CONTACT_CONFIG.wechatId}
                  </div>
                  <p className="text-[11px] text-gray-600 text-center leading-relaxed">
                    افتح تطبيق WeChat وابحث عن المعرف أو امسح كود التطبيق مباشرة.
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setActiveQrModal(null)}
              className="w-full bg-gray-800 hover:bg-black text-white font-bold py-2.5 rounded-lg text-xs transition"
            >
              رجوع
            </button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-600"/>
                <h2 className="font-bold text-base text-gray-800">سلة الطلبات ({totalItemsCount})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">
                  السلة فارغة
                </div>
              ) : (
                cart.map((item) => {
                  const activePrice = item.quantity >= item.moq ? item.price_wholesale : item.price_retail;
                  return (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3 gap-3">
                      <div className="h-12 w-12 bg-gray-50 rounded flex items-center justify-center overflow-hidden border shrink-0">
                        {item.image && typeof item.image === 'string' && item.image.trim().startsWith('http') ? (
                          <img src={item.image.trim()} alt={item.name} className="h-full w-full object-contain p-1" />
                        ) : (
                          <span className="text-xl">{item.image || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-xs text-gray-800 line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono">SKU: {item.sku}</span>
                        <div className="text-xs font-bold text-orange-600 mt-1">
                          {activePrice} دج × {item.quantity}
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center text-base font-bold text-gray-900 border-t pt-2">
                  <span>المبلغ الإجمالي:</span>
                  <span>{totalCartAmount} دج</span>
                </div>
                <button 
                  onClick={() => { alert('تم تسجيل الطلب بنجاح.'); setCart([]); setIsCartOpen(false); }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition text-sm shadow"
                >
                  إتمام الطلب
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isShippingOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setIsShippingOpen(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Truck className="w-5 h-5 text-orange-600"/>
              <h3 className="font-bold text-base text-gray-800">حساب تكلفة التوصيل (58 ولاية)</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">اختر ولاية الوجهة:</label>
                <select 
                  className="w-full border-2 border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-orange-600"
                  defaultValue={19}
                  onChange={(e) => {
                    const wilaya = wilayas.find(w => w.id === parseInt(e.target.value));
                    if (wilaya) setSelectedWilaya(wilaya);
                  }}
                >
                  {wilayas.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">نوع التوصيل:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setShippingType('home')}
                    className={`p-2 rounded-lg border text-xs font-semibold transition ${shippingType === 'home' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    للمنزل (A domicile)
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setShippingType('desk');
                    }}
                    className={`p-2 rounded-lg border text-xs font-semibold transition ${shippingType === 'desk' ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}
                  >
                    للمكتب (Stop Desk)
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-sm">
                <span className="text-gray-600">التكلفة المحسوبة:</span>
                <span className="font-bold text-orange-600 text-base">{currentFee} دج</span>
              </div>

              <button onClick={() => setIsShippingOpen(false)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg text-xs transition shadow">
                تأكيد وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}