import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const endpoint = process.env.VOLCENGINE_TTS_ENDPOINT ?? 'https://openspeech.bytedance.com/api/v3/tts/unidirectional';
const appId = process.env.VOLCENGINE_TTS_APPID;
const accessToken = process.env.VOLCENGINE_TTS_ACCESS_TOKEN;
const resourceId = process.env.VOLCENGINE_TTS_RESOURCE_ID ?? 'seed-tts-2.0';
const voiceType = process.env.VOLCENGINE_TTS_VOICE_TYPE ?? 'zh_female_xiaohe_uranus_bigtts';
const format = process.env.VOLCENGINE_TTS_FORMAT ?? 'mp3';
const sampleRate = Number(process.env.VOLCENGINE_TTS_SAMPLE_RATE ?? '24000');

const variant = process.env.VOLCENGINE_TTS_VARIANT ?? 'v5';
const sceneSets = {
  v5: [
    {
      file: '01-intro.mp3',
      text: '你的律师 Agent，能打赢一场真实案件吗？不是在聊天框里回答问题，而是在完整诉讼流程里接受考验。',
    },
    {
      file: '02-stats.mp3',
      text: 'Legal World 把七万五千个真实案件、五百多个案由，放进一个可以对抗、可以复盘的法律世界。',
    },
    {
      file: '03-lawyer.mp3',
      text: '你也可以亲自下场，从咨询、起草，到庭审发言，关键节点由你推进，系统记录每一次选择。',
    },
    {
      file: '04-trial.mp3',
      text: '法官、对方律师、当事人和案件角色全部由多智能体驱动，它们会围绕事实、证据和法律依据持续互动。',
    },
    {
      file: '05-observable.mp3',
      text: '工具调用、法条检索、记忆写入，每一步都看得见。训练过程不再是黑箱，而是可追踪的轨迹。',
    },
    {
      file: '06-mcp.mp3',
      text: '通过 MCP 接入你的律师智能体，让它在真实诉讼任务中训练、对抗和评测，输出可以比较的能力证据。',
    },
    {
      file: '07-outro.mp3',
      text: 'Legal World，让法律智能体进入真实流程。',
    },
  ],
  v4: [
    {
      file: '01-intro.mp3',
      text: 'Legal World，是一个能让你亲自下场的 AI 法律世界。它不是单次问答，而是把案件、角色和任务放进完整流程里运行。',
    },
    {
      file: '02-stats.mp3',
      text: '系统连接真实案件、法条记录和案由结构，让你的律师智能体面对接近真实的任务环境，理解事实、证据和法律依据，而不是只回答一段法律咨询。',
    },
    {
      file: '03-lawyer.mp3',
      text: '从原告咨询、起诉状，到庭审发言、上诉判断，你可以亲自推进关键节点，也可以让 AI 自动跑完整个诉讼流程，并留下可复盘的选择。',
    },
    {
      file: '04-trial.mp3',
      text: '进入法庭后，对方律师、当事人和法官都由不同智能体驱动。它们会围绕事实、证据、争议焦点和程序节奏持续对抗，并根据发言改变下一步走向。',
    },
    {
      file: '05-observable.mp3',
      text: '每一次工具调用、法条检索、记忆写入和文书生成，都能被看见、被追踪、被复盘。训练过程不再是黑箱，而是可以检查的证据链。',
    },
    {
      file: '06-mcp.mp3',
      text: '通过 Legal World MCP，把真实案件、法律工具、诉讼阶段和评测信号开放给外部智能体，用来训练、对抗和比较能力，让评测走进真实任务。',
    },
    {
      file: '07-outro.mp3',
      text: 'Legal World，让法律智能体进入真实流程，而不是停在问答里，在世界里真正跑起来。',
    },
  ],
};

const scenes = sceneSets[variant];
if (!scenes) {
  throw new Error(`Unknown VOLCENGINE_TTS_VARIANT: ${variant}`);
}

const outputDir = path.resolve(`public/voiceover/${variant}`);

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
}

function extractAudioBytes(buffer) {
  if (
    buffer.subarray(0, 3).toString('latin1') === 'ID3' ||
    (buffer[0] === 0xff && (buffer[1] === 0xfb || buffer[1] === 0xf3))
  ) {
    return buffer;
  }

  const text = buffer.toString('utf8').trim();
  const chunks = [];
  let index = 0;

  while (index < text.length) {
    while (/\s/.test(text[index] ?? '')) {
      index += 1;
    }
    if (index >= text.length) {
      break;
    }

    let payload;
    try {
      const nextLine = text.indexOf('\n', index);
      const end = nextLine === -1 ? text.length : nextLine;
      payload = JSON.parse(text.slice(index, end));
      index = end + 1;
    } catch {
      payload = JSON.parse(text);
      index = text.length;
    }

    if (payload?.data) {
      chunks.push(Buffer.from(payload.data, 'base64'));
    } else if (payload?.code && payload.code !== 20000000 && payload.code !== 0) {
      throw new Error(`TTS API error ${payload.code}: ${payload.message ?? 'unknown error'}`);
    }
  }

  if (!chunks.length) {
    throw new Error(`TTS response did not contain audio data: ${text.slice(0, 300)}`);
  }

  return Buffer.concat(chunks);
}

async function synthesize(scene, index) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-App-Id': appId,
      'X-Api-Access-Key': accessToken,
      'X-Api-Resource-Id': resourceId,
      'X-Api-Request-Id': `legal-world-promo-${variant}-${index + 1}-${randomUUID()}`,
    },
    body: JSON.stringify({
      user: { uid: 'legal-world-promo' },
      req_params: {
        text: scene.text,
        speaker: voiceType,
        audio_params: {
          format,
          sample_rate: sampleRate,
          bit_rate: 128000,
        },
      },
    }),
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!response.ok) {
    throw new Error(`TTS HTTP ${response.status}: ${buffer.toString('utf8').slice(0, 300)}`);
  }

  const audio = extractAudioBytes(buffer);
  const outPath = path.join(outputDir, scene.file);
  await writeFile(outPath, audio);
  console.log(`generated ${path.relative(process.cwd(), outPath)}`);
}

requireEnv('VOLCENGINE_TTS_APPID', appId);
requireEnv('VOLCENGINE_TTS_ACCESS_TOKEN', accessToken);

await mkdir(outputDir, { recursive: true });

const limit = Number(process.env.VOLCENGINE_TTS_LIMIT ?? scenes.length);
const only = process.env.VOLCENGINE_TTS_ONLY;
const selectedScenes = only
  ? scenes.filter((scene) => scene.file === only || scene.file.startsWith(`${only}-`) || scene.file.startsWith(only))
  : scenes.slice(0, limit);

for (const [index, scene] of selectedScenes.entries()) {
  await synthesize(scene, index);
}
