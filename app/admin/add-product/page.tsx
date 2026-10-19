'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('HP');
  const [category, setCategory] = useState('Fuser');
  const [sku, setSku] = useState('');
  const [priceRetail, setPriceRetail] = useState('');
  const [priceWholesale, setPriceWholesale] = useState('');
  const [moq, setMoq] = useState('5');
  const [stock, setStock] = useState('100');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
      alert('تم رفع الصورة بنجاح!');
    } catch (error: unknown) {
      const err = error as Error;
      alert('خطأ أثناء رفع الصورة: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !priceRetail || !priceWholesale) {
      alert('يرجى ملء الحقول الأساسية!');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('products').insert([
        {
          name,
          brand,
          category,
          sku,
          price_retail: parseFloat(priceRetail),
          price_wholesale: parseFloat(priceWholesale),
          moq: parseInt(moq, 10),
          stock: parseInt(stock, 10),
          image: imageUrl || '📦',
        },
      ]);

      if (error) throw error;

      alert('تم إضافة قطعة الغيار بنجاح إلى المتجر!');
      router.push('/');
    } catch (error: unknown) {
      const err = error as Error;
      alert('خطأ أثناء الحفظ: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800" dir="rtl">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black">
          <ArrowRight className="w-4 h-4" /> العودة إلى المتجر الرئيسي
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold mb-6 flex items-center gap-2 text-black">
          <PlusCircle className="w-6 h-6 text-orange-600" /> إضافة قطعة غيار جديدة (Aira Pro)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">اسم القطعة والمواصفات:</label>
            <input 
              type="text" 
              required
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: HP LaserJet Pro M402 Fuser Film Sleeve" 
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">العلامة التجارية (Brand):</label>
              <select 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
              >
                {['HP', 'Canon', 'Kyocera', 'Epson', 'Brother', 'Xerox', 'Ricoh'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">تصنيف القطعة (Category):</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
              >
                <option value="Fuser">سخانات (Fuser)</option>
                <option value="Drum">أسطوانات (Drum)</option>
                <option value="Roller">بكرات سحب (Roller)</option>
                <option value="Mechanical">ميكانيكي (Mechanical)</option>
                <option value="Consumables">مستلزمات (Consumables)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">رقم القطعة (SKU / OEM Code):</label>
            <input 
              type="text" 
              required
              value={sku} 
              onChange={(e) => setSku(e.target.value)}
              placeholder="مثال: RM2-5425" 
              className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">سعر التجزئة (دج):</label>
              <input 
                type="number" 
                required
                value={priceRetail} 
                onChange={(e) => setPriceRetail(e.target.value)}
                placeholder="1200" 
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">سعر الجملة (دج):</label>
              <input 
                type="number" 
                required
                value={priceWholesale} 
                onChange={(e) => setPriceWholesale(e.target.value)}
                placeholder="950" 
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">الحد الأدنى للجملة (MOQ):</label>
              <input 
                type="number" 
                value={moq} 
                onChange={(e) => setMoq(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">الكمية المتوفرة (Stock):</label>
              <input 
                type="number" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)}
                className="w-full border rounded-lg p-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">صورة قطعة الغيار من الحاسوب:</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border rounded-lg p-2 text-xs file:bg-black file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:cursor-pointer"
              />
            </div>
            {uploading && <p className="text-xs text-orange-600 mt-1">جاري رفع الصورة للسحاب...</p>}
            {imageUrl && <p className="text-xs text-green-600 mt-1">✓ تم رفع الصورة بنجاح وجاهزة للحفظ</p>}
          </div>

          <button 
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition text-sm mt-4 shadow"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ ونشر القطعة في المتجر'}
          </button>
        </form>
      </div>
    </div>
  );
}