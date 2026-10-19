'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Truck, Package, ArrowRight, CheckCircle2, ShieldCheck, Wrench } from 'lucide-react';
import Link from 'next/link';

// قاعدة بيانات مصغرة لقطع غيار Aira Pro (لتجربة التفاصيل)
const productsData: { [key: string]: any } = {
  "1": {
    id: 1,
    name: 'HP LaserJet Pro M402 Fuser Film Sleeve (سليف سخان أصلي)',
    brand: 'HP',
    sku: 'RM2-5425',
    priceRetail: 1200,
    priceWholesale: 950,
    moq: 5,
    stock: 150,
    image: '🔧',
    description: 'سليف سخان عالي الجودة متوافق ومصمم خصيصاً لتحمل حرارة التشغيل العالية وطباعة آلاف الصفحات دون تمزق. استيراد مباشر من مصانع النخبة.',
    compatibility: ['HP LaserJet Pro M402', 'M426', 'M203', 'M227'],
    noteTip: '⚠️ تنبيه فني: يُنصح بشراء معجون التشحيم الحراري (Fuser Grease) مع هذا السليف لضمان الأداء المثالي وطول العمر الافتراضي.'
  },
  "2": {
    id: 2,
    name: 'Canon IR 2525/2530 Pick-up Roller Kit (طقم بكرات السحب)',
    brand: 'Canon',
    sku: 'FL3-1449',
    priceRetail: 800,
    priceWholesale: 650,
    moq: 10,
    stock: 320,
    image: '⚙️',
    description: 'أطقم بكرات سحب الورق الأصلية لمنع انحشار الورق وضمان سلاسة التغذية لآلات النسخ الثقيلة.',
    compatibility: ['Canon imageRUNNER 2525', '2530', '2535', '2545'],
    noteTip: '💡 نصيحة صيانة: قم بتنظيف بكرات الفصل (Separation Pad) عند تغيير هذا الطقم.'
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "1";
  const product = productsData[productId] || productsData["1"];

  const [quantity, setQuantity] = useState(product.moq);
  const activePrice = quantity >= product.moq ? product.priceWholesale : product.priceRetail;
  const totalAmount = activePrice * quantity;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8" dir="rtl">
      {/* زر العودة للمتجر */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-gray-700 hover:text-orange-600 transition">
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى قائمة المنتجات (Aira Pro)</span>
        </Link>
      </div>

      {/* بطاقة تفاصيل المنتج الرئيسية */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
        {/* قسم الصورة */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 border">
          <span className="text-8xl mb-4">{product.image}</span>
          <span className="text-xs bg-orange-100 text-orange-800 font-mono px-3 py-1 rounded-full font-bold">SKU: {product.sku}</span>
        </div>

        {/* قسم المعلومات والمواصفات */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded font-bold">{product.brand}</span>
              <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> متوفر بالمخزون ({product.stock} وحدة)
              </span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{product.description}</p>
          </div>

          {/* جدول الأسعار المتدرجة (Alibaba Style) */}
          <div className="border rounded-xl p-4 bg-gray-50/50 space-y-2">
            <h3 className="text-xs font-bold text-gray-700">نظام تسعير الجملة (B2B Tiers):</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border text-center">
                <span className="block text-gray-400">التجزئة (أقل من {product.moq} قطع)</span>
                <span className="font-bold text-gray-800 text-sm">{product.priceRetail} دج</span>
              </div>
              <div className="bg-orange-50 border-orange-200 p-2 rounded border text-center">
                <span className="block text-orange-700">الجملة ({product.moq} قطع فأكثر)</span>
                <span className="font-bold text-orange-600 text-sm">{product.priceWholesale} دج</span>
              </div>
            </div>
          </div>

          {/* اختيار الكمية والحساب */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">الكمية المطلوبة:</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 border-2 border-orange-500 rounded-lg px-3 py-1.5 text-center font-bold focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center bg-orange-50 p-3 rounded-lg">
              <span className="text-xs text-gray-600 font-medium">المجموع الإجمالي للطلبية:</span>
              <span className="text-xl font-black text-orange-600">{totalAmount} دج</span>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>إضافة الطلبية إلى السلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* قسم توافقية الطابعات والنصائح الفنية (التمهيد للميزات الذكية) */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-600" /> الطابعات المتوافقة (Compatibility Matrix)
          </h3>
          <ul className="space-y-2 text-sm">
            {product.compatibility.map((model: string, idx: number) => (
              <li key={idx} className="bg-gray-50 p-2 rounded border text-gray-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span>{model}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-orange-50/60 p-6 rounded-2xl border border-orange-200">
          <h3 className="font-bold text-orange-900 mb-2">💡 نصيحة خبير الصيانة (Aira Pro Tips):</h3>
          <p className="text-sm text-orange-800 leading-relaxed">{product.noteTip}</p>
        </div>
      </div>
    </div>
  );
}