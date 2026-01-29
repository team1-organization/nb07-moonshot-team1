/**
 * 문자열이 비었는지 확인
 * null, undefined, "", "   " 모두 빈 값으로 처리
 */
export function isEmpty(value: string | null | undefined): value is null | undefined | '' {
  return value === null || value === undefined || value.trim().length === 0;
}

/**
 * 문자열이 존재하면 공백을 제거해서 반환하고,
 * 비어있으면 null 반환
 */
export function normalizeString(value: string | null | undefined): string | null {
  return isEmpty(value) ? null : value.trim();
}

/**
 * a가 비었을 경우 b 반환 (fallback 기능)
 * - author가 비었으면 nickname 사용 등
 */
export function fallback(a: string | null | undefined, b: string): string {
  return isEmpty(a) ? b : a;
}

/**
 * undefined/null이면 기본값 반환
 */
export function defaultValue<T>(value: T | null | undefined, defaultVal: T): T {
  return value === null || value === undefined ? defaultVal : value;
}

/**
 * 안전한 문자열 변환기
 * - null/undefined → ""
 * - 숫자/boolean → 문자열로 변환
 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}
