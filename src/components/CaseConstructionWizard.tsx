import { useEffect, useState } from 'react';
import {
  buildCustomCase,
  clearCustomCaseDraft,
  confirmCustomCase,
  deleteCustomCase,
  fetchCustomCaseDraft,
  fetchCustomCaseSample,
  listCustomCases,
  listEvalJobs,
  saveCustomCaseDraft,
  type CustomCaseDraft,
  type CustomCaseSummary,
  type EvalJobSummary,
  type ExtractedInfo,
} from '../services/customCaseApi';
import { CaseEvalReport } from './CaseEvalReport';
import { CustomCaseGuide } from './CustomCaseGuide';
import { CustomEvalHistory } from './CustomEvalHistory';

type Props = {
  onClose: () => void;
  onConfirmed: (caseId: string) => void;
};

type Stage = 'upload' | 'building' | 'preview' | 'done';
type DraftSaveState = 'idle' | 'saving' | 'saved' | 'failed';

const UPLOAD_HINT =
  '请将裁判文书内容复制为纯文本粘贴到对应输入框；暂不支持直接上传 Word/PDF 或扫描件。二审文书为可选项，若无可留空。';
const DRAFT_TEXT_LIMIT = 50000;
const DRAFT_AUTOSAVE_DELAY_MS = 1000;

const BUILD_STEPS = [
  { key: 'extract', label: '抽取案情', description: '识别案由、当事人、争议焦点和关键事实。' },
  { key: 'persona', label: '人格画像', description: '生成双方当事人的法律认知与叙事特征。' },
  { key: 'questions', label: '咨询问题', description: '生成咨询问题和参考回答，供后续仿真使用。' },
  { key: 'assemble', label: '整理预览', description: '合并结构化结果，准备人工确认。' },
];
const ESTIMATED_BUILD_SECONDS = 410;
const ESTIMATED_PROGRESS_CAP = 94;

function getEstimatedBuildProgress(elapsedSeconds: number) {
  const safeElapsed = Math.max(0, elapsedSeconds);
  if (safeElapsed >= ESTIMATED_BUILD_SECONDS) return ESTIMATED_PROGRESS_CAP;
  const ratio = safeElapsed / ESTIMATED_BUILD_SECONDS;
  return Math.max(5, Math.min(ESTIMATED_PROGRESS_CAP, Math.round(5 + ratio * 87)));
}

export function CaseConstructionWizard({ onClose, onConfirmed }: Props) {
  const [stage, setStage] = useState<Stage>('upload');
  const [text, setText] = useState('');
  const [textSecond, setTextSecond] = useState('');
  const [info, setInfo] = useState<ExtractedInfo | null>(null);
  const [error, setError] = useState('');
  const [sampleLoading, setSampleLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCaseId, setSavedCaseId] = useState('');
  const [showEval, setShowEval] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedEvalCaseId, setSelectedEvalCaseId] = useState('');
  const [customCases, setCustomCases] = useState<CustomCaseSummary[]>([]);
  const [caseListLoading, setCaseListLoading] = useState(true);
  const [caseListError, setCaseListError] = useState('');
  const [evalJobs, setEvalJobs] = useState<EvalJobSummary[]>([]);
  const [deletingCaseId, setDeletingCaseId] = useState('');
  const [buildStartedAt, setBuildStartedAt] = useState<number | null>(null);
  const [buildElapsedSeconds, setBuildElapsedSeconds] = useState(0);
  const estimatedProgress = getEstimatedBuildProgress(buildElapsedSeconds);
  const hasExceededEstimate = buildElapsedSeconds >= ESTIMATED_BUILD_SECONDS;
  const [draft, setDraft] = useState<CustomCaseDraft | null>(null);
  const [draftLoading, setDraftLoading] = useState(true);
  const [draftNotice, setDraftNotice] = useState('');
  const [draftSaveState, setDraftSaveState] = useState<DraftSaveState>('idle');

  useEffect(() => {
    let cancelled = false;
    async function loadDraft() {
      setDraftLoading(true);
      try {
        const restored = await fetchCustomCaseDraft();
        if (cancelled) return;
        setDraft(restored);
        if (restored.status === 'preview' && restored.extractedInfo) {
          setText(restored.sourceText);
          setTextSecond(restored.sourceTextSecond);
          setInfo(restored.extractedInfo);
          setStage('preview');
          setDraftNotice('已恢复上次构造结果。');
        } else if (restored.status === 'confirmed' && restored.caseId) {
          setText(restored.sourceText);
          setTextSecond(restored.sourceTextSecond);
          if (restored.extractedInfo) setInfo(restored.extractedInfo);
          setSavedCaseId(restored.caseId);
          setStage('done');
          setDraftNotice(`上次已保存为 ${restored.caseId}。`);
        } else if (restored.sourceText) {
          setText(restored.sourceText);
          setTextSecond(restored.sourceTextSecond);
          setStage('upload');
          setDraftNotice(
            restored.status === 'building'
              ? '上次构造请求可能已中断，可重新开始构造。'
              : '已恢复上次草稿。',
          );
        }
        if (restored.lastError) setError(restored.lastError);
      } catch {
        if (!cancelled) {
          setDraftNotice('草稿加载失败，本次仍可继续粘贴构造。');
        }
      } finally {
        if (!cancelled) setDraftLoading(false);
      }
    }
    void loadDraft();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (draftLoading || stage !== 'upload') return;
    if (text.length > DRAFT_TEXT_LIMIT || textSecond.length > DRAFT_TEXT_LIMIT) {
      setDraftSaveState('failed');
      setDraftNotice('文书草稿超过 5 万字，需精简后才能保存和构造。');
      return;
    }
    setDraftSaveState('saving');
    const timer = window.setTimeout(() => {
      void saveCustomCaseDraft({ sourceText: text, sourceTextSecond: textSecond, status: text ? 'text' : 'empty' })
        .then((saved) => {
          setDraft(saved);
          setDraftSaveState('saved');
          setDraftNotice(text ? '草稿已保存。' : '草稿已清空。');
        })
        .catch(() => {
          setDraftSaveState('failed');
          setDraftNotice('草稿未保存，当前内容仍在页面中。');
        });
    }, DRAFT_AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [draftLoading, stage, text, textSecond]);

  async function loadCustomCaseList() {
    setCaseListLoading(true);
    setCaseListError('');
    try {
      const [cases, jobs] = await Promise.all([listCustomCases(), listEvalJobs()]);
      setCustomCases(cases);
      setEvalJobs(jobs);
    } catch (e) {
      setCaseListError(e instanceof Error ? e.message : '加载已构造案件失败');
    } finally {
      setCaseListLoading(false);
    }
  }

  function getEvalActionLabel(caseId: string) {
    const jobs = evalJobs.filter((item) => item.caseId === caseId);
    if (jobs.some((item) => item.status === 'completed')) return '查看报告';
    if (jobs.some((item) => item.status === 'queued' || item.status === 'simulating' || item.status === 'evaluating')) {
      return '查看进度';
    }
    return '开始跑分';
  }

  useEffect(() => {
    void loadCustomCaseList();
  }, []);

  useEffect(() => {
    if (stage !== 'building' || !buildStartedAt) return;
    setBuildElapsedSeconds(Math.max(0, Math.floor((Date.now() - buildStartedAt) / 1000)));
    const timerId = window.setInterval(() => {
      setBuildElapsedSeconds(Math.max(0, Math.floor((Date.now() - buildStartedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [buildStartedAt, stage]);

  async function handleBuild() {
    setError('');
    const startedAt = Date.now();
    setBuildStartedAt(startedAt);
    setBuildElapsedSeconds(0);
    setStage('building');
    try {
      const built = await buildCustomCase(text, textSecond || undefined);
      setInfo(built);
      setStage('preview');
      setDraftNotice('已恢复上次构造结果。');
    } catch (e) {
      setError(e instanceof Error ? e.message : '构造失败，请重试');
      setStage('upload');
    } finally {
      setBuildStartedAt(null);
    }
  }

  async function handleConfirm() {
    if (!info) return;
    setSaving(true);
    setError('');
    try {
      const caseId = await confirmCustomCase(info);
      setSavedCaseId(caseId);
      setSelectedEvalCaseId(caseId);
      setStage('done');
      await loadCustomCaseList();
      onConfirmed(caseId);
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCase(item: CustomCaseSummary) {
    const label = item.caseCause || item.caseId;
    const confirmed = window.confirm(`确认删除「${label}」？这只会删除已构造案件，不会删除已有跑分记录。`);
    if (!confirmed) return;
    setDeletingCaseId(item.caseId);
    setCaseListError('');
    try {
      await deleteCustomCase(item.caseId);
      await loadCustomCaseList();
    } catch (e) {
      setCaseListError(e instanceof Error ? e.message : '删除已构造案件失败');
    } finally {
      setDeletingCaseId('');
    }
  }

  async function handleClearDraft() {
    setError('');
    try {
      const cleared = await clearCustomCaseDraft();
      setDraft(cleared);
      setText('');
      setTextSecond('');
      setInfo(null);
      setSavedCaseId('');
      setShowEval(false);
      setStage('upload');
      setDraftNotice('草稿已清空。');
      setDraftSaveState('idle');
    } catch (e) {
      setError(e instanceof Error ? e.message : '清空草稿失败');
    }
  }

  async function handleLoadSample() {
    setError('');
    setSampleLoading(true);
    try {
      const sample = await fetchCustomCaseSample();
      setText(sample.text);
      setTextSecond(sample.textSecond);
      setDraftNotice('已加载示例文书，可直接点开始构造。');
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载示例文书失败');
    } finally {
      setSampleLoading(false);
    }
  }

  function updateField(path: string, value: string) {
    if (!info) return;
    // 浅层可编辑：case_background / case_cause 等顶层字段
    setInfo({ ...info, [path]: value });
  }

  return (
    <div className="case-construction-wizard" role="dialog" aria-label="上传文书构造案件">
      <header className="wizard-header">
        <h2>上传文书 · 构造案件</h2>
        <button type="button" onClick={onClose} aria-label="关闭">×</button>
      </header>

      {stage === 'upload' && (
        <section className="wizard-upload">
          <div className="wizard-upload-side">
          <div className="custom-case-existing">
            <div className="custom-case-existing-heading">
              <strong>已构造案件</strong>
              <div className="custom-case-existing-heading-actions">
                <button type="button" onClick={() => setShowHistory(true)}>跑分记录</button>
                <button type="button" onClick={loadCustomCaseList} disabled={caseListLoading}>
                  {caseListLoading ? '刷新中…' : '刷新'}
                </button>
              </div>
            </div>
            {caseListLoading && <p>正在加载当前账号已构造案件…</p>}
            {caseListError && <p className="wizard-error">{caseListError}</p>}
            {!caseListLoading && !caseListError && customCases.length === 0 && (
              <p>当前账号还没有保存过构造案件。</p>
            )}
            {!caseListLoading && !caseListError && customCases.length > 0 && (
              <div className="custom-case-existing-list">
                {customCases.map((item) => (
                  <article className="custom-case-existing-card" key={item.caseId}>
                    <div>
                      <strong>{item.caseCause || item.caseId}</strong>
                      <span>{item.partyNames.length > 0 ? item.partyNames.join(' / ') : item.caseId}</span>
                      {item.caseBackground ? <small>{item.caseBackground}</small> : null}
                    </div>
                    <div className="custom-case-existing-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvalCaseId(item.caseId);
                          setShowEval(true);
                        }}
                      >
                        {getEvalActionLabel(item.caseId)}
                      </button>
                      <button
                        className="danger-action"
                        type="button"
                        disabled={deletingCaseId === item.caseId}
                        onClick={() => void handleDeleteCase(item)}
                      >
                        {deletingCaseId === item.caseId ? '删除中…' : '删除'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
          {showEval && selectedEvalCaseId && (
            <CaseEvalReport
              caseId={selectedEvalCaseId}
              onClose={() => setShowEval(false)}
              variant="inline"
            />
          )}
          <CustomCaseGuide />
          </div>
          <div className="wizard-upload-main">
          <p className="wizard-hint">{UPLOAD_HINT}</p>
          {(draftNotice || draftSaveState !== 'idle') && (
            <p className="wizard-draft-status">
              {draftNotice}
              {draftSaveState === 'saving' && ' 草稿保存中…'}
              {draftSaveState === 'saved' && ' 已自动保存。'}
            </p>
          )}
          <label className="wizard-textarea-label">
            一审文书（必填）
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="在此粘贴一审裁判文书纯文本…"
            />
          </label>
          <label className="wizard-textarea-label">
            二审文书（选填）
            <textarea
              value={textSecond}
              onChange={(e) => setTextSecond(e.target.value)}
              rows={10}
              placeholder="在此粘贴二审裁判文书纯文本（可留空）…"
            />
          </label>
          {error && <p className="wizard-error">{error}</p>}
          <div className="wizard-actions">
            <button type="button" disabled={text.trim().length < 50} onClick={handleBuild}>
              开始构造
            </button>
            <button type="button" onClick={handleLoadSample} disabled={sampleLoading}>
              {sampleLoading ? '加载中…' : '加载示例文书'}
            </button>
            {(text || textSecond || draft?.sourceText) && (
              <div className="wizard-draft-actions">
                <button type="button" onClick={handleClearDraft}>
                  清空草稿
                </button>
              </div>
            )}
          </div>
          </div>
        </section>
      )}

      {stage === 'building' && (
        <section className="wizard-building">
          <div className="wizard-building-status" aria-live="polite">
            <strong>正在构造案件</strong>
            <span className="wizard-elapsed-time">已等待 {buildElapsedSeconds} 秒</span>
            <p>
              系统正在调用模型完成抽取案情、人格画像和咨询问题生成。预计 5-8 分钟，文书越长，等待时间可能越久。
            </p>
          </div>
          <div className="wizard-estimated-progress" aria-label={`预计进度 ${estimatedProgress}%`}>
            <div className="wizard-estimated-progress-meta">
              <span>预计进度</span>
              <strong>{estimatedProgress}%</strong>
            </div>
            <div className="wizard-estimated-progress-track" aria-hidden="true">
              <div
                className="wizard-estimated-progress-bar"
                style={{ width: `${estimatedProgress}%` }}
              />
            </div>
            <p>
              {hasExceededEstimate
                ? '已超过常规时长，模型仍在处理；完成后会自动进入预览。'
                : '进度基于近期构造耗时估算，实际完成时间取决于模型返回速度。'}
            </p>
          </div>
          <ol className="wizard-progress-steps" aria-label="构造进度">
            {BUILD_STEPS.map((item, index) => {
              const activeIndex = Math.min(
                BUILD_STEPS.length - 1,
                Math.max(0, Math.floor(buildElapsedSeconds / 35)),
              );
              const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : 'pending';
              return (
                <li className={`wizard-progress-step ${state}`} key={item.key}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="wizard-refresh-note">
            请勿刷新页面。刷新会中断本次构造请求，已经粘贴的文本也可能需要重新提交。
          </p>
          {buildElapsedSeconds >= 90 ? (
            <p className="wizard-timeout-note">
              仍在等待模型返回。你可以继续等待；如果超过数分钟没有结果，关闭窗口后精简文本重试。
            </p>
          ) : null}
        </section>
      )}

      {stage === 'preview' && info && (
        <section className="wizard-preview">
          {draftNotice && <p className="wizard-draft-status">{draftNotice}</p>}
          <label>
            案由
            <input
              value={String(info.case_cause ?? '')}
              onChange={(e) => updateField('case_cause', e.target.value)}
            />
          </label>
          <label>
            案件背景
            <textarea
              value={String(info.case_background ?? '')}
              rows={6}
              onChange={(e) => updateField('case_background', e.target.value)}
            />
          </label>
          {error && <p className="wizard-error">{error}</p>}
          <div className="wizard-actions">
            <button type="button" onClick={() => setStage('upload')} disabled={saving}>
              返回重传
            </button>
            <button type="button" onClick={handleConfirm} disabled={saving}>
              {saving ? '保存中…' : '确认并保存'}
            </button>
            <div className="wizard-draft-actions">
              <button type="button" onClick={handleClearDraft} disabled={saving}>
                清空草稿
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === 'done' && !showEval && !showHistory && (
        <section className="wizard-done">
          <p>案件已保存（{savedCaseId}）。</p>
          {draftNotice && <p className="wizard-draft-status">{draftNotice}</p>}
          <div className="wizard-actions">
            <button type="button" onClick={() => {
              setSelectedEvalCaseId(savedCaseId);
              setShowEval(true);
            }}>开始跑分</button>
            <button type="button" onClick={() => setShowHistory(true)}>跑分记录</button>
            <button type="button" onClick={onClose}>完成</button>
            <div className="wizard-draft-actions">
              <button type="button" onClick={handleClearDraft}>
                清空草稿
              </button>
            </div>
          </div>
        </section>
      )}

      {showHistory && (
        <CustomEvalHistory
          onClose={() => setShowHistory(false)}
          onOpen={(caseId) => {
            setSelectedEvalCaseId(caseId);
            setShowHistory(false);
            setShowEval(true);
          }}
        />
      )}
    </div>
  );
}
