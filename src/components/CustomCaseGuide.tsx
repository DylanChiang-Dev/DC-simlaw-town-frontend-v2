type Props = {
  defaultOpen?: boolean;
};

export function CustomCaseGuide({ defaultOpen = false }: Props) {
  return (
    <details className="wizard-guide" open={defaultOpen}>
      <summary>使用说明：上传什么、怎么用、会生成什么</summary>
      <div className="wizard-guide-section">
        <strong>上传什么</strong>
        <p>
          民事裁判文书纯文本。一审文书必填（不少于 50 字），二审文书选填；单份不超过 5 万字。暂不支持直接上传
          Word/PDF 或扫描件，请先把内容复制为纯文本再粘贴。没有现成文书可点「加载示例文书」体验完整流程。
        </p>
      </div>
      <div className="wizard-guide-section">
        <strong>如何上传</strong>
        <ol>
          <li>把文书粘贴进对应输入框（草稿会自动保存，刷新后可恢复）</li>
          <li>点「开始构造」，系统调用模型抽取案情、生成当事人画像和咨询问题，约需 5-8 分钟，期间请勿刷新</li>
          <li>进入预览，可修改「案由」和「案件背景」</li>
          <li>点「确认并保存」</li>
        </ol>
      </div>
      <div className="wizard-guide-section">
        <strong>系统会生成什么</strong>
        <p>
          一个结构化的模拟案件（编号 case_1000 起），包含案由、案件背景、原被告双方当事人信息与法律人格画像、若干咨询问题及参考答案，并自动生成进小镇模拟所需的案件配置。
        </p>
      </div>
      <div className="wizard-guide-section">
        <strong>保存后能做什么</strong>
        <p>
          在「我的自定义案件」列表中选中该案件，选择参与模式（自动模拟 / 扮演原告律师）进入小镇模拟；或点「跑分」让
          AI 完整模拟一遍并生成评测报告（耗时较长，可在「跑分记录」中查看进度和历史报告）。删除案件不会删除已有跑分记录。
        </p>
      </div>
    </details>
  );
}
