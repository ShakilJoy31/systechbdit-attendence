import { Suspense } from 'react';
import PaymentSuccessContent from '@/components/authentication/SuccessPage';

const SuccessPage = () => {
  return (
    <div className="bg-[#F4F6F8] dark:bg-gray-600 mt-16">
      <Suspense fallback={
        <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading payment confirmation...</p>
          </div>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}

export default SuccessPage;