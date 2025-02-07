import Link from 'next/link';

export default function OrderConfirmed() {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-4xl font-bold text-primary">Thank You for Your Order!</h2>
        <p className="text-lg text-gray-600 mt-4">We’ll send an email confirmation soon.</p>
        
        <Link href="/shop" passHref>
  <div className="mt-6">
  Continue Shopping
  </div>
</Link>

      </div>
    );
  }
  