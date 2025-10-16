import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { updateTeamName } from "../services/teamService";

export default function TeamModal({ team, onClose, onTeamUpdated }) {
  const [teamName, setTeamName] = useState(team?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('🎯 TeamModal opened with team data:', team);
    console.log('📝 Team name:', team?.name);
    console.log('🔢 Team ID:', team?.id);
  }, []);

  useEffect(() => {
    if (team?.name) {
      setTeamName(team.name);
    }
  }, [team]);

  const handleSave = async () => {
    if (!teamName.trim()) {
      setError("Team name cannot be empty");
      return;
    }

    if (teamName.trim() === team.name) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updatedTeam = await updateTeamName(team.id, teamName.trim());
      console.log("✅ Team name updated successfully");
      
      if (onTeamUpdated) {
        onTeamUpdated(updatedTeam);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Failed to update team name:", err);
      setError(err.message || "Failed to update team name");
      setTeamName(team.name);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTeamName(team.name);
    setIsEditing(false);
    setError("");
  };

  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div 
        className="bg-cover bg-center rounded-lg shadow-xl max-w-md w-full relative"
        style={{
          backgroundImage: "url('/assets/GlobalAssets/PaperBackground.jpg')",
        }}
      >
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            backgroundImage: "url('/assets/GlobalAssets/BackgroundLayer.png')",
            opacity: 0.11,
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary font-cormorant">
              Team Information
            </h2>
            <button
              onClick={onClose}
              className="text-secondary hover:text-secondary/70 transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-secondary mb-2 font-cormorant">
              Team Name
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-2 bg-primary/20 border-2 border-primary/30 rounded-lg text-secondary font-cormorant text-lg outline-none focus:border-primary"
                  placeholder="Enter team name"
                  disabled={loading}
                />
                {error && (
                  <p className="text-red-600 text-sm mt-1 font-cormorant">{error}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between bg-primary/10 px-4 py-3 rounded-lg border-2 border-primary/30">
                <span className="text-lg font-semibold text-secondary font-cormorant">
                  {teamName}
                </span>
                <button
                  onClick={() => {
                    console.log('✏️ Edit button clicked');
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-2 bg-secondary text-background px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-cormorant text-sm font-bold"
                  title="Edit team name"
                >
                  <Icon icon="mdi:pencil" className="w-4 h-4" />
                  Edit
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-secondary/70 font-cormorant mb-1">XP</p>
              <p className="text-2xl font-bold text-secondary font-cormorant">{team.xp || 0}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-secondary/70 font-cormorant mb-1">Level</p>
              <p className="text-2xl font-bold text-secondary font-cormorant">{team.level || 1}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-secondary mb-2 font-cormorant">
              Team Members ({team.players?.length || 0})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {team.players && team.players.length > 0 ? (
                team.players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-primary/10 px-4 py-3 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="text-secondary font-semibold font-cormorant">
                        {player.fullName}
                      </p>
                      <p className="text-secondary/70 text-sm font-cormorant">
                        @{player.username}
                      </p>
                    </div>
                    <Icon icon="mdi:account" className="w-6 h-6 text-secondary/50" />
                  </div>
                ))
              ) : (
                <p className="text-secondary/50 text-center py-4 font-cormorant">
                  No team members
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 font-cormorant"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-secondary text-background font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-cormorant"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
