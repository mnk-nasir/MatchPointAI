import React, { useState, useEffect } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import { Input } from "../../components/ui/Input";
import { userService } from "../../services/user";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = await userService.me();
      if (user) {
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || ""
        });
      }
    } catch (err) {
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await userService.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mp-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">My Profile</h1>
        <p className="text-white/60">Manage your personal information and account settings.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <p>Profile updated successfully!</p>
        </div>
      )}

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="first_name" className="text-sm font-medium text-white/80">First Name</label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full bg-white/5 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="last_name" className="text-sm font-medium text-white/80">Last Name</label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address (Read-only)</label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full bg-white/[0.02] border-white/5 text-white/50 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <GlowButton type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </GlowButton>
          </div>
        </form>
      </GlassCard>

      <div className="pt-8 border-t border-white/10 mt-12">
        <h2 className="text-xl font-bold text-white mb-2">Privacy & Data Control</h2>
        <p className="text-white/60 mb-6 text-sm">
          Manage your personal data and privacy settings in accordance with GDPR regulations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white mb-2">Export Personal Data</h3>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">
                Download a machine-readable copy of all the information we have associated with your account.
              </p>
            </div>
            <button 
              onClick={async () => {
                try {
                  const data = await userService.exportData();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `matchpoint-data-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                } catch (err) {
                  setError("Failed to export data. Please try again.");
                }
              }}
              className="w-full py-2.5 text-sm font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10"
            >
              Request Data Export
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-red-200 mb-2">Delete Account</h3>
              <p className="text-xs text-red-200/40 mb-4 leading-relaxed">
                Permanently remove your account and all associated data. This action is irreversible.
              </p>
            </div>
            <button 
              onClick={async () => {
                if (window.confirm("ARE YOU ABSOLUTELY SURE? This will permanently delete your account and all data across MatchPointAI. This cannot be undone.")) {
                  try {
                    await userService.deleteAccount();
                    localStorage.clear();
                    window.location.href = "/";
                  } catch (err) {
                    setError("Failed to delete account. Please contact support.");
                  }
                }
              }}
              className="w-full py-2.5 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20"
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
