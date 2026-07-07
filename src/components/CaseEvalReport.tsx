import { useCallback, useEffect, useRef, useState } from 'react';
import {
  startEvaluation,
  fetchEvalJob,
  fetchEvalReport,
  listEvalJobs,
  type EvalJob,
  type EvalJobStatus,
} from '../services/customCaseApi';
import { MarkdownText } from './MarkdownText';

type Props = {
  caseId: string;
  onClose: () => void;
  variant?: 'dialog' | 'inline';
};

const POLL_MS = 5000;
const ESTIMATED_EVAL_SECONDS = 20 * 60;
const ACTIVE_STATUSES: EvalJobStatus[] = ['queued', 'simulating', 'evaluating'];
const STATUS_LABEL: Record<EvalJobStatus, string> = {
  queued: '排队中',
  simulating: '模拟中',
  evaluating: '评测中',
  completed: '已完成',
  failed: '失败',
  interrupted: '已中断',
};

const EVAL_STEPS = [
  { key: 'LC', label: '庭前咨询', detail: '生成咨询对话与初步代理策略。' },
  { key: 'CD', label: '起诉文书', detail: '生成起诉状并整理诉讼请求。' },
  { key: 'CI', label: '一审庭审', detail: '完成举证、质证、辩论和一审裁判。' },
  { key: 'AR', label: '二审文书', detail: '生成上诉与答辩材料。' },
  { key: 'CIA', label: '二审庭审', detail: '完成二审调查、辩论和结案。' },
  { key: 'EVAL', label: '评测指标', detail: '按阶段指标计算案件表现。' },
  { key: 'REPORT', label: '报告整理', detail: '合并分数与说明，生成跑分报告。' },
];

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes} 分 ${rest} 秒` : `${rest} 秒`;
}

function getActiveStepIndex(job: EvalJob | null) {
  if (!job) return 0;
  if (job.status === 'completed') return EVAL_STEPS.length - 1;
  if (job.status === 'evaluating') return EVAL_STEPS.findIndex((item) => item.key === 'EVAL');
  const current = String(job.stage || '').trim();
  const index = EVAL_STEPS.findIndex((item) => item.key === current);
  return index >= 0 ? index : 0;
}

export function CaseEvalReport({ caseId, onClose, variant = 'dialog' }: Props) {
  const [jobId, setJobId] = useState<string>('');
  const [job, setJob] = useState<EvalJob | null>(null);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [resolving, setResolving] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      setResolving(true);
      setError('');
      setMarkdown('');
      setJob(null);
      setJobId('');
      try {
        const jobs = await listEvalJobs();
        if (cancelled) return;
        const forCase = jobs.filter((item) => item.caseId === caseId);
        const active = forCase.find((item) => ACTIVE_STATUSES.includes(item.status));
        const completed = forCase.find((item) => item.status === 'completed');
        if (active) {
          setJobId(active.jobId);
        } else if (completed) {
          const report = await fetchEvalReport(completed.jobId);
          if (!cancelled) {
            setJobId(completed.jobId);
            setMarkdown(report.markdown);
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '加载跑分任务失败');
      } finally {
        if (!cancelled) setResolving(false);
      }
    }

    void resolve();
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  useEffect(() => {
    if (!jobId || markdown) return;
    let cancelled = false;
    const startedAt = Date.now();
    setElapsedSeconds(0);
    const elapsedTimer = window.setInterval(() => {
      if (!cancelled) setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    const poll = async () => {
      if (cancelled) return;
      try {
        const snap = await fetchEvalJob(jobId);
        if (cancelled) return;
        setJob(snap);
        if (snap.status === 'completed') {
          const report = await fetchEvalReport(jobId);
          if (!cancelled) setMarkdown(report.markdown);
          return;
        }
        if (snap.status === 'failed' || snap.status === 'interrupted') {
          if (!cancelled) setError(snap.error || STATUS_LABEL[snap.status]);
          return;
        }
        timer.current = setTimeout(poll, POLL_MS);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '轮询失败');
      }
    };

    void poll();
    return () => {
      cancelled = true;
      window.clearInterval(elapsedTimer);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [jobId, markdown]);

  const handleStart = useCallback(async () => {
    setError('');
    setJob(null);
    try {
      const newId = await startEvaluation(caseId);
      setJobId(newId);
    } catch (e) {
      setError(e instanceof Error ? e.message : '发起跑分失败');
    }
  }, [caseId]);

  const activeStepIndex = getActiveStepIndex(job);
  const estimatedPercent = Math.min(
    96,
    Math.max(3, Math.round((elapsedSeconds / ESTIMATED_EVAL_SECONDS) * 92) + 3),
  );
  const progressPercent = Math.max(
    estimatedPercent,
    Math.min(100, Math.round(job?.progressPercent ?? 0)),
  );
  const currentStageName =
    job?.stageName || EVAL_STEPS[activeStepIndex]?.label || STATUS_LABEL[job?.status || 'queued'];

  const showIdle = !resolving && !jobId && !markdown && !error;
  const showProgress = !resolving && jobId && !markdown && !error;

  return (
    <div className={`case-eval-report ${variant}`} role="dialog" aria-label="案件跑分">
      <header className="wizard-header">
        <h2>案件跑分报告</h2>
        <button type="button" onClick={onClose} aria-label="关闭">×</button>
      </header>

      {resolving && <p>正在加载跑分任务…</p>}

      {error && (
        <div className="wizard-error">
          <p>{error}</p>
          <button type="button" onClick={handleStart}>重新跑分</button>
        </div>
      )}

      {showIdle && (
        <div className="eval-idle">
          <p>尚未对该案件跑分。评测在后端进行，发起后可关闭页面，稍后回到「跑分记录」查看结果。</p>
          <button type="button" onClick={handleStart}>开始跑分</button>
        </div>
      )}

      {showProgress && (
        <div className="eval-progress">
          <div className="eval-progress-heading">
            <strong>{job ? `${STATUS_LABEL[job.status]} · ${currentStageName}` : '正在发起跑分任务'}</strong>
            <span>已等待 {formatElapsed(elapsedSeconds)}</span>
          </div>
          <div className="eval-estimated-progress" aria-label={`跑分预计进度 ${progressPercent}%`}>
            <div className="wizard-estimated-progress-track" aria-hidden="true">
              <div
                className="wizard-estimated-progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="wizard-estimated-progress-meta">
              <span>预计进度</span>
              <strong>{progressPercent}%</strong>
            </div>
          </div>
          <ol className="eval-progress-steps" aria-label="跑分进度">
            {EVAL_STEPS.map((item, index) => {
              const state = index < activeStepIndex ? 'done' : index === activeStepIndex ? 'active' : '';
              return (
                <li className={`wizard-progress-step ${state}`} key={item.key}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </div>
                </li>
              );
            })}
          </ol>
          <p>
            评测在后端进行，约需数十分钟。你可以关闭页面，稍后回到「跑分记录」查看结果，刷新或关闭都不会中断后端任务。
          </p>
          <p>
            当前进度优先读取后端真实阶段；模型调用耗时会波动，进度条只表示预计等待位置。
          </p>
        </div>
      )}

      {markdown && <MarkdownText className="eval-markdown" text={markdown} />}
    </div>
  );
}
