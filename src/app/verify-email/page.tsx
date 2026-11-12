import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-amber-200 text-center">
        {isSuccess ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-3xl">
              <FaCheckCircle />
            </div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Email Verified!</h1>
            <p className="text-amber-700 mb-6">
              Thank you for verifying your email. You can now request custom furniture and stay updated with our newest collections.
            </p>
            <Link
              href="/"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
            >
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 text-3xl">
              <FaTimesCircle />
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">Verification Failed</h1>
            <p className="text-amber-700 mb-6">
              The verification token is invalid or has already been used. Please try subscribing again or contact our support.
            </p>
            <Link
              href="/"
              className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-medium px-6 py-3 rounded-lg transition duration-200"
            >
              Return to MelCraft
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
