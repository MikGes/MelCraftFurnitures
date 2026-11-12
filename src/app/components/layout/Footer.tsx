// components/layout/Footer.tsx
import Link from 'next/link';
import Logo from '../../../../public/Logo.png';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-200 py-12 px-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src={Logo} className="position:relative" alt='Logo' width={300} />
              </Link>
            </div>
            <p className="mt-3 max-w-md">
              Crafting timeless interiors and bespoke furniture since 1998.
              Where tradition meets innovation in design.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-amber-300 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="text-amber-300 hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="#" className="text-amber-300 hover:text-white transition">
              Careers
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-amber-800 text-center">
          <p>© {new Date().getFullYear()} Powered By MikGess. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}