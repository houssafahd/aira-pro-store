'use client';
import { useState } from 'react';
import { Search, Package, Truck, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

const initialProducts = [
  { id: 1, name: 'HP LaserJet Pro M402 Fuser Film Sleeve', brand: 'HP', sku: 'RM2-5425', priceRetail: 1200, priceWholesale: 950, moq: 5, stock: 150, image: '🔧' },
  { id: 2, name: 'Canon IR 2525/2530 Pick-up Roller Kit', brand: 'Canon', sku: 'FL3-1449', priceRetail: 800, priceWholesale: 650, moq: 10, stock: 320, image: '⚙️' },
  { id: 3, name: 'Kyocera M2040dn OPC Drum Original', brand: 'Kyocera', sku: 'DK-1150', priceRetail: 3500, priceWholesale: 2900, moq: 3, stock: 45, image: '🖨️' },
  { id: 4, name: 'Epson L3110 / L3210 Printhead', brand: 'Epson', sku: 'FA04010', priceRetail: 9500, priceWholesale: 8500, moq: 2, stock: 12, image: '💡' },
];

const wilayas = [
  { id: 19, name: '19 - سطيف (العلمة)', homeFee: 300, deskFee: 200 },
  { id: 16, name: '16 - الجزائر العاصمة', homeFee: 600, deskFee: 400 },
  { id: 31, name: '31 - وهران', homeFee: 700, deskFee: 450 },
  { id: 25, name: '25 - قسنطينة', homeFee: 500, deskFee: 350 },
  { id: 15, name: '15 - تيزي وزو', homeFee: 650, deskFee: 400 },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isShippingOpen, setIsShippingOpen] = useState(false); // تحكم في فتح وإغلاق نافذة الشحن
  const [selectedWilaya, setSelectedWilaya] = useState(wilayas[0]);
  const [shippingType, setShippingType] = useState<'home' | 'desk'>('home');

  const currentFee = shippingType === 'home' ? selectedWilaya.homeFee : selectedWilaya.deskFee;

  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 relative" dir="rtl">
      {/* شريط الإعلانات العلوي */}
      <div className="bg-orange-600 text-white text-xs py-1.5 px-4 text-center font-medium">
        مرحباً بكم في إمبراطورية Aira Pro بالعلمة - التوزيع الحصري لقطع غيار ومستلزمات الطابعات لكافة ولايات الوطن (58 ولاية).
      </div>

      {/* الهيدر الرئيسي (Alibaba Style) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-black tracking-wider font-[family-name:var(--font-audiowide)]">
              AIRA PRO
            </span>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">B2B Wholesale</span>
          </div>

          {/* محرك البحث برقم القطعة */}
          <div className="flex-1 max-w-2xl flex">
            <input 
              type="text" 
              placeholder="ابحث برقم القطعة (OEM Code) مثلاً: RM2-5425 أو موديل الطابعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-orange-500 rounded-r-md rounded-l-none px-4 py-2 focus:outline-none text-sm text-right"
            />
            <button className="bg-orange-600 text-white px-6 rounded-l-md rounded-r-none flex items-center justify-center hover:bg-orange-700">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* الروابط العلوية */}
          <div className="flex items-center gap-4">
            <Link href="/inventory" className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-orange-600 transition">
              <Package className="w-5 h-5 text-orange-600" />
              <span>المخزون</span>
            </Link>
            
            {/* زر فتح حاسبة الشحن */}
            <button 
              onClick={() => setIsShippingOpen(true)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-orange-600 transition cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
            >
              <Truck className="w-5 h-5 text-orange-600" />
              <span>حساب التوصيل (Yalidine)</span>
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* القائمة الجانبية (العلامات التجارية) */}
        <aside className="bg-white p-4 rounded-lg shadow-sm h-fit">
          <h2 className="font-bold text-gray-900 border-b pb-2 mb-3">العلامات التجارية (Brands)</h2>
          <ul className="space-y-2 text-sm">
            {['HP', 'Canon', 'Kyocera', 'Epson', 'Brother', 'Xerox', 'Ricoh'].map((brand) => (
              <li key={brand} className="flex items-center justify-between p-2 hover:bg-orange-50 rounded cursor-pointer text-gray-700 hover:text-orange-600 font-medium">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span>{brand}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* شبكة المنتجات */}
        <section className="md:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">عرض {filteredProducts.length} منتج</span>
            <h1 className="font-bold text-lg text-gray-800">أحدث قطع الغيار والمستهلكات المتوفرة بالمخزون</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="text-4xl text-center py-6 bg-gray-50 rounded-md mb-3">{product.image}</div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono font-bold">SKU: {product.sku}</span>
                  <h3 className="font-semibold text-sm mt-2 text-gray-800 line-clamp-2">{product.name}</h3>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-gray-800">{product.priceRetail} دج</span>
                      <span className="text-gray-500">سعر التجزئة:</span>
                    </div>
                    <div className="flex justify-between text-xs bg-orange-50 p-1 rounded">
                      <span className="font-bold text-orange-600">{product.priceWholesale} دج</span>
                      <span className="text-orange-700 font-medium">سعر الجملة (MOQ: {product.moq}+):</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <button className="bg-orange-600 text-white text-xs px-3 py-2 rounded hover:bg-orange-700 font-medium">
                    طلب جملة
                  </button>
                  <span className="text-xs text-green-600 font-semibold">متوفر ({product.stock} وحدة)</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* نافذة منبثقة (Modal) لحاسبة الشحن تظهر عند الضغط على زر التوصيل */}
      {isShippingOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsShippingOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b pb-3 mb-4">
              <Truck className="w-6 h-6 text-orange-600" />
              <h3 className="font-bold text-lg text-gray-800">حاسبة تكلفة التوصيل (Yalidine)</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اختر ولاية الوجهة:</label>
                <select 
                  className="w-full border-2 border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع التوصيل:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setShippingType('home')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition ${shippingType === 'home' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-700'}`}
                  >
                    توصيل للمنزل
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShippingType('desk')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition ${shippingType === 'desk' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-700'}`}
                  >
                    توصيل للمكتب (Stop Desk)
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-gray-700">التكلفة الإجمالية للشحن:</span>
                <span className="text-xl font-black text-orange-600">{currentFee} دج</span>
              </div>

              <button 
                onClick={() => setIsShippingOpen(false)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-lg transition text-sm mt-2"
              >
                تأكيد وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}