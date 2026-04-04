-- Bloom Database Schema for Supabase
-- Applied via MCP migrations; keep in sync with production.

-- See migrations: bloom_core_schema_v1, bloom_rls_and_kiosk_rpc

-- Tables: shelters, profiles, sessions, activity_logs, flowers, gratitude_notes,
--         kiosk_anonymous_events (anonymous / unmatched kiosk completions)

-- RPC: log_shelter_activity(p_identifier, p_quadrant, p_activity_type, ...)
--      Empty or unknown identifier → kiosk_anonymous_events; known unique_code or display_name → activity_logs (+ optional flower)
