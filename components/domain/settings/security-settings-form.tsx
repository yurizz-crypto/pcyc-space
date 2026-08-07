'use client';

import React, { useActionState, useState, useRef } from 'react';
import { changePasswordAction, type ProfileActionState } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const initialState: ProfileActionState = {
  success: false,
};

export function SecuritySettingsForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password strength checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Reset inputs on success
  React.useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Alert Messages */}
      {state.success && state.message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{state.message}</span>
        </div>
      )}

      {state.error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#f8f4e3] dark:bg-[#1d2419] border border-[#e6dfcb] dark:border-[#323d2b] flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#2c3324] text-[#e0a861] dark:bg-[#e0a861] dark:text-[#131710] shrink-0 mt-0.5">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-sm text-[#2c3324] dark:text-[#fefcf1]">
            Password & Account Protection
          </h4>
          <p className="text-xs text-[#707666] dark:text-[#a3ab98] leading-relaxed">
            Ensure your account uses a strong, unique password with at least 8 characters. You will need your current password to confirm this change.
          </p>
        </div>
      </div>

      {/* Current Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="currentPassword"
          className="block text-xs font-bold uppercase tracking-wider text-[#505748] dark:text-[#a3ab98]"
        >
          Current Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707666] dark:text-[#a3ab98]" />
          <input
            id="currentPassword"
            name="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            required
            placeholder="Enter your current password"
            className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] text-[#2c3324] dark:text-[#fefcf1] focus:outline-none focus:ring-2 focus:ring-[#2c3324]/20 dark:focus:ring-[#e0a861]/30 focus:border-[#2c3324] dark:focus:border-[#e0a861]"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707666] hover:text-[#2c3324] dark:hover:text-[#fefcf1]"
          >
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {state.fieldErrors?.currentPassword && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{state.fieldErrors.currentPassword[0]}</p>
        )}
      </div>

      {/* New Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="newPassword"
          className="block text-xs font-bold uppercase tracking-wider text-[#505748] dark:text-[#a3ab98]"
        >
          New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707666] dark:text-[#a3ab98]" />
          <input
            id="newPassword"
            name="newPassword"
            type={showNew ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Create a new password (min. 8 characters)"
            className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] text-[#2c3324] dark:text-[#fefcf1] focus:outline-none focus:ring-2 focus:ring-[#2c3324]/20 dark:focus:ring-[#e0a861]/30 focus:border-[#2c3324] dark:focus:border-[#e0a861]"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707666] hover:text-[#2c3324] dark:hover:text-[#fefcf1]"
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {state.fieldErrors?.newPassword && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{state.fieldErrors.newPassword[0]}</p>
        )}

        {/* Live Requirement Pills */}
        {newPassword.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                hasMinLength
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-medium'
                  : 'bg-stone-100 dark:bg-[#20271c] text-[#707666] dark:text-[#a3ab98]'
              }`}
            >
              ✓ At least 8 characters
            </span>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                hasNumber
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-medium'
                  : 'bg-stone-100 dark:bg-[#20271c] text-[#707666] dark:text-[#a3ab98]'
              }`}
            >
              ✓ Contains a number
            </span>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                hasLetter
                  ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-medium'
                  : 'bg-stone-100 dark:bg-[#20271c] text-[#707666] dark:text-[#a3ab98]'
              }`}
            >
              ✓ Contains a letter
            </span>
          </div>
        )}
      </div>

      {/* Confirm New Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-bold uppercase tracking-wider text-[#505748] dark:text-[#a3ab98]"
        >
          Confirm New Password <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707666] dark:text-[#a3ab98]" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-[#e6dfcb] dark:border-[#323d2b] bg-white dark:bg-[#1b2117] text-[#2c3324] dark:text-[#fefcf1] focus:outline-none focus:ring-2 focus:ring-[#2c3324]/20 dark:focus:ring-[#e0a861]/30 focus:border-[#2c3324] dark:focus:border-[#e0a861]"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707666] hover:text-[#2c3324] dark:hover:text-[#fefcf1]"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword.length > 0 && (
          <p
            className={`text-xs ${
              isMatch
                ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isMatch ? '✓ Passwords match' : '✗ Passwords do not match yet'}
          </p>
        )}
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs text-rose-600 dark:text-rose-400">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-[#e6dfcb] dark:border-[#323d2b] flex items-center justify-end">
        <Button
          type="submit"
          variant="secondary"
          disabled={isPending || (newPassword.length > 0 && !isMatch)}
          className="gap-2 px-6"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </Button>
      </div>
    </form>
  );
}
