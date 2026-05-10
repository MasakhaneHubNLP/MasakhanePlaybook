import React, { useState, useRef } from 'react';
import { loginWithGitHub, startDeviceFlow, pollDeviceFlow } from '@site/src/utils/github';
import styles from './index.module.css';

const GH_MARK = (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

export function AuthPanel({ auth, clientId, proxyUrl, callbackUrl, onConnect, onDisconnect }) {
  // phases: 'idle' | 'loading' | 'device-pending' | 'waiting'
  const [phase, setPhase] = useState('idle');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const abortRef = useRef(null);

  // What's available depends on which env vars are set
  const canPopup  = !!(clientId && proxyUrl && callbackUrl);
  const canDevice = !!(clientId && proxyUrl);

  // ── Popup OAuth (best UX — requires Cloudflare Worker + callbackUrl) ──
  async function handlePopupOAuth() {
    setPhase('loading');
    setError('');
    try {
      const token = await loginWithGitHub(clientId, proxyUrl, callbackUrl);
      await onConnect(token);
    } catch (e) {
      if (e.message === 'cancelled') { setPhase('idle'); return; }
      // Popup was blocked → fall back to device flow silently
      if (e.message?.includes('Popup')) {
        setError('Popup blocked — switching to device flow.');
        await handleDeviceFlow();
        return;
      }
      setError(e.message || 'GitHub login failed.');
      setPhase('idle');
    }
  }

  // ── Device Flow (requires Cloudflare Worker, no client_secret) ────────
  async function handleDeviceFlow() {
    setPhase('loading');
    setError('');
    try {
      const info = await startDeviceFlow(clientId, proxyUrl);
      setDeviceInfo(info);
      window.open(info.verification_uri, '_blank', 'noopener,noreferrer');
      setPhase('device-pending');
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const token = await pollDeviceFlow(clientId, info.device_code, proxyUrl, info.interval || 5, ctrl.signal);
      await onConnect(token);
    } catch (e) {
      if (e.message === 'cancelled') { setPhase('idle'); return; }
      setError(e.message || 'GitHub login failed.');
      setPhase('idle');
    }
  }

  function cancelDevice() {
    abortRef.current?.abort();
    setPhase('idle');
    setDeviceInfo(null);
    setError('');
  }

  // ── Main sign-in handler: picks best available method ─────────────────
  function handleSignIn() {
    if (canPopup)  return handlePopupOAuth();
    if (canDevice) return handleDeviceFlow();
  }

  async function handlePaste() {
    if (!draft.trim()) return;
    setPhase('loading');
    setError('');
    try {
      await onConnect(draft.trim());
    } catch (e) {
      setError(e.message || 'Invalid token or missing public_repo permission.');
      setPhase('idle');
    }
  }

  // ── Connected ─────────────────────────────────────────────────────────
  if (auth) {
    return (
      <div className={styles.authConnected}>
        <img src={auth.avatarUrl} alt={auth.username} className={styles.authAvatar} />
        <span className={styles.authUsername}>@{auth.username}</span>
        <button className={styles.authSignOutBtn} onClick={onDisconnect} type="button">Sign out</button>
      </div>
    );
  }

  // ── Device flow pending ───────────────────────────────────────────────
  if (phase === 'device-pending' && deviceInfo) {
    return (
      <div className={styles.authDeviceBox}>
        <p className={styles.authDevicePrompt}>Enter this code on the GitHub tab that just opened:</p>
        <div className={styles.authDeviceCode}>{deviceInfo.user_code}</div>
        <p className={styles.authDeviceHint}>Waiting for authorisation…</p>
        <button className={styles.authCancelSmall} onClick={cancelDevice} type="button">Cancel</button>
      </div>
    );
  }

  // ── Default: GitHub button + token input always visible ──────────────
  return (
    <div className={styles.authBlock}>
      <button
        className={styles.authGitHubBtn}
        onClick={handleSignIn}
        disabled={phase === 'loading' || !canDevice}
        title={!canDevice ? 'OAuth not configured — use a personal access token below' : undefined}
        type="button"
      >
        {GH_MARK}
        {phase === 'loading' ? 'Connecting…' : 'Sign in with GitHub'}
      </button>
      <p className={styles.authOrDivider}>or use a personal access token</p>
      <div className={styles.authPatRow}>
        <input
          type="password"
          className={styles.authTokenInput}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePaste()}
          placeholder="ghp_xxxxxxxxxxxx"
          autoComplete="off"
        />
        <button
          className={styles.authConnectBtn}
          onClick={handlePaste}
          disabled={!draft.trim() || phase === 'loading'}
          type="button"
        >
          {phase === 'loading' ? '…' : 'Connect'}
        </button>
      </div>
      <a
        href="https://github.com/settings/tokens/new?scopes=public_repo&description=Masakhane+Playbook"
        target="_blank" rel="noreferrer noopener"
        className={styles.authTokenLink}
      >
        Generate a token on GitHub ↗
      </a>
      {error && <p className={styles.authError}>{error}</p>}
    </div>
  );
}
