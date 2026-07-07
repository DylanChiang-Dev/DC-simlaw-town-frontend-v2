type Props = {
  onPreset: () => void;
  onCustom: () => void;
};

export function LandingChoice({ onPreset, onCustom }: Props) {
  return (
    <section className="entry-view landing-choice-layer" aria-label="选择模拟方式">
      <div className="landing-choice-panel">
        <div className="landing-choice-header">
          <div className="panel-kicker">SimAilaw Town</div>
          <h2>选择模拟方式</h2>
          <p>预设案件即开即用，或上传文书构造专属案件</p>
        </div>
        <div className="landing-choice-cards">
          <button
            className="landing-choice-card landing-choice-card--preset"
            type="button"
            onClick={onPreset}
          >
            <div className="landing-card-icon">⚖</div>
            <div className="landing-card-body">
              <div className="landing-card-title">系统预设案件</div>
              <div className="landing-card-desc">
                从精心设计的真实案例库中选取案件，直接开始模拟训练
              </div>
            </div>
            <div className="landing-card-arrow">→</div>
          </button>
          <button
            className="landing-choice-card landing-choice-card--custom"
            type="button"
            onClick={onCustom}
          >
            <div className="landing-card-icon">📄</div>
            <div className="landing-card-body">
              <div className="landing-card-title">上传文书自定义模拟</div>
              <div className="landing-card-desc">
                上传裁判文书，AI 自动构造案件脚本，进入小镇参与真实模拟
              </div>
            </div>
            <div className="landing-card-arrow">→</div>
          </button>
        </div>
      </div>
    </section>
  );
}
