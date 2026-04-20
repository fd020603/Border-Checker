import { decisionMeta, type EvaluationResult, type JsonObject } from "./workspace-types";
import {
  DecisionBadge,
  EmptyState,
  SectionIntro,
  TextList,
} from "./workspace-ui";
import { formatJson } from "./workspace-runtime";
import { buildBeginnerGuidance } from "./result-guidance";
import { buildChecklistHintMap } from "./checklist-hints";

const DECISION_ORDER = [
  "deny",
  "manual_review",
  "condition_allow",
  "allow",
] as const;

export function ResultPanel({
  evaluationResult,
}: {
  evaluationResult: EvaluationResult | null;
}) {
  const activeDecision = evaluationResult?.final_decision;
  const beginnerGuidance = evaluationResult
    ? buildBeginnerGuidance(evaluationResult)
    : null;
  const quickChecklistHints = beginnerGuidance
    ? buildChecklistHintMap(beginnerGuidance.quickChecklist)
    : {};
  const legalBasisHints = evaluationResult
    ? buildChecklistHintMap(evaluationResult.legal_basis_articles)
    : {};
  const requiredActionHints = evaluationResult
    ? buildChecklistHintMap(evaluationResult.required_actions)
    : {};
  const nextStepHints = evaluationResult
    ? buildChecklistHintMap(evaluationResult.next_steps)
    : {};
  const evidenceGapHints = evaluationResult
    ? buildChecklistHintMap(evaluationResult.qualitative_review_hints.evidence_gaps)
    : {};
  const reviewerChecklistHints = evaluationResult
    ? buildChecklistHintMap(evaluationResult.qualitative_review_hints.reviewer_checklist)
    : {};

  return (
    <section className="glass-panel rounded-[32px] border border-[var(--color-line)] p-6">
      <SectionIntro
        kicker="평가 결과"
        title="최종 결정과 후속 조치"
        description="네 단계의 정성적 결정만 사용하고, 점수나 숫자 등급은 표시하지 않습니다."
      />
      {evaluationResult && activeDecision ? (
        <div className="mt-5 space-y-5">
          {beginnerGuidance ? (
            <div className="result-focus-card rounded-[26px] border border-[var(--color-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,251,249,0.88))] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    For Business Users
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">
                    쉬운 말로 보면 이런 뜻입니다
                  </h3>
                </div>
                <DecisionBadge decision={activeDecision} />
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="visual-stat">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    이 결과의 의미
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
                    {beginnerGuidance.businessMeaning}
                  </p>
                </div>
                <div className="visual-stat">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    지금 진행해도 되나요
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
                    {beginnerGuidance.canProceedNow}
                  </p>
                </div>
                <div className="visual-stat">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    가장 큰 이유
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
                    {beginnerGuidance.primaryReason}
                  </p>
                </div>
                <div className="visual-stat">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    먼저 할 일
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
                    {beginnerGuidance.firstAction}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <TextList
                  title="누가 같이 보면 좋나요"
                  items={[beginnerGuidance.whoShouldBeInvolved]}
                  className="result-focus-card"
                />
                <TextList
                  title="빠른 체크리스트"
                  items={beginnerGuidance.quickChecklist}
                  itemHints={quickChecklistHints}
                  className="result-focus-card"
                />
              </div>
              {beginnerGuidance.glossary.length > 0 ? (
                <div className="mt-4">
                  <TextList
                    title="전문용어 쉬운 풀이"
                    items={beginnerGuidance.glossary}
                    className="result-focus-card"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="result-focus-card reveal-up rounded-[26px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <DecisionBadge decision={activeDecision} />
                <div>
                  <p className="text-xl font-semibold text-[var(--color-ink)]">
                    {evaluationResult.summary}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {evaluationResult.explanation}
                  </p>
                </div>
              </div>
              <div className="max-w-xs rounded-2xl border border-[var(--color-line)] bg-[#faf7f2] p-4">
                <p className="text-sm font-semibold text-[var(--color-ink)]">
                  결정 해석
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {decisionMeta[activeDecision].description}
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="result-focus-card rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5">
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                결정 레일
              </p>
              <div className="decision-rail mt-4">
                {DECISION_ORDER.map((decision) => {
                  const isActive = decision === activeDecision;
                  return (
                    <div
                      key={decision}
                      className={`decision-rail-card ${
                        isActive ? `active ${decisionMeta[decision].className}` : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">
                          {decisionMeta[decision].label}
                        </span>
                        {isActive ? (
                          <span className="text-xs font-semibold uppercase">
                            current
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                        {decisionMeta[decision].description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="visual-stat result-focus-card">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Triggered Rules
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                  {evaluationResult.triggered_rules.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  최종 결정에 반영된 규칙 수
                </p>
              </div>
              <div className="visual-stat result-focus-card">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Required Actions
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                  {evaluationResult.required_actions.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  실행 전 확인할 조치 수
                </p>
              </div>
              <div className="visual-stat result-focus-card">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Evidence Gaps
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                  {evaluationResult.qualitative_review_hints.evidence_gaps.length}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  추가 증빙이 필요한 항목 수
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <TextList
              title="법적 근거"
              items={evaluationResult.legal_basis_articles}
              itemHints={legalBasisHints}
              className="result-focus-card"
            />
            <TextList
              title="필수 조치"
              items={evaluationResult.required_actions}
              itemHints={requiredActionHints}
              className="result-focus-card"
            />
            <TextList
              title="다음 단계"
              items={evaluationResult.next_steps}
              itemHints={nextStepHints}
              className="result-focus-card"
            />
            <TextList
              title="증빙 공백"
              items={evaluationResult.qualitative_review_hints.evidence_gaps}
              itemHints={evidenceGapHints}
              emptyCopy="자동으로 식별된 핵심 증빙 공백은 없습니다."
              className="result-focus-card"
            />
          </div>
          <div className="result-focus-card rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-4">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              정성적 검토 메모
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {evaluationResult.qualitative_review_hints.ambiguity_summary}
            </p>
          </div>
          <TextList
            title="리뷰어 체크리스트"
            items={evaluationResult.qualitative_review_hints.reviewer_checklist}
            itemHints={reviewerChecklistHints}
            emptyCopy="추가 체크리스트가 지정되지 않았습니다."
            className="result-focus-card"
          />
        </div>
      ) : (
        <EmptyState
          title="평가 결과가 아직 없습니다."
          description="필수 선택을 마친 뒤 평가 실행을 누르면 최종 결정과 설명이 이 영역에 표시됩니다."
        />
      )}
    </section>
  );
}

export function ExplainabilityPanel({
  evaluationResult,
  mergePreview,
}: {
  evaluationResult: EvaluationResult | null;
  mergePreview: JsonObject | null;
}) {
  const triggeredRuleHints = evaluationResult
    ? buildChecklistHintMap(
        evaluationResult.triggered_rules.flatMap((rule) => [
          ...rule.required_evidence,
          ...rule.reviewer_notes,
          ...rule.references,
        ]),
      )
    : {};

  return (
    <section className="glass-panel rounded-[32px] border border-[var(--color-line)] p-6">
      <SectionIntro
        kicker="설명 가능성 / 감사 추적"
        title="발동 규칙과 병합 입력"
        description="발동 규칙별 근거, 트레이스, 병합된 입력값을 함께 확인할 수 있습니다."
      />
      {evaluationResult ? (
        <div className="mt-5 space-y-5">
          <div className="space-y-4">
            {evaluationResult.triggered_rules.map((rule) => (
              <article
                key={rule.rule_id}
                className="result-focus-card interactive-card rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {rule.article} · {rule.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
                      {rule.title}
                    </h3>
                  </div>
                  <DecisionBadge decision={rule.decision} compact />
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {rule.rationale}
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <TextList
                    title="확인 사실"
                    items={rule.matched_facts}
                    compact
                    className="result-focus-card"
                  />
                  <TextList
                    title="추가 확인 증빙"
                    items={rule.required_evidence}
                    itemHints={triggeredRuleHints}
                    compact
                    emptyCopy="추가 증빙 요구 없음"
                    className="result-focus-card"
                  />
                  <TextList
                    title="리뷰어 메모"
                    items={rule.reviewer_notes}
                    itemHints={triggeredRuleHints}
                    compact
                    emptyCopy="별도 리뷰어 메모 없음"
                    className="result-focus-card"
                  />
                  <TextList
                    title="참고 참조"
                    items={rule.references}
                    itemHints={triggeredRuleHints}
                    compact
                    emptyCopy="추가 참조 없음"
                    className="result-focus-card"
                  />
                </div>
              </article>
            ))}
          </div>
          <div className="result-focus-card rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Evaluation Trace
            </p>
            <div className="mt-3 max-h-[280px] space-y-3 overflow-y-auto pr-1">
              {evaluationResult.evaluation_trace.rule_results.map((trace) => (
                <div
                  key={trace.rule_id}
                  className="rounded-2xl border border-[var(--color-line)] bg-[#faf7f2] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      {trace.title}
                    </p>
                    <span className="text-xs text-[var(--color-muted)]">
                      {trace.matched ? "matched" : "not matched"}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--color-muted)]">
                    {trace.reasoning.map((item) => (
                      <li key={`${trace.rule_id}-${item}`}>- {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="result-focus-card rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5">
            <p className="text-sm font-semibold text-[var(--color-ink)]">
              Merged Input Preview
            </p>
            <pre className="code-block mt-4 max-h-[320px] overflow-auto rounded-2xl p-4 text-sm leading-6 text-[var(--color-ink)]">
              {formatJson(evaluationResult.merged_input)}
            </pre>
          </div>
        </div>
      ) : mergePreview ? (
        <div className="mt-5 rounded-[24px] border border-[var(--color-line)] bg-[var(--color-surface-strong)] p-5">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Merge Preview
          </p>
          <pre className="code-block mt-4 max-h-[360px] overflow-auto rounded-2xl p-4 text-sm leading-6 text-[var(--color-ink)]">
            {formatJson(mergePreview)}
          </pre>
        </div>
      ) : (
        <EmptyState
          title="설명 가능성 패널이 비어 있습니다."
          description="병합 미리보기 또는 평가 실행을 누르면 병합 결과와 규칙 트레이스가 여기에 표시됩니다."
        />
      )}
    </section>
  );
}
