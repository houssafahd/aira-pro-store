'use client';
import { useState } from 'react';
import { Truck } from 'lucide-react';

// قائمة عينة لبعض الولايات الجزائرية وسعر التوصيل عبر ياليدين
const wilayas = [
  { id: 19, name: '19 - سطيف (العلمة)', homeFee: 300, deskFee: 200 },
  { id: 16, name: '16 - الجزائر العاصمة', homeFee: 600, deskFee: 400 },
  { id: 31, name: '31 - وهران', homeFee: 700, deskFee: 450 },
  { id: 25, name: '25 - قسنطينة', homeFee: 500, deskFee: 350 },
  { id: 15, name: '15 - تيزي وزو', homeFee: 650, deskFee: 400 },
];

export default function ShippingCalculator() {
  const [selectedWilaya, setSelectedWilaya] = useState(wilayas[0]);
  const [shippingType, setShippingType] = useState<'home' | 'desk'>('home');

  const currentFee = shippingType === 'home' ? selectedWilaya.homeFee : selectedWilaya.deskFee;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mt-6" dir="rtl">
      <div className="flex items-center gap-2 border-b pb-3 mb-4">
        <Truck className="w-6 h-6 text-orange-600" />
        <h3 className="font-bold text-lg text-gray-800">خدمة التوصيل السريع (Yalidine Express)</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اختر ولاية الزبون (الوجهة):</label>
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
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setShippingType('home')}
              className={`p-3 rounded-lg border text-sm font-semibold transition ${shippingType === 'home' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-700'}`}
            >
              توصيل للمنزل (A domicile)
            </button>
            <button 
              type="button"
              onClick={() => setShippingType('desk')}
              className={`p-3 rounded-lg border text-sm font-semibold transition ${shippingType === 'desk' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-700'}`}
            >
              توصيل للمكتب (Stop Desk)
            </button>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center mt-4">
          <span className="text-sm font-medium text-gray-700">تكلفة الشحن المحسوبة:</span>
          <span className="text-xl font-black text-orange-600">{currentFee} دج</span>
        </div>
      </div>
    </div>
  );
}