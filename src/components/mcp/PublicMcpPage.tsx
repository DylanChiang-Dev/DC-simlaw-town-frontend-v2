import { ReactNode, useEffect } from 'react';
import {
  LANDING_MCP_CONTACT_CTA,
  LANDING_MCP_CONTACT_LEAD,
  MCP_DATA_TIERS,
  MCP_HIGHLIGHTS,
  MCP_LAW_CORPUS_FACTS,
  MCP_PAGE_INTRO,
  MCP_PAGE_TAGLINE,
  MCP_PAGE_TITLE,
  MCP_SKILLS,
  MCP_STAGES,
  MCP_TOOLS,
  MCP_TRAINING_SIGNALS,
  MCP_TRAINING_USES,
  MCP_WHY_POINTS,
  PROJECT_CONTACT_EMAIL,
} from '../../config/projectInfo';

const CONTACT_HREF = `mailto:${PROJECT_CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Legal World MCP 服务咨询',
)}`;

const TOOL_TAG_SLUG: Record<string, string> = {
  核心: 'core',
  扩展: 'ext',
  调试: 'debug',
};
const LANDING_PAGE_HREF = import.meta.env.BASE_URL;

type SectionProps = {
  id: string;
  title: string;
  lead?: string;
  children: ReactNode;
};

function McpSection({ id, title, lead, children }: SectionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className="mcp-section">
      <h2 className="mcp-section-title" id={`${id}-title`}>{title}</h2>
      {lead && <p className="mcp-section-lead">{lead}</p>}
      {children}
    </section>
  );
}

export function PublicMcpPage() {
  useEffect(() => {
    document.body.classList.add('mcp-route');
    const previousTitle = document.title;
    document.title = `${MCP_PAGE_TITLE} · MCP 服务`;
    return () => {
      document.body.classList.remove('mcp-route');
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="mcp-page">
      <header className="mcp-page-header">
        <button
          className="mcp-back-link"
          onClick={() => window.location.assign(LANDING_PAGE_HREF)}
          type="button"
        >
          ← 返回首页
        </button>
        <span className="mcp-page-brand">Legal World</span>
      </header>

      <section className="mcp-hero" aria-labelledby="mcp-hero-title">
        <p className="mcp-hero-eyebrow">MCP · Model Context Protocol</p>
        <h1 className="mcp-hero-title" id="mcp-hero-title">{MCP_PAGE_TITLE}</h1>
        <p className="mcp-hero-tagline">{MCP_PAGE_TAGLINE}</p>
        <p className="mcp-hero-intro">{MCP_PAGE_INTRO}</p>
      </section>

      <McpSection id="mcp-highlights" title="核心亮点">
        <ul className="mcp-highlight-grid">
          {MCP_HIGHLIGHTS.map((item) => (
            <li className="mcp-highlight-card" key={item.label}>
              <span className="mcp-highlight-label">{item.label}</span>
              <span className="mcp-highlight-value">{item.value}</span>
              <span className="mcp-highlight-detail">{item.detail}</span>
            </li>
          ))}
        </ul>
      </McpSection>

      <McpSection
        id="mcp-why"
        title="为什么适合训练法律智能体"
        lead="LegalWorld 不只是问答数据集，而是一个会持续推进法律流程的交互环境，外部 Agent 需要在不同阶段做出不同类型的行动。"
      >
        <ul className="mcp-why-list">
          {MCP_WHY_POINTS.map((point) => (
            <li className="mcp-why-item" key={point}>{point}</li>
          ))}
        </ul>
      </McpSection>

      <McpSection
        id="mcp-stages"
        title="环境任务范围"
        lead="一期默认开放“当前方律师”角色，只把当前当事人一侧律师的发言、文书起草和出庭动作替换为外部 Agent 输入；对手方由环境内部 Agent 控制。"
      >
        <div className="mcp-table-scroll">
          <table className="mcp-table">
            <thead>
              <tr>
                <th scope="col">阶段</th>
                <th scope="col">名称</th>
                <th scope="col">外部 Agent 可扮演的典型职责</th>
              </tr>
            </thead>
            <tbody>
              {MCP_STAGES.map((stage) => (
                <tr key={stage.code}>
                  <td><code className="mcp-code">{stage.code}</code></td>
                  <td>{stage.name}</td>
                  <td>{stage.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </McpSection>

      <McpSection id="mcp-data" title="数据与场景资源">
        <div className="mcp-data-grid">
          <div className="mcp-data-block">
            <h3 className="mcp-subhead">案件数据</h3>
            <ul className="mcp-tier-list">
              {MCP_DATA_TIERS.map((tier) => (
                <li className="mcp-tier-item" key={tier.tier}>
                  <span className="mcp-tier-name">{tier.tier}</span>
                  <span className="mcp-tier-desc">{tier.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mcp-data-block">
            <h3 className="mcp-subhead">法律法规检索</h3>
            <ul className="mcp-fact-list">
              {MCP_LAW_CORPUS_FACTS.map((fact) => (
                <li className="mcp-fact-item" key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </div>
      </McpSection>

      <McpSection
        id="mcp-skills"
        title="Skill 资源"
        lead="Skill 负责告诉 Agent 在特定法律任务中“应该怎么做”：如何追问信息、如何组织文书、如何避免虚构事实、如何把阶段进展写入长期记忆。"
      >
        <div className="mcp-table-scroll">
          <table className="mcp-table">
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">类型</th>
                <th scope="col">作用</th>
              </tr>
            </thead>
            <tbody>
              {MCP_SKILLS.map((skill) => (
                <tr key={skill.name}>
                  <td><code className="mcp-code">{skill.name}</code></td>
                  <td>{skill.type}</td>
                  <td>{skill.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </McpSection>

      <McpSection
        id="mcp-tools"
        title="Tool 资源"
        lead="当前代码内可归纳为 17 个 Tool 级能力，覆盖环境推进、法律检索、文书导出、评测和调试读取。"
      >
        <div className="mcp-table-scroll">
          <table className="mcp-table">
            <thead>
              <tr>
                <th scope="col">Tool</th>
                <th scope="col">分类</th>
                <th scope="col">作用</th>
              </tr>
            </thead>
            <tbody>
              {MCP_TOOLS.map((tool) => (
                <tr key={tool.name}>
                  <td><code className="mcp-code">{tool.name}</code></td>
                  <td>
                    <span className={`mcp-tag mcp-tag-${TOOL_TAG_SLUG[tool.category]}`}>
                      {tool.category}
                    </span>
                  </td>
                  <td>{tool.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </McpSection>

      <McpSection id="mcp-signals" title="可产生的训练信号">
        <div className="mcp-data-grid">
          <div className="mcp-data-block">
            <h3 className="mcp-subhead">环境侧产出</h3>
            <ul className="mcp-fact-list">
              {MCP_TRAINING_SIGNALS.map((signal) => (
                <li className="mcp-fact-item" key={signal}>{signal}</li>
              ))}
            </ul>
          </div>
          <div className="mcp-data-block">
            <h3 className="mcp-subhead">可用于</h3>
            <ul className="mcp-fact-list">
              {MCP_TRAINING_USES.map((use) => (
                <li className="mcp-fact-item" key={use}>{use}</li>
              ))}
            </ul>
          </div>
        </div>
      </McpSection>

      <section className="mcp-contact" aria-labelledby="mcp-contact-title">
        <h2 className="mcp-contact-title" id="mcp-contact-title">接入 Legal World MCP</h2>
        <p className="mcp-contact-lead">{LANDING_MCP_CONTACT_LEAD}</p>
        <a className="mcp-contact-cta" href={CONTACT_HREF}>{LANDING_MCP_CONTACT_CTA}</a>
      </section>
    </main>
  );
}
