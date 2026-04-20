import {
  dataTypeOptions,
  datasetOptions,
  derogationTypeOptions,
  euRegionOptions,
  lawfulBasisOptions,
  targetRegionOptions,
} from "./workspace-form-config";
import { getOptionLabel, toNullableBoolean, toRequiredBoolean } from "./workspace-runtime";
import type { FieldOption } from "./workspace-types";
import type { GuidedField, GuidedFormState, PackUiDefinition } from "./guided-pack-types";

const yesNoOptions: FieldOption[] = [
  { value: "true", label: "예" },
  { value: "false", label: "아니오" },
];

const yesNoUnknownOptions: FieldOption[] = [
  { value: "true", label: "예" },
  { value: "false", label: "아니오" },
  { value: "unknown", label: "잘 모르겠음" },
];

const gdprSubjectOptions: FieldOption[] = [
  { value: "EU", label: "EU" },
  { value: "EEA", label: "EEA" },
  { value: "UK", label: "UK" },
  { value: "OTHER", label: "기타" },
];

const saudiDatasetOptions: FieldOption[] = [
  { value: "ksa_customer_profiles", label: "사우디 고객 프로필" },
  { value: "ksa_loyalty_events", label: "사우디 멤버십/이벤트 로그" },
  { value: "ksa_support_cases", label: "사우디 고객지원 케이스" },
  { value: "ksa_employee_records", label: "사우디 인사 기록" },
  { value: "ksa_health_service_cases", label: "사우디 건강·민감 케이스" },
];

const saudiLegalBasisOptions: FieldOption[] = [
  { value: "consent", label: "동의" },
  { value: "contractual_necessity", label: "계약 이행 필요" },
  { value: "legal_obligation", label: "법적 의무" },
  { value: "public_interest", label: "공익 또는 공공업무" },
  { value: "vital_interest", label: "중대한 이익 보호" },
  { value: "legitimate_interest", label: "정당한 이익" },
];

const dataSubjectConnectionOptions: FieldOption[] = [
  { value: "KSA_RESIDENT", label: "사우디 거주자 데이터" },
  { value: "COLLECTED_IN_KSA", label: "사우디 내 수집 데이터" },
  { value: "OTHER", label: "사우디 연결성 불명확" },
];

const saudiTransferExceptionTypeOptions: FieldOption[] = [
  { value: "data_subject_contract", label: "정보주체 계약 이행 필요" },
  { value: "public_interest_public_entity", label: "공공기관 공익 목적" },
  { value: "crime_detection_public_entity", label: "범죄 수사·집행 목적" },
  { value: "vital_interest_unreachable", label: "연락 불가 정보주체의 중대한 이익" },
];

const gdprElevatedDataTypes = new Set([
  "health_support_cases",
  "hr_records",
  "payment_operations",
]);

function emptyFirst(options: FieldOption[], placeholder: string) {
  return [{ value: "", label: placeholder }, ...options];
}

function missingVisibleRequired(
  fields: readonly GuidedField[],
  state: GuidedFormState,
) {
  return fields
    .filter((field) => field.required && (!field.visibleIf || field.visibleIf(state)))
    .filter((field) => !state[field.key])
    .map((field) => field.label);
}

function isGdprCrossBorderContext(state: GuidedFormState) {
  return Boolean(state.target_region)
    && !euRegionOptions.some((option) => option.value === state.target_region);
}

function needsGdprElevatedGovernanceQuestions(state: GuidedFormState) {
  return (
    state.contains_sensitive_data === "true"
    || gdprElevatedDataTypes.has(state.data_type)
    || isGdprCrossBorderContext(state)
  );
}

function isSaudiCrossBorderContext(state: GuidedFormState) {
  return Boolean(state.target_region) && !state.target_region.startsWith("sa-");
}

const gdprDefaultState: GuidedFormState = {
  dataset_name: "",
  data_type: "",
  data_subject_region: "",
  current_region: "",
  target_region: "",
  lawful_basis: "",
  processing_purpose_defined: "",
  data_minimized: "",
  retention_period_defined: "",
  contains_sensitive_data: "unknown",
  special_category_condition_met: "unknown",
  uses_processor: "unknown",
  controller_processor_roles_defined: "unknown",
  dpa_in_place: "unknown",
  processor_sufficient_guarantees: "unknown",
  subprocessor_controls_in_place: "unknown",
  scc_in_place: "unknown",
  bcr_in_place: "unknown",
  other_safeguards_in_place: "unknown",
  transfer_impact_assessment_completed: "unknown",
  supplemental_measures_documented: "unknown",
  derogation_used: "",
  derogation_type: "",
  encryption_at_rest: "",
  encryption_in_transit: "unknown",
  access_control_in_place: "unknown",
  incident_response_in_place: "unknown",
  breach_notification_ready_72h: "unknown",
  privacy_notice_updated: "unknown",
  transfer_disclosed_to_subject: "unknown",
  records_of_processing_exists: "unknown",
  transfer_documented_in_ropa: "unknown",
  data_subject_rights_process_ready: "unknown",
  privacy_by_design_review_completed: "unknown",
  dpia_required: "",
  dpia_completed: "",
  dpo_required: "",
  dpo_assigned: "",
};

const saudiDefaultState: GuidedFormState = {
  dataset_name: "",
  data_type: "",
  data_subject_connection: "",
  current_region: "",
  target_region: "",
  processing_legal_basis: "",
  processing_purpose_defined: "",
  data_minimized: "",
  retention_period_defined: "",
  contains_sensitive_data: "unknown",
  explicit_consent_for_sensitive_data: "unknown",
  privacy_policy_available: "unknown",
  data_subject_rights_request_ready: "unknown",
  consent_withdrawal_process_ready: "unknown",
  data_accuracy_review_completed: "unknown",
  privacy_notice_available: "unknown",
  cross_border_notice_provided: "unknown",
  adequate_protection_confirmed: "unknown",
  binding_common_rules_approved: "unknown",
  standard_contractual_clauses_in_place: "unknown",
  certification_or_code_in_place: "unknown",
  transfer_exception_used: "",
  transfer_exception_type: "",
  transfer_risk_assessment_completed: "unknown",
  large_scale_or_continuous_transfer: "unknown",
  uses_processor: "unknown",
  processor_agreement_in_place: "unknown",
  processor_compliance_verified: "unknown",
  subprocessor_or_onward_transfer_controls: "unknown",
  records_of_processing_exists: "unknown",
  dpo_required: "",
  dpo_assigned: "",
  processing_impact_assessment_completed: "unknown",
  encryption_at_rest: "",
  encryption_in_transit: "unknown",
  access_control_in_place: "unknown",
  breach_response_72h_ready: "unknown",
};

const gdprSteps = [
  {
    id: "context",
    title: "기본 정보",
    description: "어떤 데이터를 어디서 어디로 옮기는지부터 선택합니다.",
    fields: [
      { key: "dataset_name", label: "데이터셋", helper: "검토 대상 업무 데이터를 고르세요.", kind: "select", options: emptyFirst(datasetOptions, "데이터셋 선택"), required: true },
      { key: "data_type", label: "데이터 유형", helper: "데이터 성격을 고르세요.", kind: "select", options: emptyFirst(dataTypeOptions, "데이터 유형 선택"), required: true },
      { key: "data_subject_region", label: "정보주체 지역", helper: "국외이전 판단의 출발점입니다.", kind: "select", options: emptyFirst(gdprSubjectOptions, "정보주체 지역 선택"), required: true },
      { key: "current_region", label: "현재 리전", helper: "현재 저장 또는 처리 위치입니다.", kind: "select", options: emptyFirst(targetRegionOptions, "현재 리전 선택"), required: true },
      { key: "target_region", label: "대상 리전", helper: "이전 또는 복제 대상입니다.", kind: "select", options: emptyFirst(targetRegionOptions, "대상 리전 선택"), required: true }
    ]
  },
  {
    id: "lawfulness",
    title: "처리 근거와 데이터 성격",
    description: "왜 처리하는지, 민감정보인지, 최소화와 보관기준이 있는지 확인합니다.",
    fields: [
      { key: "lawful_basis", label: "적법 근거", helper: "GDPR 제6조 기준을 선택합니다.", kind: "select", options: emptyFirst(lawfulBasisOptions, "적법 근거 선택"), required: true },
      { key: "processing_purpose_defined", label: "처리 목적 정의", helper: "문서로 정리되어 있나요?", kind: "segmented", options: yesNoOptions, required: true },
      { key: "data_minimized", label: "데이터 최소화", helper: "필요 최소 범위만 이전하나요?", kind: "segmented", options: yesNoOptions, required: true },
      { key: "retention_period_defined", label: "보관기간 정의", helper: "삭제 또는 보존 주기가 있나요?", kind: "segmented", options: yesNoOptions, required: true },
      { key: "contains_sensitive_data", label: "민감정보 포함", helper: "건강정보 등 민감정보가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "special_category_condition_met", label: "민감정보 예외 요건", helper: "민감정보라면 제9조 예외 요건이 확인됐나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.contains_sensitive_data === "true" }
    ]
  },
  {
    id: "transfer",
    title: "이전 메커니즘",
    description: "외부 처리자, SCC/BCR, 위험평가, 예외 경로를 필요한 경우에만 묻습니다.",
    fields: [
      { key: "uses_processor", label: "외부 처리자 사용", helper: "벤더 또는 위탁처리가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "controller_processor_roles_defined", label: "역할 정의", helper: "컨트롤러/프로세서 역할이 문서화되어 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "dpa_in_place", label: "DPA 체결", helper: "수탁자 계약이 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "processor_sufficient_guarantees", label: "수탁자 보증 확인", helper: "보안/개인정보 보호 보증을 확인했나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "subprocessor_controls_in_place", label: "하위처리자 통제", helper: "재위탁 또는 재이전 통제가 계약에 반영됐나요?", tooltip: "벤더가 다시 다른 업체를 쓰는 경우 사전 승인, 통지, 감사권 조항을 주로 봅니다.", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "scc_in_place", label: "SCC 체결", helper: "표준계약조항이 있나요?", tooltip: "EU 밖 이전에서 가장 자주 보는 계약형 이전 메커니즘입니다.", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext },
      { key: "bcr_in_place", label: "BCR 보유", helper: "그룹 내부 이전용 BCR이 있나요?", tooltip: "같은 기업집단 내부 이전에서 쓰는 승인된 내부 규칙입니다.", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext },
      { key: "other_safeguards_in_place", label: "기타 보호조치", helper: "다른 제46조 보호조치가 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext },
      { key: "transfer_impact_assessment_completed", label: "이전 영향 평가", helper: "TIA를 완료했나요?", tooltip: "대상국 법·집행 환경과 계약 보호조치 실효성을 점검하는 문서입니다.", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext },
      { key: "supplemental_measures_documented", label: "보완조치 문서화", helper: "추가 보호조치가 정리되어 있나요?", tooltip: "암호화, 분리보관, 계약상 제한 같은 추가 통제를 뜻합니다.", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext },
      { key: "derogation_used", label: "예외 이전 사용", helper: "제49조 예외를 직접 쓰나요?", tooltip: "반복 운영보다는 예외적 상황에서만 좁게 쓰는 경로입니다.", kind: "segmented", options: yesNoOptions, required: true, visibleIf: isGdprCrossBorderContext },
      { key: "derogation_type", label: "예외 유형", helper: "예외 사용 시 세부 유형을 고르세요.", kind: "select", options: emptyFirst(derogationTypeOptions, "예외 유형 선택"), visibleIf: (state: GuidedFormState) => isGdprCrossBorderContext(state) && state.derogation_used === "true" }
    ]
  },
  {
    id: "controls",
    title: "보안과 문서",
    description: "실제 운영 통제와 고지·기록 상태를 마지막으로 정리합니다.",
    fields: [
      { key: "encryption_at_rest", label: "저장 시 암호화", helper: "필수 항목입니다.", kind: "segmented", options: yesNoOptions, required: true },
      { key: "encryption_in_transit", label: "전송 시 암호화", helper: "TLS 등이 적용되나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "access_control_in_place", label: "접근통제", helper: "접근권한 통제가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "incident_response_in_place", label: "침해 대응 절차", helper: "사고 대응 절차가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "breach_notification_ready_72h", label: "72시간 내 신고 준비", helper: "보고·판단·승인 흐름이 정리돼 있나요?", tooltip: "실제 사고가 났을 때 누가 언제 신고 판단을 하는지 정리된 상태를 뜻합니다.", kind: "segmented", options: yesNoUnknownOptions },
      { key: "privacy_notice_updated", label: "처리방침 최신화", helper: "고지 문구가 최신인가요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "transfer_disclosed_to_subject", label: "국외 이전 고지", helper: "정보주체에게 이전 사실을 알렸나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext },
      { key: "records_of_processing_exists", label: "ROPA 보유", helper: "처리 활동 기록부가 있나요?", tooltip: "누가 어떤 데이터를 왜 처리하는지 남기는 내부 기록입니다.", kind: "segmented", options: yesNoUnknownOptions },
      { key: "transfer_documented_in_ropa", label: "이전 사항 기록 반영", helper: "이전 경로가 기록에 반영됐나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isGdprCrossBorderContext }
    ]
  },
  {
    id: "governance",
    title: "권리와 책임성",
    description: "권리 대응, 프라이버시 설계, DPIA/DPO 같은 운영 책임성 항목을 확인합니다.",
    fields: [
      { key: "data_subject_rights_process_ready", label: "정보주체 권리 대응", helper: "열람·정정·삭제 요청 대응 절차가 있나요?", tooltip: "사업자가 실제 요청을 받았을 때 누가 무엇을 처리하는지 정리된 상태를 뜻합니다.", kind: "segmented", options: yesNoUnknownOptions },
      { key: "privacy_by_design_review_completed", label: "프라이버시 설계 검토", helper: "기본값 최소화·접근제한 검토를 했나요?", tooltip: "제품 설계 자체가 개인정보 최소화 원칙을 따르는지 보는 항목입니다.", kind: "segmented", options: yesNoUnknownOptions },
      { key: "dpia_required", label: "DPIA 필요 여부", helper: "고위험 처리라서 DPIA가 필요한가요?", tooltip: "민감정보, 대규모 처리, 고위험 설계면 예를 검토합니다.", kind: "segmented", options: yesNoOptions, required: true, visibleIf: needsGdprElevatedGovernanceQuestions },
      { key: "dpia_completed", label: "DPIA 완료", helper: "필요한 경우 실제로 완료했나요?", kind: "segmented", options: yesNoOptions, required: true, visibleIf: (state: GuidedFormState) => state.dpia_required === "true" },
      { key: "dpo_required", label: "DPO 지정 필요 여부", helper: "DPO가 필요한 시나리오인가요?", tooltip: "대규모 모니터링, 민감정보 대규모 처리 등에서는 필요할 수 있습니다.", kind: "segmented", options: yesNoOptions, required: true, visibleIf: needsGdprElevatedGovernanceQuestions },
      { key: "dpo_assigned", label: "DPO 지정 완료", helper: "필요한 경우 실제 지정했나요?", kind: "segmented", options: yesNoOptions, required: true, visibleIf: (state: GuidedFormState) => state.dpo_required === "true" }
    ]
  }
] as const;

const saudiSteps = [
  {
    id: "context",
    title: "기본 정보",
    description: "사우디와 어떤 연결성이 있고 데이터가 어디로 이동하는지 먼저 확인합니다.",
    fields: [
      { key: "dataset_name", label: "데이터셋", helper: "검토 대상 데이터를 고르세요.", kind: "select", options: emptyFirst(saudiDatasetOptions, "데이터셋 선택"), required: true },
      { key: "data_type", label: "데이터 유형", helper: "데이터 성격을 고르세요.", kind: "select", options: emptyFirst(dataTypeOptions, "데이터 유형 선택"), required: true },
      { key: "data_subject_connection", label: "사우디 연결성", helper: "사우디 거주자 또는 사우디 내 수집 데이터인지 고르세요.", kind: "select", options: emptyFirst(dataSubjectConnectionOptions, "사우디 연결성 선택"), required: true },
      { key: "current_region", label: "현재 위치", helper: "현재 저장 위치입니다.", kind: "select", options: emptyFirst(targetRegionOptions, "현재 위치 선택"), required: true },
      { key: "target_region", label: "대상 위치", helper: "이전 대상 위치입니다.", kind: "select", options: emptyFirst(targetRegionOptions, "대상 위치 선택"), required: true }
    ]
  },
  {
    id: "lawfulness",
    title: "처리 근거와 고지",
    description: "사우디 PDPL에서 중요하게 보는 처리 근거, 목적, 민감정보, 고지 상태를 정리합니다.",
    fields: [
      { key: "processing_legal_basis", label: "처리 근거", helper: "사우디 PDPL상 근거를 선택합니다.", kind: "select", options: emptyFirst(saudiLegalBasisOptions, "처리 근거 선택"), required: true },
      { key: "processing_purpose_defined", label: "처리 목적 정의", helper: "목적이 문서화되어 있나요?", kind: "segmented", options: yesNoOptions, required: true },
      { key: "data_minimized", label: "데이터 최소화", helper: "이전에 필요한 최소 범위인가요?", kind: "segmented", options: yesNoOptions, required: true },
      { key: "retention_period_defined", label: "보관·파기 주기", helper: "보관기간이나 파기 기준이 있나요?", kind: "segmented", options: yesNoOptions, required: true },
      { key: "contains_sensitive_data", label: "민감정보 포함", helper: "민감정보가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "explicit_consent_for_sensitive_data", label: "민감정보 명시적 동의", helper: "민감정보를 동의 기반으로 처리한다면 명시적 동의가 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.contains_sensitive_data === "true" && state.processing_legal_basis === "consent" },
      { key: "privacy_policy_available", label: "개인정보 처리방침", helper: "서비스 기준 처리방침이 준비되어 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "data_subject_rights_request_ready", label: "권리 요청 대응", helper: "열람·정정·삭제 요청 대응 절차가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "consent_withdrawal_process_ready", label: "동의 철회 대응", helper: "동의 기반 처리라면 철회 경로가 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.processing_legal_basis === "consent" },
      { key: "data_accuracy_review_completed", label: "정확성·최신성 점검", helper: "정정·업데이트 반영 절차를 점검했나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "privacy_notice_available", label: "개인정보 고지 제공", helper: "기본 고지 문구가 정리돼 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "cross_border_notice_provided", label: "국외이전 안내", helper: "국외이전 안내가 준비되어 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isSaudiCrossBorderContext }
    ]
  },
  {
    id: "transfer",
    title: "국외이전 경로",
    description: "적정 보호 수준, 승인된 보호조치, 예외 경로, 위험평가 여부를 순서대로 확인합니다.",
    fields: [
      { key: "adequate_protection_confirmed", label: "적정 보호 수준 확인", helper: "대상국 보호수준이 공식적으로 확인됐나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isSaudiCrossBorderContext },
      { key: "binding_common_rules_approved", label: "승인된 공통구속규칙", helper: "BCR 성격의 승인된 규칙이 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isSaudiCrossBorderContext },
      { key: "standard_contractual_clauses_in_place", label: "표준계약조항", helper: "사우디 기준 표준계약조항이 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isSaudiCrossBorderContext },
      { key: "certification_or_code_in_place", label: "인증/행동강령 보호조치", helper: "인증이나 승인된 행동강령이 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isSaudiCrossBorderContext },
      { key: "transfer_exception_used", label: "예외 경로 사용", helper: "보호조치 대신 예외 경로를 사용하나요?", kind: "segmented", options: yesNoOptions, required: true, visibleIf: isSaudiCrossBorderContext },
      { key: "transfer_exception_type", label: "예외 유형", helper: "예외 사용 시 세부 유형을 고르세요.", kind: "select", options: emptyFirst(saudiTransferExceptionTypeOptions, "예외 유형 선택"), visibleIf: (state: GuidedFormState) => isSaudiCrossBorderContext(state) && state.transfer_exception_used === "true" },
      { key: "large_scale_or_continuous_transfer", label: "대규모/지속적 이전", helper: "특히 민감정보를 계속 이전하나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "transfer_risk_assessment_completed", label: "국외이전 위험평가 완료", helper: "위험평가를 완료했나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: isSaudiCrossBorderContext }
    ]
  },
  {
    id: "controls",
    title: "수탁자와 운영 통제",
    description: "프로세서 검증, 기록, DPO, 보안과 브리치 대응 상태를 마지막으로 확인합니다.",
    fields: [
      { key: "uses_processor", label: "외부 처리자 사용", helper: "벤더 또는 위탁처리가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "processor_agreement_in_place", label: "프로세서 계약", helper: "계약 또는 서면 조건이 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "processor_compliance_verified", label: "프로세서 준수 검증", helper: "실사나 검증을 했나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "subprocessor_or_onward_transfer_controls", label: "재이전/하위처리자 통제", helper: "하위처리자와 재이전 통제가 있나요?", kind: "segmented", options: yesNoUnknownOptions, visibleIf: (state: GuidedFormState) => state.uses_processor === "true" },
      { key: "encryption_at_rest", label: "저장 시 암호화", helper: "필수 항목입니다.", kind: "segmented", options: yesNoOptions, required: true },
      { key: "encryption_in_transit", label: "전송 시 암호화", helper: "TLS 등이 적용되나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "access_control_in_place", label: "접근통제", helper: "접근권한 통제가 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "breach_response_72h_ready", label: "72시간 내 브리치 대응 준비", helper: "사고 대응과 통지 체계가 있나요?", kind: "segmented", options: yesNoUnknownOptions }
    ]
  },
  {
    id: "governance",
    title: "책임성과 내부 검토",
    description: "기록, 영향평가, DPO 필요성 같은 내부 책임성 항목을 정리합니다.",
    fields: [
      { key: "records_of_processing_exists", label: "처리 기록 보유", helper: "처리 활동 기록이 있나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "processing_impact_assessment_completed", label: "내부 영향 검토", helper: "내부 평가나 영향 검토를 했나요?", kind: "segmented", options: yesNoUnknownOptions },
      { key: "dpo_required", label: "DPO 지정 필요", helper: "공식 기준상 DPO가 필요한가요?", tooltip: "민감정보나 대규모 처리라면 공식 기준에 따라 먼저 판단하는 편이 좋습니다.", kind: "segmented", options: yesNoOptions, required: true, visibleIf: (state: GuidedFormState) => state.contains_sensitive_data === "true" || state.large_scale_or_continuous_transfer === "true" },
      { key: "dpo_assigned", label: "DPO 지정 완료", helper: "필요한 경우 실제 지정했나요?", kind: "segmented", options: yesNoOptions, required: true, visibleIf: (state: GuidedFormState) => state.dpo_required === "true" }
    ]
  }
] as const;

export const PACK_UI_DEFINITIONS: Record<string, PackUiDefinition> = {
  gdpr: {
    id: "gdpr",
    label: "EU GDPR",
    subtitle: "EU/EEA 국외이전 평가",
    storageKey: "border-checker-guided-gdpr-v2",
    steps: gdprSteps as unknown as PackUiDefinition["steps"],
    defaultState: gdprDefaultState,
    validate: (state) => {
      const missing = gdprSteps.flatMap((step) =>
        missingVisibleRequired(step.fields, state),
      );
      if (
        isGdprCrossBorderContext(state)
        && state.derogation_used === "true"
        && !state.derogation_type
      ) {
        missing.push("예외 유형");
      }
      return missing;
    },
    buildPayload: (state) => {
      const crossBorder = isGdprCrossBorderContext(state);
      return {
        aws_data: {
          current_region: state.current_region,
          encryption_at_rest: toRequiredBoolean(state.encryption_at_rest, "저장 시 암호화"),
          data_type: state.data_type,
          contains_sensitive_data: toNullableBoolean(state.contains_sensitive_data),
          uses_processor: toNullableBoolean(state.uses_processor),
          encryption_in_transit: toNullableBoolean(state.encryption_in_transit),
          access_control_in_place: toNullableBoolean(state.access_control_in_place)
        },
        policy_data: {
          dataset_name: state.dataset_name,
          data_subject_region: state.data_subject_region,
          processing_purpose_defined: toRequiredBoolean(state.processing_purpose_defined, "처리 목적 정의"),
          data_minimized: toRequiredBoolean(state.data_minimized, "데이터 최소화"),
          retention_period_defined: toRequiredBoolean(state.retention_period_defined, "보관기간 정의"),
          lawful_basis: state.lawful_basis || null,
          special_category_condition_met: toNullableBoolean(state.special_category_condition_met),
          target_region: state.target_region,
          controller_processor_roles_defined: toNullableBoolean(state.controller_processor_roles_defined),
          dpa_in_place: toNullableBoolean(state.dpa_in_place),
          processor_sufficient_guarantees: toNullableBoolean(state.processor_sufficient_guarantees),
          subprocessor_controls_in_place: toNullableBoolean(state.subprocessor_controls_in_place),
          scc_in_place: toNullableBoolean(state.scc_in_place),
          bcr_in_place: toNullableBoolean(state.bcr_in_place),
          other_safeguards_in_place: toNullableBoolean(state.other_safeguards_in_place),
          transfer_impact_assessment_completed: toNullableBoolean(state.transfer_impact_assessment_completed),
          supplemental_measures_documented: toNullableBoolean(state.supplemental_measures_documented),
          incident_response_in_place: toNullableBoolean(state.incident_response_in_place),
          breach_notification_ready_72h: toNullableBoolean(state.breach_notification_ready_72h),
          derogation_used: crossBorder
            ? toRequiredBoolean(state.derogation_used, "예외 이전 사용")
            : false,
          derogation_type:
            crossBorder && state.derogation_used === "true"
              ? state.derogation_type || null
              : null,
          privacy_notice_updated: toNullableBoolean(state.privacy_notice_updated),
          transfer_disclosed_to_subject: toNullableBoolean(state.transfer_disclosed_to_subject),
          records_of_processing_exists: toNullableBoolean(state.records_of_processing_exists),
          transfer_documented_in_ropa: toNullableBoolean(state.transfer_documented_in_ropa),
          data_subject_rights_process_ready: toNullableBoolean(state.data_subject_rights_process_ready),
          privacy_by_design_review_completed: toNullableBoolean(state.privacy_by_design_review_completed),
          dpia_required: state.dpia_required ? toRequiredBoolean(state.dpia_required, "DPIA 필요 여부") : null,
          dpia_completed:
            state.dpia_required === "true" && state.dpia_completed
              ? toRequiredBoolean(state.dpia_completed, "DPIA 완료")
              : null,
          dpo_required: state.dpo_required ? toRequiredBoolean(state.dpo_required, "DPO 지정 필요 여부") : null,
          dpo_assigned:
            state.dpo_required === "true" && state.dpo_assigned
              ? toRequiredBoolean(state.dpo_assigned, "DPO 지정 완료")
              : null
        }
      };
    },
    buildAdvisoryNotes: (state) => {
      const notes: string[] = [];
      if (!isGdprCrossBorderContext(state) && state.target_region) {
        notes.push("대상 리전이 EU/EEA 안이면 이전 메커니즘 질문 일부를 자동으로 줄였습니다.");
      }
      if (isGdprCrossBorderContext(state)) {
        notes.push("EU/EEA 밖 이전으로 보여 SCC/BCR/TIA 같은 이전 장치 질문을 함께 확인합니다.");
      }
      if (state.contains_sensitive_data === "true") {
        notes.push("민감정보라면 제9조 예외 요건, 보완조치, DPIA 문서를 함께 챙기는 편이 안전합니다.");
      }
      if (state.uses_processor === "true") {
        notes.push("외부 처리자를 쓰면 역할 정의, DPA, 하위처리자 통제부터 잡는 것이 가장 효과적입니다.");
      }
      if (needsGdprElevatedGovernanceQuestions(state)) {
        notes.push("이번 시나리오는 고위험 가능성이 있어 DPIA와 DPO 필요 여부 질문을 함께 확인합니다.");
      }
      return notes.length > 0 ? notes : ["현재는 비교적 단순한 GDPR 처리 또는 역내 이전 시나리오로 볼 수 있습니다."];
    },
    buildSummaryRows: (state) => [
      { label: "데이터셋", value: getOptionLabel(datasetOptions, state.dataset_name) },
      { label: "리전 흐름", value: state.current_region && state.target_region ? `${state.current_region} -> ${state.target_region}` : "미선택" },
      { label: "적법 근거", value: getOptionLabel(lawfulBasisOptions, state.lawful_basis) },
      { label: "민감정보", value: state.contains_sensitive_data === "true" ? "포함" : state.contains_sensitive_data === "false" ? "미포함" : "미확인" }
    ]
  },
  saudi_pdpl: {
    id: "saudi_pdpl",
    label: "Saudi PDPL",
    subtitle: "사우디 국외이전 평가",
    storageKey: "border-checker-guided-saudi-v2",
    steps: saudiSteps as unknown as PackUiDefinition["steps"],
    defaultState: saudiDefaultState,
    validate: (state) => {
      const missing = saudiSteps.flatMap((step) =>
        missingVisibleRequired(step.fields, state),
      );
      if (
        isSaudiCrossBorderContext(state)
        && state.transfer_exception_used === "true"
        && !state.transfer_exception_type
      ) {
        missing.push("예외 유형");
      }
      return missing;
    },
    buildPayload: (state) => {
      const crossBorder = isSaudiCrossBorderContext(state);
      return {
        aws_data: {
          current_region: state.current_region,
          encryption_at_rest: toRequiredBoolean(state.encryption_at_rest, "저장 시 암호화"),
          data_type: state.data_type,
          contains_sensitive_data: toNullableBoolean(state.contains_sensitive_data),
          uses_processor: toNullableBoolean(state.uses_processor),
          encryption_in_transit: toNullableBoolean(state.encryption_in_transit),
          access_control_in_place: toNullableBoolean(state.access_control_in_place)
        },
        policy_data: {
          dataset_name: state.dataset_name,
          data_subject_connection: state.data_subject_connection,
          processing_purpose_defined: toRequiredBoolean(state.processing_purpose_defined, "처리 목적 정의"),
          data_minimized: toRequiredBoolean(state.data_minimized, "데이터 최소화"),
          retention_period_defined: toRequiredBoolean(state.retention_period_defined, "보관·파기 주기"),
          processing_legal_basis: state.processing_legal_basis || null,
          explicit_consent_for_sensitive_data: toNullableBoolean(state.explicit_consent_for_sensitive_data),
          privacy_policy_available: toNullableBoolean(state.privacy_policy_available),
          data_subject_rights_request_ready: toNullableBoolean(state.data_subject_rights_request_ready),
          consent_withdrawal_process_ready: toNullableBoolean(state.consent_withdrawal_process_ready),
          data_accuracy_review_completed: toNullableBoolean(state.data_accuracy_review_completed),
          privacy_notice_available: toNullableBoolean(state.privacy_notice_available),
          cross_border_notice_provided: toNullableBoolean(state.cross_border_notice_provided),
          target_region: state.target_region,
          adequate_protection_confirmed: toNullableBoolean(state.adequate_protection_confirmed),
          binding_common_rules_approved: toNullableBoolean(state.binding_common_rules_approved),
          standard_contractual_clauses_in_place: toNullableBoolean(state.standard_contractual_clauses_in_place),
          certification_or_code_in_place: toNullableBoolean(state.certification_or_code_in_place),
          transfer_exception_used: crossBorder
            ? toRequiredBoolean(state.transfer_exception_used, "예외 경로 사용")
            : false,
          transfer_exception_type:
            crossBorder && state.transfer_exception_used === "true"
              ? state.transfer_exception_type || null
              : null,
          transfer_risk_assessment_completed: toNullableBoolean(state.transfer_risk_assessment_completed),
          large_scale_or_continuous_transfer: toNullableBoolean(state.large_scale_or_continuous_transfer),
          processor_agreement_in_place: toNullableBoolean(state.processor_agreement_in_place),
          processor_compliance_verified: toNullableBoolean(state.processor_compliance_verified),
          subprocessor_or_onward_transfer_controls: toNullableBoolean(state.subprocessor_or_onward_transfer_controls),
          records_of_processing_exists: toNullableBoolean(state.records_of_processing_exists),
          dpo_required: state.dpo_required ? toRequiredBoolean(state.dpo_required, "DPO 지정 필요") : null,
          dpo_assigned:
            state.dpo_required === "true" && state.dpo_assigned
              ? toRequiredBoolean(state.dpo_assigned, "DPO 지정 완료")
              : null,
          processing_impact_assessment_completed: toNullableBoolean(state.processing_impact_assessment_completed),
          breach_response_72h_ready: toNullableBoolean(state.breach_response_72h_ready)
        }
      };
    },
    buildAdvisoryNotes: (state) => {
      const notes: string[] = [];
      if (!isSaudiCrossBorderContext(state) && state.target_region) {
        notes.push("대상 위치가 사우디 안이면 국외이전 경로 질문 일부를 자동으로 줄였습니다.");
      }
      if (isSaudiCrossBorderContext(state)) {
        notes.push("사우디 밖으로 이전하는 경우 적정 보호 수준, 승인된 보호조치, 예외 경로 중 무엇을 쓰는지 분명해야 합니다.");
      }
      if (state.contains_sensitive_data === "true") {
        notes.push("민감정보가 있으면 명시적 동의, 위험평가, DPO 필요성 검토를 같이 보는 편이 좋습니다.");
      }
      if (state.uses_processor === "true") {
        notes.push("사우디 팩에서는 프로세서 계약과 준수 검증, 재이전 통제를 함께 확인하는 것이 중요합니다.");
      }
      if (state.processing_legal_basis === "consent") {
        notes.push("동의 기반 처리라면 동의 철회 경로와 관련 고지 문구까지 같이 정리해 두는 편이 좋습니다.");
      }
      return notes.length > 0 ? notes : ["현재는 사우디 내 처리 또는 비교적 단순한 이전 시나리오로 보입니다."];
    },
    buildSummaryRows: (state) => [
      { label: "데이터셋", value: getOptionLabel(saudiDatasetOptions, state.dataset_name) },
      { label: "사우디 연결성", value: getOptionLabel(dataSubjectConnectionOptions, state.data_subject_connection) },
      { label: "위치 흐름", value: state.current_region && state.target_region ? `${state.current_region} -> ${state.target_region}` : "미선택" },
      { label: "처리 근거", value: getOptionLabel(saudiLegalBasisOptions, state.processing_legal_basis) }
    ]
  }
};
