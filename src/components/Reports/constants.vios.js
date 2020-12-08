export const VIOLATION_WITH_DATA_TYPE_OBJECT="vio:ViolationWithDatatypeObject" //expecting integer datatype but entering string
export const VIOLATION_UNTYPED_INSTANCE="vio:UntypedInstance" // trying to add extra property with false value
export const VIOLATION_WOQL_SYNTAX_ERROR="woql_syntax_error" // syntax error
export const VIOLATION_DATA_TYPE_SUBSUMPTION="vio:DataTypeSubsumptionViolation" //changing datatype of property in schema eg: while updating document changing label type to integer
export const VIOLATION_KEY_HAS_UNKNOWN_PREFIX="key_has_unknown_prefix" // removing id  of a choices
export const VIOLATION_INVALID_CLASS_VIOLATION = "vio:InvalidClassViolation" //when adding triple to a class that dont exist
export const VIOLATION_PROPERTY_WITH_UNDEFINED_DOMAIN="vio:PropertyWithUndefinedDomain" 

export const WITNESS_TYPE="@type"
export const WITNESS_PROPERTY="vio:property"
export const WITNESS_CLASS="vio:class"
export const WITNESS_BASE_TYPE="vio:base_type"
export const WITNESS_LITERAL="vio:literal"
export const WITNESS_MESSAGE="vio:message"
export const WITNESS_SUBJECT="vio:subject"
export const WITNESS_PARENT_TYPE="vio:parent_type"
