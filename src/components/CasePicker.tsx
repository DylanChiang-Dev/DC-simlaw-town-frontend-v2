import { useMemo, useState } from 'react';
import { getCaseArtProfile } from '../data/caseArt';
import type { SandboxCaseSummary, SimulationMode } from '../services/types';

const DIFFICULTY_ORDER = ['入门', '进阶', '挑战'];

function caseCauseOf(item: SandboxCaseSummary): string {
  return (item.rawCaseCause || item.trainingCategory || '').trim();
}

type Props = {
  cases: SandboxCaseSummary[];
  disabled?: boolean;
  error: string;
  loading: boolean;
  onBack?: () => void;
  onRefresh: () => Promise<void>;
  onSelect: (caseId: string) => void;
  onOpenHumanEval: () => void;
  onOpenCustomCase?: () => void;
  onStart: (caseId: string, mode: SimulationMode) => Promise<void>;
  selectedCaseId: string;
  variant?: 'overlay' | 'page';
};

const MODE_OPTIONS: { value: SimulationMode; title: string; desc: string }[] = [
  { value: 'auto', title: '自动模拟', desc: 'AI 全程代打，观看完整流程' },
  { value: 'plaintiff', title: '扮演原告律师', desc: '你担任原告律师，亲自参与' },
];

export function CasePicker({
  cases,
  disabled = false,
  error,
  loading,
  onBack,
  onRefresh,
  onSelect,
  onOpenHumanEval,
  onOpenCustomCase,
  onStart,
  selectedCaseId,
  variant = 'overlay',
}: Props) {
  const [step, setStep] = useState<'case' | 'mode'>('case');
  const [chosenMode, setChosenMode] = useState<SimulationMode | null>(null);
  const [causeFilter, setCauseFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const isPage = variant === 'page';
  const layerClassName = isPage ? 'entry-view case-picker-layer' : 'modal-layer';

  const selectedCase = cases.find((item) => item.caseId === selectedCaseId);

  const causeOptions = useMemo(() => {
    const causes = new Set<string>();
    cases.forEach((item) => {
      const cause = caseCauseOf(item);
      if (cause) causes.add(cause);
    });
    return Array.from(causes).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  }, [cases]);

  const difficultyOptions = useMemo(() => {
    const difficulties = new Set<string>();
    cases.forEach((item) => {
      const difficulty = (item.difficulty || '').trim();
      if (difficulty) difficulties.add(difficulty);
    });
    return Array.from(difficulties).sort(
      (a, b) => DIFFICULTY_ORDER.indexOf(a) - DIFFICULTY_ORDER.indexOf(b),
    );
  }, [cases]);

  const filteredCases = useMemo(
    () =>
      cases.filter((item) => {
        if (causeFilter && caseCauseOf(item) !== causeFilter) return false;
        if (difficultyFilter && (item.difficulty || '').trim() !== difficultyFilter) return false;
        return true;
      }),
    [cases, causeFilter, difficultyFilter],
  );

  const hasFilterBar = causeOptions.length > 1 || difficultyOptions.length > 1;

  if (step === 'mode') {
    return (
      <div className={layerClassName} role={isPage ? undefined : 'dialog'} aria-modal={isPage ? undefined : true} aria-label="选择模式">
        <section className="case-picker case-picker-mode" aria-label="模式选择">
          <div className="case-picker-header">
            <div>
              <div className="panel-kicker">Mode</div>
              <h2>选择参与模式</h2>
            </div>
            <p>你选择了：{selectedCase ? selectedCase.title : selectedCaseId}</p>
          </div>
          {error && <div className="case-picker-error" role="alert">{error}</div>}
          <div className="mode-option-list">
            {MODE_OPTIONS.map((opt) => (
              <button
                className={`mode-option-card ${chosenMode === opt.value ? 'active' : ''}`}
                disabled={disabled || loading}
                key={opt.value}
                onClick={() => setChosenMode(opt.value)}
                type="button"
              >
                <strong>{opt.title}</strong>
                <span>{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="case-picker-actions">
            <button
              className="secondary-action"
              disabled={disabled || loading}
              onClick={() => setStep('case')}
              type="button"
            >
              返回选案件
            </button>
            <button
              className="primary-action"
              disabled={disabled || loading || !chosenMode}
              onClick={() => {
                if (chosenMode) void onStart(selectedCaseId, chosenMode);
              }}
              type="button"
            >
              {loading ? '进入中' : '确认开始'}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={layerClassName} role={isPage ? undefined : 'dialog'} aria-modal={isPage ? undefined : true} aria-label="选择案件">
      <section className="case-picker" aria-label="案件选择">
        <div className="case-picker-header">
          <div>
            <div className="panel-kicker">Case Docket</div>
            <h2>选择要进入的案件</h2>
          </div>
          <p>选择一个案件后进入法律全流程仿真。案件运行期间，这个选择器不会常驻显示。</p>
        </div>
        {error && <div className="case-picker-error" role="alert">{error}</div>}
        {hasFilterBar && (
          <div className="case-filter-bar">
            <select
              aria-label="按案由筛选"
              className="case-filter-select"
              disabled={disabled || loading}
              onChange={(event) => setCauseFilter(event.target.value)}
              value={causeFilter}
            >
              <option value="">全部案由</option>
              {causeOptions.map((cause) => (
                <option key={cause} value={cause}>{cause}</option>
              ))}
            </select>
            <div className="case-filter-chips" role="group" aria-label="按难度筛选">
              <button
                className={`case-filter-chip ${difficultyFilter === '' ? 'active' : ''}`}
                disabled={disabled || loading}
                onClick={() => setDifficultyFilter('')}
                type="button"
              >
                全部难度
              </button>
              {difficultyOptions.map((difficulty) => (
                <button
                  className={`case-filter-chip ${difficultyFilter === difficulty ? 'active' : ''}`}
                  disabled={disabled || loading}
                  key={difficulty}
                  onClick={() => setDifficultyFilter(difficulty)}
                  type="button"
                >
                  {difficulty}
                </button>
              ))}
            </div>
            <span className="case-filter-count">共 {filteredCases.length} 件</span>
          </div>
        )}
        <div className="case-list">
          {loading && !cases.length && (
            <div className="case-list-loading" role="status">
              <strong>正在读取案件索引</strong>
              <span>案件目录会在这里自动出现，可以先停留片刻。</span>
            </div>
          )}
          {filteredCases.map((item) => {
            const active = item.caseId === selectedCaseId;
            const art = getCaseArtProfile(item.caseId);
            return (
              <button
                className={`case-card ${active ? 'active' : ''}`}
                disabled={disabled || loading}
                key={item.caseId}
                onClick={() => onSelect(item.caseId)}
                type="button"
              >
                <img
                  className="case-card-preview"
                  src={art.caseCg}
                  alt={`${item.title}案件预览`}
                  decoding="async"
                  loading="lazy"
                />
                <strong>{item.title}</strong>
                <span>{item.plaintiffName} 诉 {item.defendantName}</span>
                <small>{item.trainingCategory || item.rawCaseCause} / {item.difficulty}</small>
              </button>
            );
          })}
          {!cases.length && !loading && <div className="empty-case">当前案件工作区没有可启动案件。</div>}
          {cases.length > 0 && !filteredCases.length && (
            <div className="empty-case">没有符合当前筛选条件的案件，换个案由或难度试试。</div>
          )}
        </div>
        <div className="case-picker-actions">
          {onBack && (
            <button className="secondary-action" onClick={onBack} type="button">
              ← 返回选择
            </button>
          )}
          <button className="secondary-action" disabled={disabled || loading} onClick={() => void onRefresh()} type="button">
            刷新案件
          </button>
          <button className="secondary-action human-eval-entry-action" disabled={disabled || loading} onClick={onOpenHumanEval} type="button">
            人工评测
          </button>
          {onOpenCustomCase && (
            <button className="secondary-action custom-case-entry-action" disabled={disabled || loading} onClick={onOpenCustomCase} type="button">
              上传文书构造案件
            </button>
          )}
          <button
            className="primary-action"
            disabled={disabled || loading || !selectedCaseId}
            onClick={() => { setChosenMode(null); setStep('mode'); }}
            type="button"
          >
            进入所选案件
          </button>
        </div>
      </section>
    </div>
  );
}
