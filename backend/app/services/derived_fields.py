from typing import Any, Dict

from app.core.constants import (
    AWS_REGION_TO_COUNTRY,
    EU_ADEQUACY_COUNTRIES,
    EU_EEA_COUNTRIES,
)


def derive_target_country(target_region: str | None) -> str | None:
    if not target_region:
        return None
    return AWS_REGION_TO_COUNTRY.get(target_region)


def derive_adequacy_decision_exists(target_country: str | None) -> bool:
    if not target_country:
        return False
    return target_country in EU_ADEQUACY_COUNTRIES or target_country in EU_EEA_COUNTRIES


def derive_is_third_country_transfer(
    data_subject_region: str | None,
    target_country: str | None,
) -> bool:
    if data_subject_region not in {"EU", "EEA"}:
        return False

    if not target_country:
        return False

    return target_country not in EU_EEA_COUNTRIES


def derive_transfer_safeguards_available(merged_data: Dict[str, Any]) -> bool:
    return any(
        merged_data.get(field) is True
        for field in ("scc_in_place", "bcr_in_place", "other_safeguards_in_place")
    )


def derive_baseline_security_controls_ready(merged_data: Dict[str, Any]) -> bool:
    return all(
        merged_data.get(field) is True
        for field in (
            "encryption_at_rest",
            "encryption_in_transit",
            "access_control_in_place",
        )
    )


def derive_saudi_transfer_outside_kingdom(target_country: str | None) -> bool:
    if not target_country:
        return False
    return target_country != "SA"


def derive_saudi_appropriate_safeguards_available(merged_data: Dict[str, Any]) -> bool:
    return any(
        merged_data.get(field) is True
        for field in (
            "binding_common_rules_approved",
            "standard_contractual_clauses_in_place",
            "certification_or_code_in_place",
        )
    )


def derive_saudi_transfer_risk_assessment_required(
    merged_data: Dict[str, Any],
    transfer_outside_kingdom: bool,
    appropriate_safeguards_available: bool,
) -> bool:
    if not transfer_outside_kingdom:
        return False

    if appropriate_safeguards_available:
        return True

    if merged_data.get("transfer_exception_used") is True:
        return True

    return (
        merged_data.get("contains_sensitive_data") is True
        and merged_data.get("large_scale_or_continuous_transfer") is True
    )


def build_gdpr_derived_fields(merged_data: Dict[str, Any]) -> Dict[str, Any]:
    target_region = merged_data.get("target_region")
    data_subject_region = merged_data.get("data_subject_region")

    target_country = derive_target_country(target_region)
    adequacy_decision_exists = derive_adequacy_decision_exists(target_country)
    is_third_country_transfer = derive_is_third_country_transfer(
        data_subject_region=data_subject_region,
        target_country=target_country,
    )
    transfer_safeguards_available = derive_transfer_safeguards_available(merged_data)
    baseline_security_controls_ready = derive_baseline_security_controls_ready(
        merged_data
    )

    return {
        "target_country": target_country,
        "target_country_known": target_country is not None,
        "adequacy_decision_exists": adequacy_decision_exists,
        "is_third_country_transfer": is_third_country_transfer,
        "transfer_safeguards_available": transfer_safeguards_available,
        "baseline_security_controls_ready": baseline_security_controls_ready,
    }


def build_saudi_pdpl_derived_fields(merged_data: Dict[str, Any]) -> Dict[str, Any]:
    target_region = merged_data.get("target_region")
    target_country = derive_target_country(target_region)
    transfer_outside_kingdom = derive_saudi_transfer_outside_kingdom(target_country)
    appropriate_safeguards_available = derive_saudi_appropriate_safeguards_available(
        merged_data
    )
    baseline_security_controls_ready = derive_baseline_security_controls_ready(
        merged_data
    )
    transfer_risk_assessment_required = derive_saudi_transfer_risk_assessment_required(
        merged_data=merged_data,
        transfer_outside_kingdom=transfer_outside_kingdom,
        appropriate_safeguards_available=appropriate_safeguards_available,
    )

    return {
        "target_country": target_country,
        "target_country_known": target_country is not None,
        "transfer_outside_kingdom": transfer_outside_kingdom,
        "appropriate_safeguards_available": appropriate_safeguards_available,
        "baseline_security_controls_ready": baseline_security_controls_ready,
        "transfer_risk_assessment_required": transfer_risk_assessment_required,
    }


def build_derived_fields(
    merged_data: Dict[str, Any],
    schema: Dict[str, Any],
) -> Dict[str, Any]:
    schema_id = str(schema.get("schema_id", "")).lower()

    if schema_id.startswith("saudi_pdpl"):
        return build_saudi_pdpl_derived_fields(merged_data)

    return build_gdpr_derived_fields(merged_data)
