-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create users profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  github_username VARCHAR(100),
  twitter_username VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create rules table
CREATE TABLE IF NOT EXISTS rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create votes table for rule voting
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES rules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(rule_id, user_id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES rules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(rule_id, user_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create rule_tags junction table
CREATE TABLE IF NOT EXISTS rule_tags (
  rule_id UUID REFERENCES rules(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (rule_id, tag_id)
);

-- Create indexes for performance
CREATE INDEX idx_rules_category_id ON rules(category_id);
CREATE INDEX idx_rules_author_id ON rules(author_id);
CREATE INDEX idx_rules_is_published ON rules(is_published);
CREATE INDEX idx_rules_created_at ON rules(created_at DESC);
CREATE INDEX idx_votes_rule_id ON votes(rule_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('General', 'general', 'General purpose Cursor rules', 'FileText'),
  ('React', 'react', 'Rules for React development', 'Code'),
  ('TypeScript', 'typescript', 'TypeScript specific rules', 'FileCode'),
  ('Testing', 'testing', 'Testing and QA rules', 'TestTube'),
  ('Backend', 'backend', 'Backend development rules', 'Server'),
  ('Frontend', 'frontend', 'Frontend development rules', 'Monitor'),
  ('DevOps', 'devops', 'DevOps and deployment rules', 'Cloud'),
  ('Database', 'database', 'Database related rules', 'Database'),
  ('Security', 'security', 'Security best practices', 'Shield'),
  ('Performance', 'performance', 'Performance optimization rules', 'Zap')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Anyone can read, users can update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Rules: Anyone can read published rules, authors can manage their own
CREATE POLICY "Published rules are viewable by everyone" ON rules
  FOR SELECT USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Users can create rules" ON rules
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own rules" ON rules
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own rules" ON rules
  FOR DELETE USING (auth.uid() = author_id);

-- Votes: Users can manage their own votes
CREATE POLICY "Users can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Users can create own votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON votes
  FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks: Users can manage their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Functions for vote counting
CREATE OR REPLACE FUNCTION get_rule_vote_count(rule_id UUID)
RETURNS TABLE(upvotes BIGINT, downvotes BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE vote_type = 'up') as upvotes,
    COUNT(*) FILTER (WHERE vote_type = 'down') as downvotes
  FROM votes
  WHERE votes.rule_id = get_rule_vote_count.rule_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();