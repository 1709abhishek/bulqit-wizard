CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  services TEXT[] NOT NULL DEFAULT '{}',
  future_services TEXT[] NOT NULL DEFAULT '{}',

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  UNIQUE (email, address)
);

-- Indexes to help queries later
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON survey_responses (email); 