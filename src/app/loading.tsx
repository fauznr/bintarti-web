export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDD6]">
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <p className="mt-4 text-amber-900/60 font-sans text-sm font-medium animate-pulse tracking-widest uppercase">
          Memuat...
        </p>
      </div>
    </div>
  );
}
