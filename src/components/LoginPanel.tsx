import { FormEvent, useState } from 'react';
import { LOGIN_DEVICE_NOTICE, LOGIN_ORGANIZATION_LABEL, PROJECT_CONTACT_EMAIL } from '../config/projectInfo';
import { login, register } from '../services/apiClient';

type Props = {
  onAuthenticated: () => Promise<void>;
};

type AuthMode = 'login' | 'register';

const LOGIN_CASE_MEMORY_IMAGES = [
  '/art/vn/cg-case1-hair-salon-rent-evidence.png',
  '/art/vn/cg-case3-swimming-pool-loan-evidence.png',
  '/art/vn/cg-case5-car-purchase-evidence.png',
  '/art/vn/cg-case6-fabric-iou-evidence.png',
  '/art/vn/cg-case7-shanghai-traffic-accident-overview.png',
  '/art/vn/cg-case9-traffic-accident-overview.png',
];

const LOGIN_BRAND_LOGOS = [
  {
    alt: '上海创智学院',
    src: '/art/brand/shanghai-innovation-institute-logo.png',
  },
  {
    alt: '复旦大学数据智能与社会计算实验室',
    src: '/art/brand/disc-logo.png',
  },
];

export function LoginPanel({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPasswordNotice, setShowForgotPasswordNotice] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (mode === 'register' && password !== confirmPassword) {
      setError('请再次输入相同的密码');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'register') {
        await register(email.trim(), password, organization.trim());
      } else {
        await login(email.trim(), password);
      }
      await onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : mode === 'register' ? '注册失败' : '登录失败');
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(nextMode: AuthMode): void {
    setMode(nextMode);
    setError('');
    setConfirmPassword('');
    setOrganization('');
    setShowForgotPasswordNotice(false);
  }

  return (
    <main className="auth-shell">
      <section className="auth-stage" aria-label="登录 Legal World">
        <div className="auth-cg-scene">
          <img className="auth-background" src="/art/vn/bg-login-law-office-v3.png" alt="法律全流程仿真工作台" />
          <div aria-hidden="true" className="auth-cg-light-sweep" />
          <div aria-hidden="true" className="auth-cg-case-lines" />
          <div aria-hidden="true" className="auth-cg-dust" />
          <div aria-hidden="true" className="auth-cg-screen-glow" />
          <img
            aria-hidden="true"
            className="auth-art-layer"
            src="/art/vn/login-layer-legal-evidence-v2.png"
            alt=""
          />
          <div aria-hidden="true" className="auth-case-memory-wall">
            {LOGIN_CASE_MEMORY_IMAGES.map((imageSrc, index) => (
              <img
                alt=""
                className={`auth-case-polaroid case-memory-${index + 1}`}
                key={imageSrc}
                src={imageSrc}
              />
            ))}
          </div>
        </div>
        <div className="auth-vignette" />
        <section className="login-institution-brand" aria-label="联合机构">
          <div className="login-institution-logos" aria-hidden="true">
            {LOGIN_BRAND_LOGOS.map((logo) => (
              <img alt="" key={logo.src} src={logo.src} />
            ))}
          </div>
          <div>
            <div className="panel-kicker">上海创智学院 × 复旦大学数据智能与社会计算实验室</div>
          </div>
        </section>
        <form className="login-panel" onSubmit={handleSubmit}>
          <h1>Legal World</h1>
          <p className="login-device-notice">{LOGIN_DEVICE_NOTICE}</p>
          <div className="login-mode-switch" aria-label="登录或注册">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')} type="button">
              登录
            </button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')} type="button">
              注册
            </button>
          </div>
          <label>
            <span>邮箱</span>
            <input
              autoComplete="email"
              disabled={submitting}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            <span>密码</span>
            <input
              autoComplete="current-password"
              disabled={submitting}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {mode === 'register' && (
            <label>
              <span>确认密码</span>
              <input
                autoComplete="new-password"
                disabled={submitting}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                value={confirmPassword}
              />
            </label>
          )}
          {mode === 'register' && (
            <label>
              <span>{LOGIN_ORGANIZATION_LABEL}</span>
              <input
                autoComplete="organization"
                disabled={submitting}
                onChange={(event) => setOrganization(event.target.value)}
                required
                type="text"
                value={organization}
              />
            </label>
          )}
          {mode === 'login' && (
            <button
              className="login-secondary-link"
              onClick={() => setShowForgotPasswordNotice((visible) => !visible)}
              type="button"
            >
              忘记密码？
            </button>
          )}
          {showForgotPasswordNotice && (
            <div className="login-forgot-notice" role="status">
              <span>请跟开发者联系</span>
              <b>{PROJECT_CONTACT_EMAIL}</b>
            </div>
          )}
          {error && <div className="auth-error" role="alert">{error}</div>}
          <button className="primary-action wide" disabled={submitting} type="submit">
            {submitting ? (mode === 'register' ? '注册中' : '登录中') : mode === 'register' ? '注册并进入案件' : '登录并进入案件'}
          </button>
        </form>
      </section>
    </main>
  );
}
