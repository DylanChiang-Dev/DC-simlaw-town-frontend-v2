import { authenticatedFetch, readJsonResponse } from './apiClient';

export type ExtractedInfo = Record<string, unknown>;

export type CustomCaseSummary = {
  caseId: string;
  caseCause?: string | null;
  caseBackground?: string | null;
  partyNames: string[];
  questionCount: number;
};

type CustomCaseSummaryResponse = {
  case_id: string;
  case_cause?: string | null;
  case_background?: string | null;
  party_names?: string[];
  question_count?: number;
};

export async function listCustomCases(): Promise<CustomCaseSummary[]> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases', {
    method: 'GET',
  });
  const payload = await readJsonResponse<{ cases?: CustomCaseSummaryResponse[] }>(response);
  return (payload.cases ?? []).map((item) => ({
    caseId: item.case_id,
    caseCause: item.case_cause,
    caseBackground: item.case_background,
    partyNames: Array.isArray(item.party_names) ? item.party_names : [],
    questionCount: Number(item.question_count ?? 0),
  }));
}

export async function deleteCustomCase(caseId: string): Promise<void> {
  await authenticatedFetch(`/api/sandbox/custom-cases/${caseId}`, {
    method: 'DELETE',
  });
}

export async function buildCustomCase(text: string, textSecond?: string): Promise<ExtractedInfo> {
  const body: Record<string, string> = { text };
  if (textSecond) body.text_second = textSecond;
  const response = await authenticatedFetch('/api/sandbox/custom-cases/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await readJsonResponse<{ extracted_info?: ExtractedInfo }>(response);
  return payload.extracted_info ?? {};
}

export async function fetchCustomCaseSample(): Promise<{ text: string; textSecond: string }> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases/sample', {
    method: 'GET',
  });
  const payload = await readJsonResponse<{ text?: string; text_second?: string }>(response);
  return { text: payload.text ?? '', textSecond: payload.text_second ?? '' };
}

export async function confirmCustomCase(extractedInfo: ExtractedInfo): Promise<string> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extracted_info: extractedInfo }),
  });
  const payload = await readJsonResponse<{ case_id?: string }>(response);
  return payload.case_id ?? '';
}

export type EvalJobStatus =
  | 'queued'
  | 'simulating'
  | 'evaluating'
  | 'completed'
  | 'failed'
  | 'interrupted';

export type EvalJob = {
  jobId: string;
  caseId: string;
  status: EvalJobStatus;
  stage?: string | null;
  stageName?: string | null;
  progressPercent?: number | null;
  overallScore?: number | null;
  error?: string | null;
};

type EvalJobResponse = {
  job_id: string;
  case_id: string;
  status: EvalJobStatus;
  stage?: string | null;
  stage_name?: string | null;
  progress_percent?: number | null;
  overall_score?: number | null;
  error?: string | null;
};

export async function startEvaluation(caseId: string): Promise<string> {
  const response = await authenticatedFetch(`/api/sandbox/custom-cases/${caseId}/evaluate`, {
    method: 'POST',
  });
  const payload = await readJsonResponse<{ job_id?: string }>(response);
  return payload.job_id ?? '';
}

export async function fetchEvalJob(jobId: string): Promise<EvalJob> {
  const response = await authenticatedFetch(`/api/sandbox/custom-cases/jobs/${jobId}`, {
    method: 'GET',
  });
  const p = await readJsonResponse<EvalJobResponse>(response);
  return {
    jobId: p.job_id,
    caseId: p.case_id,
    status: p.status,
    stage: p.stage,
    stageName: p.stage_name,
    progressPercent: p.progress_percent,
    overallScore: p.overall_score,
    error: p.error,
  };
}

export async function fetchEvalReport(jobId: string): Promise<{ markdown: string; summary: unknown }> {
  const response = await authenticatedFetch(`/api/sandbox/custom-cases/jobs/${jobId}/report`, {
    method: 'GET',
  });
  return readJsonResponse<{ markdown: string; summary: unknown }>(response);
}

export type EvalJobSummary = {
  jobId: string;
  caseId: string;
  caseCause?: string | null;
  status: EvalJobStatus;
  overallScore?: number | null;
  createdAt?: string | null;
  completedAt?: string | null;
};

type EvalJobSummaryResponse = {
  job_id: string;
  case_id: string;
  case_cause?: string | null;
  status: EvalJobStatus;
  overall_score?: number | null;
  created_at?: string | null;
  completed_at?: string | null;
};

export async function listEvalJobs(): Promise<EvalJobSummary[]> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases/jobs', {
    method: 'GET',
  });
  const payload = await readJsonResponse<{ jobs?: EvalJobSummaryResponse[] }>(response);
  return (payload.jobs ?? []).map((job) => ({
    jobId: job.job_id,
    caseId: job.case_id,
    caseCause: job.case_cause,
    status: job.status,
    overallScore: job.overall_score,
    createdAt: job.created_at,
    completedAt: job.completed_at,
  }));
}

export type CustomCaseDraftStatus = 'empty' | 'text' | 'building' | 'preview' | 'confirmed';

export type CustomCaseDraft = {
  version: number;
  status: CustomCaseDraftStatus;
  sourceText: string;
  sourceTextChars: number;
  sourceTextSecond: string;
  extractedInfo: ExtractedInfo | null;
  caseId: string;
  buildRequestId: string;
  lastError: string;
  createdAt: string;
  updatedAt: string;
};

type CustomCaseDraftResponse = {
  version?: number;
  status?: CustomCaseDraftStatus;
  source_text?: string;
  source_text_chars?: number;
  source_text_second?: string;
  extracted_info?: ExtractedInfo | null;
  case_id?: string;
  build_request_id?: string;
  last_error?: string;
  created_at?: string;
  updated_at?: string;
};

function mapDraft(payload: CustomCaseDraftResponse = {}): CustomCaseDraft {
  return {
    version: Number(payload.version || 1),
    status: payload.status || 'empty',
    sourceText: String(payload.source_text || ''),
    sourceTextChars: Number(payload.source_text_chars ?? String(payload.source_text || '').length),
    sourceTextSecond: String(payload.source_text_second || ''),
    extractedInfo: payload.extracted_info || null,
    caseId: String(payload.case_id || ''),
    buildRequestId: String(payload.build_request_id || ''),
    lastError: String(payload.last_error || ''),
    createdAt: String(payload.created_at || ''),
    updatedAt: String(payload.updated_at || ''),
  };
}

export async function fetchCustomCaseDraft(): Promise<CustomCaseDraft> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases/draft', {
    method: 'GET',
  });
  const payload = await readJsonResponse<{ draft?: CustomCaseDraftResponse }>(response);
  return mapDraft(payload.draft || {});
}

export async function saveCustomCaseDraft(input: {
  sourceText: string;
  sourceTextSecond?: string;
  status?: 'text' | 'empty';
}): Promise<CustomCaseDraft> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases/draft', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_text: input.sourceText,
      source_text_second: input.sourceTextSecond ?? '',
      status: input.status || 'text',
    }),
  });
  const payload = await readJsonResponse<{ draft?: CustomCaseDraftResponse }>(response);
  return mapDraft(payload.draft || {});
}

export async function clearCustomCaseDraft(): Promise<CustomCaseDraft> {
  const response = await authenticatedFetch('/api/sandbox/custom-cases/draft', {
    method: 'DELETE',
  });
  const payload = await readJsonResponse<{ draft?: CustomCaseDraftResponse }>(response);
  return mapDraft(payload.draft || {});
}
