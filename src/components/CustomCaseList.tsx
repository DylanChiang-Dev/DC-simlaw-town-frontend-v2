import { useEffect, useState } from 'react';
import { listCustomCases, startEvaluation, type CustomCaseSummary } from '../services/customCaseApi';
import type { SimulationMode } from '../services/types';
import { CaseConstructionWizard } from './CaseConstructionWizard';
import { CustomCaseGuide } from './CustomCaseGuide';

type Props = {
  disabled?: boolean;
  error: string;
  onBack: () => void;
  onStart: (caseId: string, mode: SimulationMode) => Promise<void>;
};

const MODE_OPTIONS: { value: SimulationMode; title: string; desc: string }[] = [
  { value: 'auto', title: '自动模拟', desc: 'AI 全程代打，观看完整流程' },
  { value: 'plaintiff', title: '扮演原告律师', desc: '你担任原告律师，亲自参与' },
];

export function CustomCaseList({ disabled = false, error, onBack, onStart }: Props) {
  const [cases, setCases] = useState<CustomCaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [chosenMode, setChosenMode] = useState<SimulationMode | null>(null);
  const [starting, setStarting] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  async function loadCases() {
    setLoading(true);
    setListError('');
    try {
      const result = await listCustomCases();
      setCases(result);
    } catch {
      setListError('加载自定义案件失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCases();
  }, []);

  async function handleStart() {
    if (!selectedId || !chosenMode || starting) return;
    setStarting(true);
    try {
      await onStart(selectedId, chosenMode);
    } finally {
      setStarting(false);
    }
  }

  function handleSelect(caseId: string) {
    setSelectedId(caseId);
    setChosenMode(null);
  }

  async function handleEval(caseId: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await startEvaluation(caseId);
    } catch {
      // non-critical; eval failure should not disrupt list view
    }
  }

  const selectedCase = cases.find((c) => c.caseId === selectedId);

  if (wizardOpen) {
    return (
      <CaseConstructionWizard
        onClose={() => setWizardOpen(false)}
        onConfirmed={(caseId) => {
          setWizardOpen(false);
          void loadCases();
          setSelectedId(caseId);
        }}
      />
    );
  }

  return (
    <section className="entry-view landing-choice-layer" aria-label="我的自定义案件">
      <div className="custom-case-list-panel">
        <div className="custom-case-list-header">
          <div>
            <div className="panel-kicker">Custom Cases</div>
            <h2>我的自定义案件</h2>
          </div>
          <div className="custom-case-list-header-actions">
            <button className="custom-case-list-back" type="button" onClick={onBack}>
              ← 返回选择
            </button>
            <button
              className="custom-case-list-new-btn"
              type="button"
              onClick={() => setWizardOpen(true)}
            >
              + 上传新文书
            </button>
          </div>
        </div>

        {error && <div className="custom-case-list-error">{error}</div>}
        {listError && <div className="custom-case-list-error">{listError}</div>}

        <div className="custom-case-list-main">
        {loading ? (
          <div className="custom-case-list-empty">加载中…</div>
        ) : cases.length === 0 ? (
          <div className="custom-case-list-empty">
            还没有自定义案件。点击「上传新文书」，把一审裁判文书（必填）和二审文书（选填）粘贴进去即可开始构造。
          </div>
        ) : (
          <div className="custom-case-list-items">
            {cases.map((c) => {
              const title = c.partyNames.length >= 2
                ? `${c.partyNames[0]}诉${c.partyNames[1]}`
                : c.partyNames[0] ?? c.caseId;
              const meta = [c.caseCause, `${c.questionCount} 条咨询`]
                .filter(Boolean)
                .join(' · ');
              return (
                <button
                  key={c.caseId}
                  className={`custom-case-list-item ${selectedId === c.caseId ? 'selected' : ''}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(c.caseId)}
                >
                  <div className="custom-case-item-info">
                    <div className="custom-case-item-title">{title}</div>
                    {meta && <div className="custom-case-item-meta">{meta}</div>}
                  </div>
                  <button
                    className="custom-case-item-eval-btn"
                    type="button"
                    onClick={(e) => void handleEval(c.caseId, e)}
                  >
                    跑分
                  </button>
                </button>
              );
            })}
          </div>
        )}
        </div>

        <div className="custom-case-list-aside">
        {!loading && <CustomCaseGuide defaultOpen={cases.length === 0} />}

        {selectedCase && (
          <div className="custom-case-mode-step">
            <h3>选择参与模式</h3>
            <div className="mode-option-list">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`mode-option-card ${chosenMode === opt.value ? 'active' : ''}`}
                  type="button"
                  disabled={disabled || starting}
                  onClick={() => setChosenMode(opt.value)}
                >
                  <strong>{opt.title}</strong>
                  <span>{opt.desc}</span>
                </button>
              ))}
            </div>
            <div className="custom-case-mode-actions">
              <button
                className="custom-case-start-btn"
                type="button"
                disabled={!chosenMode || disabled || starting}
                onClick={() => void handleStart()}
              >
                {starting ? '启动中…' : '进入小镇模拟'}
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
