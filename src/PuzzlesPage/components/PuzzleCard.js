import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

export default function PuzzleCard({ 
  puzzleName, 
  puzzleNumber, 
  description, 
  isSolved, 
  onSubmit,
  attemptsUntilCooldown = 3,
  cooldownDuration = 60
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cooldownTimerRef = useRef(null);

  useEffect(() => {
    const cooldownKey = `puzzle_cooldown_${puzzleNumber}`;
    const savedCooldown = localStorage.getItem(cooldownKey);
    
    if (savedCooldown) {
      const { endTime, attempts } = JSON.parse(savedCooldown);
      const now = Date.now();
      
      if (endTime > now) {
        // Still on cooldown
        setIsOnCooldown(true);
        setFailedAttempts(attempts);
        setCooldownTimeLeft(Math.ceil((endTime - now) / 1000));
      } else {
        // Cooldown expired, clear it
        localStorage.removeItem(cooldownKey);
        setFailedAttempts(0);
      }
    }
  }, [puzzleNumber]);

  // Cooldown timer
  useEffect(() => {
    if (isOnCooldown && cooldownTimeLeft > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev <= 1) {
            // Cooldown finished
            setIsOnCooldown(false);
            setFailedAttempts(0);
            const cooldownKey = `puzzle_cooldown_${puzzleNumber}`;
            localStorage.removeItem(cooldownKey);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, [isOnCooldown, cooldownTimeLeft, puzzleNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isOnCooldown || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    if (onSubmit) {
      try {
        await onSubmit(puzzleNumber, answer);
        // Success - reset attempts
        setFailedAttempts(0);
        setAnswer("");
        setErrorMessage("");
        const cooldownKey = `puzzle_cooldown_${puzzleNumber}`;
        localStorage.removeItem(cooldownKey);
      } catch (error) {
        // Failed attempt
        setErrorMessage(error.message || 'Incorrect answer');
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        
        if (newAttempts >= attemptsUntilCooldown) {
          // Start cooldown
          startCooldown();
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const startCooldown = () => {
    setIsOnCooldown(true);
    setCooldownTimeLeft(cooldownDuration);
    
    // Save cooldown to localStorage
    const cooldownKey = `puzzle_cooldown_${puzzleNumber}`;
    const endTime = Date.now() + (cooldownDuration * 1000);
    localStorage.setItem(cooldownKey, JSON.stringify({
      endTime,
      attempts: failedAttempts + 1
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white bg-opacity-50 rounded-[14px] border-[3px] border-secondary overflow-hidden">
      <div 
        className="px-4 py-4 flex items-center justify-between cursor-pointer"
        onClick={() => !isSolved && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-secondary font-cormorant font-bold text-[24px]">
            {puzzleName}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isSolved && (
            <Icon 
              icon="mdi:check-circle" 
              className="text-secondary text-[36px]"
            />
          )}
          {!isSolved && (
            <Icon 
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
              className="text-secondary text-[32px]"
            />
          )}
        </div>
      </div>

      {isExpanded && !isSolved && (
        <div className="px-4 pb-4 pt-2 border-t-2 border-secondary">
          <div className="flex flex-col items-center w-full mt-2">
            <label className="text-secondary font-cormorant text-[20px] font-bold self-start mb-1">
              Answer
            </label>

            <input
              type="text"
              placeholder="Enter your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-primary border-none outline-none p-3 rounded-md w-full placeholder:text-background text-background font-cormorant text-xl"
              disabled={isOnCooldown}
            />

            <div className="h-3"></div>

            {errorMessage && !isOnCooldown && (
              <div className="bg-secondary/20 border-2 border-secondary text-secondary px-3 py-2 rounded-lg w-full text-center mb-3">
                <p className="font-cormorant font-semibold text-sm">{errorMessage}</p>
              </div>
            )}

            {isOnCooldown ? (
              <div className="bg-primary/30 border-2 border-secondary text-secondary px-4 py-3 rounded-lg w-full text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Icon icon="mdi:clock-alert" className="text-2xl" />
                  <div>
                    <p className="font-cormorant font-bold text-lg">Cooldown Active</p>
                    <p className="font-cormorant text-base font-semibold">
                      Try again in {formatTime(cooldownTimeLeft)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {failedAttempts > 0 && failedAttempts < attemptsUntilCooldown && (
                  <div className="bg-primary/40 border-2 border-secondary text-secondary px-3 py-2 rounded-lg w-full text-center mb-3">
                    <p className="font-cormorant font-semibold text-sm">
                      {attemptsUntilCooldown - failedAttempts} attempt{attemptsUntilCooldown - failedAttempts > 1 ? 's' : ''} remaining
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-secondary text-background text-[24px] font-cormorant p-3 rounded-[27px] w-full transition-opacity ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
