import Link from 'next/link';
import Logo from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8 text-center">
      <Logo color="black" className="mb-16" />
      <h1 className="text-[120px] md:text-[200px] font-serif leading-none text-black/5 select-none">
        404
      </h1>
      <h2 className="text-3xl font-serif italic -mt-8 mb-6">Page not found</h2>
      <p className="text-sm text-black/40 uppercase tracking-widest mb-16">
        The space you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-10 py-4 bg-black text-white text-[10px] uppercase tracking-[0.4em] hover:bg-black/80 transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
