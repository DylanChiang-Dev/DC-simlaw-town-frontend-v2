import { PRETRIAL_MEDIATION_PROMPT } from '../state/vnEventReducer';

type PretrialMediationDialogProps = {
  onChoose: (accepted: boolean) => void;
};

// 庭前调解为纯前端演出，结局固定（调解不成立→转入庭审）。
// 不提供遮罩关闭：必须二选一，否则剧情队列会一直停在暂停状态。
export function PretrialMediationDialog({ onChoose }: PretrialMediationDialogProps) {
  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="pretrial-mediation-title">
      <section className="confirm-dialog mediation-dialog">
        <div className="panel-kicker">Pretrial Mediation</div>
        <h2 id="pretrial-mediation-title">庭前调解</h2>
        <p>{PRETRIAL_MEDIATION_PROMPT}</p>
        <div className="confirm-dialog-actions">
          <button className="secondary-action" onClick={() => onChoose(false)} type="button">
            拒绝调解
          </button>
          <button className="primary-action" onClick={() => onChoose(true)} type="button">
            接受调解
          </button>
        </div>
      </section>
    </div>
  );
}
