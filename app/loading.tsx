import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Logo pulse */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(201,168,76,0.35)] animate-pulse">
          <Image
            src="/logo.png"
            alt="EliteHub NG"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gold-DEFAULT"
              style={{ animation: `ehBounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ehBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40%            { transform: scale(1); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}