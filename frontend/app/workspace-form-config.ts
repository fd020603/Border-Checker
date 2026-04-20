import type { FieldOption, FormState } from "./workspace-types";

export const STORAGE_KEY = "border-checker-form-v2";

export const emptyOption: FieldOption = {
  value: "",
  label: "선택",
};

export const datasetOptions: FieldOption[] = [
  { value: "eu_customer_profiles", label: "EU 고객 프로필 데이터" },
  { value: "eu_marketing_events", label: "EU 마케팅 이벤트 데이터" },
  { value: "eu_support_tickets", label: "EU 고객지원 티켓 데이터" },
  { value: "eu_hr_records", label: "EU 인사 기록 데이터" },
  { value: "eu_health_support_cases", label: "EU 건강·민감 케이스 데이터" },
];

export const dataTypeOptions: FieldOption[] = [
  { value: "customer_profiles", label: "고객 프로필" },
  { value: "analytics_events", label: "분석 이벤트" },
  { value: "support_tickets", label: "지원 티켓" },
  { value: "hr_records", label: "인사 기록" },
  { value: "health_support_cases", label: "건강·민감 케이스" },
  { value: "payment_operations", label: "결제 운영 데이터" },
];

export const subjectRegionOptions: FieldOption[] = [
  { value: "EU", label: "EU" },
  { value: "EEA", label: "EEA" },
  { value: "UK", label: "UK" },
  { value: "OTHER", label: "기타" },
];

export const euRegionOptions: FieldOption[] = [
  { value: "eu-central-1", label: "Frankfurt · eu-central-1" },
  { value: "eu-west-1", label: "Ireland · eu-west-1" },
  { value: "eu-west-3", label: "Paris · eu-west-3" },
  { value: "eu-north-1", label: "Stockholm · eu-north-1" },
];

export const targetRegionOptions: FieldOption[] = [
  { value: "sa-riyadh-dc", label: "Riyadh DC · sa-riyadh-dc" },
  { value: "sa-jeddah-dc", label: "Jeddah DC · sa-jeddah-dc" },
  { value: "sa-dammam-dc", label: "Dammam DC · sa-dammam-dc" },
  ...euRegionOptions,
  { value: "eu-west-2", label: "London · eu-west-2" },
  { value: "ap-northeast-2", label: "Seoul · ap-northeast-2" },
  { value: "ap-northeast-1", label: "Tokyo · ap-northeast-1" },
  { value: "us-east-1", label: "N. Virginia · us-east-1" },
  { value: "us-west-2", label: "Oregon · us-west-2" },
  { value: "ap-southeast-1", label: "Singapore · ap-southeast-1" },
  { value: "ca-central-1", label: "Canada · ca-central-1" },
];

export const lawfulBasisOptions: FieldOption[] = [
  { value: "consent", label: "동의" },
  { value: "contract", label: "계약 이행" },
  { value: "legal_obligation", label: "법적 의무" },
  { value: "vital_interest", label: "중대한 이익" },
  { value: "public_task", label: "공적 업무" },
  { value: "legitimate_interest", label: "정당한 이익" },
];

export const derogationTypeOptions: FieldOption[] = [
  { value: "explicit_consent", label: "명시적 동의" },
  { value: "contract_necessity", label: "계약상 필요" },
  { value: "public_interest", label: "중대한 공익" },
  { value: "legal_claims", label: "법적 청구 대응" },
  { value: "vital_interests", label: "중대한 이익 보호" },
];

export const binaryOptions: FieldOption[] = [
  { value: "true", label: "예" },
  { value: "false", label: "아니오" },
];

export const triStateOptions: FieldOption[] = [
  { value: "true", label: "예" },
  { value: "false", label: "아니오" },
  { value: "unknown", label: "미확인" },
];

export const defaultFormState: FormState = {
  dataset_name: "",
  data_type: "",
  data_subject_region: "",
  current_region: "",
  target_region: "",
  processing_purpose_defined: "",
  data_minimized: "",
  retention_period_defined: "",
  lawful_basis: "",
  contains_sensitive_data: "unknown",
  special_category_condition_met: "unknown",
  uses_processor: "unknown",
  controller_processor_roles_defined: "unknown",
  dpa_in_place: "unknown",
  processor_sufficient_guarantees: "unknown",
  scc_in_place: "unknown",
  bcr_in_place: "unknown",
  other_safeguards_in_place: "unknown",
  transfer_impact_assessment_completed: "unknown",
  supplemental_measures_documented: "unknown",
  encryption_at_rest: "",
  encryption_in_transit: "unknown",
  access_control_in_place: "unknown",
  incident_response_in_place: "unknown",
  derogation_used: "",
  derogation_type: "",
  privacy_notice_updated: "unknown",
  transfer_disclosed_to_subject: "unknown",
  records_of_processing_exists: "unknown",
  transfer_documented_in_ropa: "unknown",
};

export const requiredFormKeys: Array<keyof FormState> = [
  "dataset_name",
  "data_type",
  "data_subject_region",
  "current_region",
  "target_region",
  "processing_purpose_defined",
  "data_minimized",
  "retention_period_defined",
  "lawful_basis",
  "encryption_at_rest",
  "derogation_used",
];

export const formKeyLabels: Record<keyof FormState, string> = {
  dataset_name: "데이터셋",
  data_type: "데이터 유형",
  data_subject_region: "정보주체 지역",
  current_region: "현재 리전",
  target_region: "대상 리전",
  processing_purpose_defined: "처리 목적 정의",
  data_minimized: "데이터 최소화",
  retention_period_defined: "보관기간 정의",
  lawful_basis: "적법 근거",
  contains_sensitive_data: "민감정보 포함",
  special_category_condition_met: "제9조 예외 요건",
  uses_processor: "외부 처리자 사용",
  controller_processor_roles_defined: "역할 정의",
  dpa_in_place: "DPA 체결",
  processor_sufficient_guarantees: "수탁자 충분한 보증",
  scc_in_place: "SCC 체결",
  bcr_in_place: "BCR 보유",
  other_safeguards_in_place: "기타 보호조치",
  transfer_impact_assessment_completed: "이전 영향 평가",
  supplemental_measures_documented: "보완조치 문서화",
  encryption_at_rest: "저장 시 암호화",
  encryption_in_transit: "전송 시 암호화",
  access_control_in_place: "접근통제",
  incident_response_in_place: "침해 대응 절차",
  derogation_used: "제49조 예외 사용",
  derogation_type: "예외 유형",
  privacy_notice_updated: "처리방침 최신화",
  transfer_disclosed_to_subject: "국외 이전 고지",
  records_of_processing_exists: "ROPA 보유",
  transfer_documented_in_ropa: "이전 사항 ROPA 반영",
};
