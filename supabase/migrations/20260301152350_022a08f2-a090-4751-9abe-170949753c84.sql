
-- Create subscription on Essencial plan (max 2 professionals) for test clinic
INSERT INTO subscriptions (clinic_id, plan_id, status, current_period_start, current_period_end)
VALUES (
  'a5dbeed7-d13c-40eb-bda4-6ecfc95dd618',
  '0002c4b2-c2ac-412c-ad23-8511c2bd1d54',
  'trial',
  now(),
  now() + interval '30 days'
);

-- Create 2 active team members to hit the limit
INSERT INTO team_members (clinic_id, profile_id, is_active)
VALUES 
  ('a5dbeed7-d13c-40eb-bda4-6ecfc95dd618', '1d377733-5a15-4b87-9e20-452993c91af1', true),
  ('a5dbeed7-d13c-40eb-bda4-6ecfc95dd618', NULL, true);

-- Create an active invite
INSERT INTO clinic_invites (clinic_id, created_by, role, is_active, invite_code)
VALUES (
  'a5dbeed7-d13c-40eb-bda4-6ecfc95dd618',
  '1d377733-5a15-4b87-9e20-452993c91af1',
  'staff',
  true,
  'test_invite_limit_check'
);
