import React, { useEffect } from 'react';

export default function CongratulationsAnimation({ winningTeamName, isWinner, onComplete }) {
  useEffect(() => {
    // --------- Auto-close after 5 seconds --------- //
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
      {/* --------- Confetti Background --------- */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#D4AF37', '#C0C0C0', '#CD7F32', '#FFD700', '#FFA500'][
                  Math.floor(Math.random() * 5)
                ],
              }}
            />
          </div>
        ))}
      </div>

      {/* --------- Main Content --------- */}
      <div className="relative z-10 text-center px-6">
        {/* --------- Trophy Icon --------- */}
        <div className="mb-6 animate-bounce">
          <div className="inline-block relative">
            <img
              src="/assets/GlobalAssets/RankingCoin.png"
              alt="Trophy"
              className="w-32 h-32 mx-auto animate-spin-slow"
            />
            <div className="absolute inset-0 bg-gradient-radial from-yellow-400/50 to-transparent rounded-full animate-pulse" />
          </div>
        </div>

        {/* Congratulations Text */}
        <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 font-cormorant mb-4 animate-scaleIn">
          {isWinner ? '🎉 Victory! 🎉' : '🏆 Game Over! �'}
        </h1>

        {/* Winning Team Name */}
        <div className="bg-gradient-to-r from-yellow-600/30 via-yellow-500/40 to-yellow-600/30 rounded-lg p-6 mb-6 animate-scaleIn" style={{ animationDelay: '0.3s' }}>
          <p className="text-2xl font-cormorant text-white mb-2">
            {isWinner ? 'Your team has won!' : 'Victory goes to'}
          </p>
          <p className="text-4xl md:text-5xl font-bold text-yellow-300 font-cormorant">
            {winningTeamName}
          </p>
        </div>

        {/* Pirate Icon */}
        <div className="animate-scaleIn" style={{ animationDelay: '0.6s' }}>
          <img
            src="/assets/GlobalAssets/PirateProfile.jpg"
            alt="Pirate"
            className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 shadow-lg"
          />
        </div>

        {/* Message */}
        <p className="text-xl text-white font-cormorant mt-6 animate-fadeIn" style={{ animationDelay: '0.9s' }}>
          {isWinner 
            ? "You've conquered all puzzles and claimed the treasure!" 
            : "The treasure has been claimed!"}
        </p>
      </div>

      {/* Bottom Message */}
      <div className="absolute bottom-8 left-0 right-0 text-center animate-fadeIn" style={{ animationDelay: '1.2s' }}>
        <p className="text-white/80 font-cormorant text-lg">
          Showing final leaderboard in a moment...
        </p>
      </div>
    </div>
  );
}
