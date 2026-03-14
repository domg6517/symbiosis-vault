import { createServerClient } from "./supabase";

/**
 * Log a security/audit event for admin review.
 * Fire-and-forget — never blocks the main request.
 *
 * @param {string} eventType - e.g. "account_deleted", "login_failed", "card_linked", "export_requested"
 * @param {object} details - { user_id, ip, email, metadata }
 */
export async function logAuditEvent(eventType, details = {}) {
  try {
    const supabase = createServerClient();
    await supabase.from("audit_log").insert({
      event_type: eventType,
      user_id: details.user_id || null,
      ip_address: details.ip || null,
      email: details.email || null,
      metadata: details.metadata || null,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    // Never throw — audit logging should not break main flows
    console.error("Audit log error:", e);
  }
}
