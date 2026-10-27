/* ============================================================
   联系方式识别与脱敏（纯函数，客户端 / 服务端都能用）
   - 购买弹窗允许填「手机号或微信」，只有手机与邮箱是结构化可校验的
   - 后台列表 / 邮件通知里展示时用 maskContact 脱敏
   ============================================================ */

export type ContactKind = "phone" | "email" | "unknown";

export interface ContactInfo {
  kind: ContactKind;
  value: string;
}

const PHONE_RE = /^1[3-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseContact(raw: string): ContactInfo {
  const v = (raw ?? "").trim();
  if (PHONE_RE.test(v)) return { kind: "phone", value: v };
  if (EMAIL_RE.test(v)) return { kind: "email", value: v.toLowerCase() };
  return { kind: "unknown", value: v };
}

/** 手机 / 邮箱才算结构化联系方式（微信只有字符串，无法自动核身） */
export function isStructuredContact(raw: string): boolean {
  return parseContact(raw).kind !== "unknown";
}

/** 脱敏：138****8888 / a***@qq.com */
export function maskContact(raw: string): string {
  const { kind, value } = parseContact(raw);
  if (kind === "phone") return `${value.slice(0, 3)}****${value.slice(7)}`;
  if (kind === "email") {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 1)}***@${domain}`;
  }
  return value ? `${value.slice(0, 2)}***` : "—";
}
