'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, MessageCircle, Phone, Share2, QrCode, ArrowRight, CheckCircle2 } from 'lucide-react';
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

function ProductDetailContent() {
  const params = useParams();
  const productId = params?.id ? String(params.id) : "1";
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeQrModal, setActiveQrModal] = useState<'whatsapp' | 'wechat' | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
        } else if (data) {
          setProduct(data);
          setQuantity(data.moq || 1);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
        <p className="text-sm text-gray-500 font-medium">جاري تحميل تفاصيل القطعة...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center" dir="rtl">
        <h1 className="text-lg font-bold text-gray-800 mb-4">القطعة غير متوفرة أو تم حذفها.</h1>
        <Link href="/" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold">
          العودة للكتالوج
        </Link>
      </div>
    );
  }

  const isWholesale = quantity >= product.moq;
  const unitPrice = isWholesale ? product.price_wholesale : product.price_retail;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800" dir="rtl">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-black">
            <ArrowRight className="w-4 h-4" /> العودة للكتالوج الرئيسي
          </Link>
          <span className="text-xl font-black text-black font-[family-name:var(--font-audiowide)]">AIRA PRO</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 w-full bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden">
            {product.image && typeof product.image === 'string' && product.image.trim().startsWith('http') ? (
              <img src={product.image.trim()} alt={product.name} className="h-full w-full object-contain p-4" />
            ) : (
              <span className="text-6xl">{product.image || '📦'}</span>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md font-bold">{product.category}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-mono font-bold">SKU: {product.sku}</span>
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-xs text-gray-500 mb-4">العلامة التجارية للطابعة: <span className="font-bold text-gray-700">{product.brand}</span></p>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">سعر التجزئة:</span>
                  <span className="font-bold text-gray-900">{product.price_retail} دج</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-orange-800 font-medium">سعر الجملة (بداية من MOQ {product.moq}):</span>
                  <span className="font-bold text-orange-700">{product.price_wholesale} دج</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-700 mb-2">الكمية المطلوبة:</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 border-2 border-gray-300 rounded-lg p-2 text-sm font-bold text-center focus:outline-none focus:border-orange-600"
                  />
                  <span className="text-xs text-gray-500">
                    {isWholesale ? '🔥 تم تطبيق سعر الجملة' : `أضف ${product.moq - quantity > 0 ? product.moq - quantity : 0} قطع أخرى للحصول على سعر الجملة`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">المبلغ الإجمالي:</span>
                <span className="text-xl font-black text-orange-600">{totalPrice} دج</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => alert(`تمت إضافة ${quantity} وحدة إلى السلة بنجاح!`)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow"
              >
                <ShoppingCart className="w-4 h-4" /> إضافة إلى سلة الطلبات
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a 
                  href={CONTACT_CONFIG.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" /> طلب عبر واتساب
                </a>
                <button 
                  onClick={() => setActiveQrModal('wechat')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-4 h-4" /> WeChat ID
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {activeQrModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative text-center" dir="rtl">
            <h3 className="font-bold text-lg text-gray-800 mb-2">تواصل عبر WeChat</h3>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg font-mono font-bold text-emerald-700 text-sm mb-4">
              {CONTACT_CONFIG.wechatId}
            </div>
            <button 
              onClick={() => setActiveQrModal(null)}
              className="w-full bg-gray-800 hover:bg-black text-white font-bold py-2 rounded-lg text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-sm">جاري التحميل...</p></div>}>
      <ProductDetailContent />
    </Suspense>
  );
}