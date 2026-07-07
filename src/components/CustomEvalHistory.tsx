import { useEffect, useState } from 'react';
import {
  listEvalJobs,
  type EvalJobStatus,
  type EvalJobSummary,
} from '../services/customCaseApi';

type Props = { onOpen: (caseId: string) => void; onClose: () => void };

const STATUS_LABEL: Record<EvalJobStatus, string> = {
  queued: '排队中',
  simulating: '模拟中',
  evaluating: '评测中',
  completed: '已完成',
  failed: '失败',
  interrupted: '已中断',
};

function formatTime(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
}

export function CustomEvalHistory({ onOpen, onClose }: Props) {
  const [jobs, setJobs] = useState<EvalJobSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listEvalJobs();
        if (!cancelled) setJobs(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '加载跑分记录失败');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="custom-eval-history" role="dialog" aria-label="跑分记录">
      <header className="wizard-header">
        <h2>跑分记录</h2>
        <button type="button" onClick={onClose} aria-label="关闭">×</button>
      </header>

      {loading && <p>加载中…</p>}
      {error && <p className="wizard-error">{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>暂无跑分记录。</p>}

      {!loading && !error && jobs.length > 0 && (
        <table className="custom-eval-history-table">
          <thead>
            <tr>
              <th>案由</th>
              <th>状态</th>
              <th>总分</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.jobId}>
                <td>{job.caseCause || job.caseId}</td>
                <td>{STATUS_LABEL[job.status]}</td>
                <td>{typeof job.overallScore === 'number' ? job.overallScore.toFixed(2) : '—'}</td>
                <td>{formatTime(job.createdAt)}</td>
                <td>
                  <button type="button" onClick={() => onOpen(job.caseId)}>
                    {job.status === 'completed' ? '查看报告' : '查看进度'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
