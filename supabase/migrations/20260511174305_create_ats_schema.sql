/*
  # Multi-Branch ATS Schema

  1. New Tables
    - `profiles` - Candidate/HR user profiles linked to auth.users
    - `branches` - Company branches (Islamabad, Lahore, Karachi, Remote)
    - `jobs` - Job postings with branch, department, seats
    - `applications` - Candidate job applications with status tracking
    - `interviews` - Interview schedule for shortlisted candidates

  2. Security
    - RLS enabled on all tables
    - Candidates can read public jobs, manage own applications/profile
    - HR/Admin can manage jobs, applications, interviews
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'candidate', -- 'candidate' | 'hr' | 'admin'
  headline text DEFAULT '',
  bio text DEFAULT '',
  location text DEFAULT '',
  linkedin_url text DEFAULT '',
  portfolio_url text DEFAULT '',
  resume_url text DEFAULT '',
  cover_letter_url text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "HR and admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role IN ('hr', 'admin')
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  city text NOT NULL DEFAULT '',
  address text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active branches"
  ON branches FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can insert branches"
  ON branches FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "Admin can update branches"
  ON branches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "Admin can delete branches"
  ON branches FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL DEFAULT '',
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  description text DEFAULT '',
  requirements text DEFAULT '',
  employment_type text DEFAULT 'full-time', -- full-time, part-time, contract, internship
  experience_level text DEFAULT 'mid', -- entry, mid, senior, lead
  salary_min integer DEFAULT 0,
  salary_max integer DEFAULT 0,
  salary_currency text DEFAULT 'PKR',
  available_seats integer DEFAULT 1,
  filled_seats integer DEFAULT 0,
  is_active boolean DEFAULT true,
  deadline timestamptz,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (is_active = true);

CREATE POLICY "HR can view all jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can delete jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'submitted', -- submitted, under_review, shortlisted, interview_scheduled, rejected, selected
  resume_url text DEFAULT '',
  cover_letter_url text DEFAULT '',
  cover_note text DEFAULT '',
  hr_notes text DEFAULT '',
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid());

CREATE POLICY "HR can view all applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "Candidates can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "HR can update applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "Candidates can delete own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (candidate_id = auth.uid());

-- Interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  location text DEFAULT '',
  meeting_link text DEFAULT '',
  interview_type text DEFAULT 'in-person', -- in-person, video, phone
  message text DEFAULT '',
  status text DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = interviews.application_id
      AND applications.candidate_id = auth.uid()
    )
  );

CREATE POLICY "HR can view all interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can insert interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

CREATE POLICY "HR can delete interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('hr', 'admin')
    )
  );

-- Seed branches
INSERT INTO branches (name, city, address) VALUES
  ('Islamabad HQ', 'Islamabad', 'Blue Area, Jinnah Avenue, Islamabad'),
  ('Lahore Office', 'Lahore', 'Gulberg III, Main Boulevard, Lahore'),
  ('Karachi Office', 'Karachi', 'Clifton Block 5, Karachi'),
  ('Remote', 'Remote', 'Work From Home')
ON CONFLICT (name) DO NOTHING;
