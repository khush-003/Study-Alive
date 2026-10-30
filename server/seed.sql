USE skill2career;

-- Catalog career text is sourced from the platform's existing careers data.
INSERT INTO careers (
  slug, category, name, tagline, about, icon, scope, salary_range,
  job_opportunities, future_growth, required_skills, global_opportunities, best_for
) VALUES
  ('cs', 'Technology & Engineering', 'Computer Science',
   'Build technology. Solve real problems. Create a better tomorrow.',
   'Computer Science is the study of computation, programming, and algorithmic problem-solving. It powers modern digital infrastructure, artificial intelligence, robotics, and cloud platforms.',
   'fa-solid fa-code', 'Extremely High (Software, AI, Cloud, Cybersecurity)', '₹8 - 20 LPA',
   'Abundant across all tech sectors globally', '22% CAGR through 2030',
   'Programming (Python, C++), Data Structures, Logic Flow',
   'High (Remote & International Sponsorships)',
   'Students passionate about coding and building digital solutions'),
  ('ds', 'Technology & Data', 'Data Science & AI',
   'Uncover patterns. Train intelligent models. Drive decisions.',
   'Data Science combines statistical modeling, mathematics, machine learning, and domain knowledge to extract actionable intelligence from big data.',
   'fa-solid fa-brain', 'Very High (Analytics, FinTech, Autonomous Tech)', '₹9 - 22 LPA',
   'High demand in product companies and banks', '28% CAGR Projected',
   'Statistics, Python, SQL, Machine Learning Frameworks',
   'High across US, Europe, and Asia-Pacific',
   'Analytical minds fond of numbers and predictions'),
  ('mech', 'Engineering', 'Mechanical Engineering',
   'Design hardware. Automate physical systems. Innovate machines.',
   'Mechanical Engineering focuses on the principles of force, energy, materials, thermodynamics, and robotics to invent and construct physical mechanisms.',
   'fa-solid fa-robot', 'Steady & Expanding (EVs, Robotics, Aerospace)', '₹6 - 15 LPA',
   'Strong in manufacturing, automotive, and defense', '12% Steady Growth',
   'CAD/CAM, Thermodynamics, Mechanics, Embedded Systems',
   'Moderate to High in Germany, Japan, USA',
   'Problem solvers who love tinkering with physical hardware'),
  ('design', 'Design & Creative', 'Product & UI/UX Design',
   'Craft delightful user experiences and intuitive interfaces.',
   'Product and UX Design bridges empathy, aesthetics, human-computer interaction, and business needs to create seamless digital products.',
   'fa-solid fa-pen-nib', 'High (SaaS, Consumer Apps, E-commerce)', '₹7 - 18 LPA',
   'Every tech startup and enterprise hires designers', '18% CAGR',
   'Figma, User Research, Wireframing, Visual Hierarchy',
   'High with freelance & remote contracts',
   'Creative thinkers with visual taste and empathy'),
  ('business', 'Business & Management', 'Business & Management',
   'Lead teams. Strategize growth. Build thriving enterprises.',
   'Business studies encompass marketing, finance, leadership, operations, and organizational strategy to drive economic value.',
   'fa-solid fa-chart-line', 'Universal across all sectors', '₹8 - 24 LPA',
   'Corporate firms, consultancies, venture capital', '15% Consistent Growth',
   'Communication, Strategy, Financial Literacy, Leadership',
   'High across multinational headquarters',
   'Natural communicators and strategic planners'),
  ('medical', 'Medical & Health Sciences', 'Medical & Health Sciences',
   'Heal communities. Save lives. Advance biomedical science.',
   'Medicine and healthcare involve biology, clinical diagnostics, therapeutics, and patient care to maintain human health and vitality.',
   'fa-solid fa-heart-pulse', 'Evergreen & Critical', '₹9 - 30 LPA',
   'Hospitals, research centers, biotech labs', 'Continuous high societal demand',
   'Biology, Chemistry, Empathy, Diagnostic Acumen',
   'High with licensing exams (USMLE, PLAB)',
   'Empathetic individuals dedicated to healing others'),
  ('cyber', 'Technology & Security', 'Cybersecurity Analyst',
   'Defend networks. Safeguard cloud data. Counter cyber threats.',
   'Cybersecurity professionals build defenses, audit vulnerabilities, and mitigate attacks on cloud and enterprise infrastructure.',
   'fa-solid fa-shield-halved', 'Extremely High (Defense, Banking, Cloud Infrastructure)', '₹7 - 18 LPA',
   'Zero-unemployment field with global talent shortage', '31% Projected Demand Surge',
   'Networking, Linux, Penetration Testing, Cryptography',
   'Global remote & government clearance tracks',
   'Students keen on systems defense and ethical hacking')
ON DUPLICATE KEY UPDATE
  category = VALUES(category), name = VALUES(name), tagline = VALUES(tagline),
  about = VALUES(about), icon = VALUES(icon), scope = VALUES(scope),
  salary_range = VALUES(salary_range), job_opportunities = VALUES(job_opportunities),
  future_growth = VALUES(future_growth), required_skills = VALUES(required_skills),
  global_opportunities = VALUES(global_opportunities), best_for = VALUES(best_for);

-- Degree pathways retain the source order used by the Explore career tabs.
INSERT INTO career_degrees (career_id, degree_path, sort_order)
SELECT id, 'B.Tech / B.E. in Computer Science — 4 Years • JEE Main, JEE Advanced, BITSAT, State CETs', 1 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'B.Sc Computer Science / BCA — 3 Years • Software foundations followed by MCA', 2 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'B.Tech in Data Science / Artificial Intelligence — 4 Years', 1 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'B.Sc Statistics, Mathematics, or Data Science — 3 Years', 2 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'B.Tech / B.E. in Mechanical Engineering — 4 Years • JEE Main, State CETs', 1 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'Diploma in Mechanical Engineering — 3 Years • Polytechnic entry', 2 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'B.Des in Communication / Interaction Design — 4 Years', 1 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'BFA or related design degree with a UI/UX portfolio', 2 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'BBA / BMS in Business Administration or Management — 3 Years', 1 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'B.Com in Finance or Business followed by an MBA', 2 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'MBBS — 5.5 Years including internship • NEET-UG', 1 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'BDS, B.Sc Nursing, or allied health science degrees', 2 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'B.Tech in Computer Science / Information Security — 4 Years', 1 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'B.Sc Cybersecurity or IT with security certifications and labs', 2 FROM careers WHERE slug = 'cyber'
ON DUPLICATE KEY UPDATE degree_path = VALUES(degree_path);

-- Advantages and considerations are stored as ordered child rows.
INSERT INTO career_pros_cons (career_id, item_type, description, sort_order)
SELECT id, 'pro', 'Lucrative compensation packages with rapid increments', 1 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'pro', 'Exceptional remote work and overseas opportunities', 2 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'pro', 'Freedom to build your own startups and open source tools', 3 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'risk', 'Rapidly evolving frameworks require ongoing self-learning', 1 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'risk', 'Competitive entry-level hiring filters and code evaluations', 2 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'risk', 'Long hours behind monitors during product shipping weeks', 3 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'pro', 'Work on high-impact products and data-driven decisions', 1 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'pro', 'Strong demand across technology, finance, and healthcare', 2 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'pro', 'Opportunities to specialize in machine learning and AI', 3 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'risk', 'Requires a strong foundation in mathematics and statistics', 1 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'risk', 'Tools and machine-learning methods change quickly', 2 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'risk', 'Some roles require postgraduate study or substantial experience', 3 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'pro', 'Broad applications in automotive, energy, aerospace, and robotics', 1 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'pro', 'Hands-on design, manufacturing, and prototyping work', 2 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'pro', 'Opportunities to contribute to electric vehicles and automation', 3 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'risk', 'Some roles require on-site work in plants or workshops', 1 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'risk', 'Core industry salaries can grow more gradually than some tech roles', 2 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'risk', 'Specialized design tools and standards require continuous practice', 3 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'pro', 'Combine creativity, user empathy, and practical problem-solving', 1 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'pro', 'Portfolio-based entry and opportunities for freelance work', 2 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'pro', 'Work closely with product, engineering, and research teams', 3 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'risk', 'A strong portfolio takes time and ongoing iteration to build', 1 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'risk', 'Design decisions can involve subjective feedback and revisions', 2 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'risk', 'Entry-level roles are competitive and value demonstrated skills', 3 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'pro', 'Transferable skills apply across many industries', 1 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'pro', 'Multiple specializations in marketing, finance, and operations', 2 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'pro', 'Develop leadership, communication, and strategic thinking', 3 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'risk', 'Career outcomes can depend strongly on experience and networking', 1 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'risk', 'Many management positions prefer postgraduate qualifications', 2 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'risk', 'Fast-paced roles can involve demanding targets and deadlines', 3 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'pro', 'Meaningful work that directly supports patient and community health', 1 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'pro', 'Broad specialties across clinical care, research, and biotechnology', 2 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'pro', 'Strong and lasting societal need for healthcare professionals', 3 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'risk', 'Long and academically demanding education and training', 1 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'risk', 'Clinical work can involve high responsibility and emotional stress', 2 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'risk', 'Practicing in another country usually requires licensing exams', 3 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'pro', 'Strong demand across cloud, finance, government, and technology', 1 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'pro', 'Work spans security operations, risk, and incident response', 2 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'pro', 'Practical labs and certifications can build demonstrable skills', 3 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'risk', 'Security threats and defensive practices evolve constantly', 1 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'risk', 'Incident response may require high-pressure or on-call work', 2 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'risk', 'Some government or regulated roles require clearance or licensing', 3 FROM careers WHERE slug = 'cyber'
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Example job profiles match the source careers and salary guidance.
INSERT INTO career_jobs (career_id, title, stack, salary_range, sort_order)
SELECT id, 'Full Stack Web Developer', 'React, Node.js, Python, PostgreSQL', '₹7 - 18 LPA', 1 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'Systems & Cloud Architect', 'AWS, Docker, Kubernetes, Linux', '₹12 - 28 LPA', 2 FROM careers WHERE slug = 'cs'
UNION ALL SELECT id, 'Data Scientist', 'Python, SQL, Statistics, Machine Learning', '₹9 - 22 LPA', 1 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'Machine Learning Engineer', 'Python, PyTorch, Cloud, MLOps', '₹10 - 26 LPA', 2 FROM careers WHERE slug = 'ds'
UNION ALL SELECT id, 'Mechanical & Robotics Engineer', 'CAD, Robotics, Automation, EV Systems', '₹6 - 15 LPA', 1 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'Design Engineer', 'SolidWorks, CATIA, FEA, Manufacturing', '₹5 - 14 LPA', 2 FROM careers WHERE slug = 'mech'
UNION ALL SELECT id, 'Product Designer', 'Figma, Prototyping, UX Research, Design Systems', '₹7 - 18 LPA', 1 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'UI/UX Designer', 'Wireframing, Interaction Design, Usability Testing', '₹6 - 16 LPA', 2 FROM careers WHERE slug = 'design'
UNION ALL SELECT id, 'Business Analyst', 'Market Research, Excel, SQL, Strategy', '₹6 - 18 LPA', 1 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'Marketing Manager', 'Brand Strategy, Analytics, Campaigns', '₹8 - 24 LPA', 2 FROM careers WHERE slug = 'business'
UNION ALL SELECT id, 'Medical Doctor', 'Clinical Practice, Diagnostics, Patient Care', '₹9 - 30 LPA', 1 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'Biomedical Researcher', 'Biology, Lab Methods, Clinical Research', '₹5 - 16 LPA', 2 FROM careers WHERE slug = 'medical'
UNION ALL SELECT id, 'Cybersecurity Analyst', 'Networking, Linux, SIEM, Incident Response', '₹7 - 18 LPA', 1 FROM careers WHERE slug = 'cyber'
UNION ALL SELECT id, 'Cloud Security Engineer', 'AWS, IAM, Containers, Security Auditing', '₹10 - 24 LPA', 2 FROM careers WHERE slug = 'cyber'
ON DUPLICATE KEY UPDATE title = VALUES(title), stack = VALUES(stack), salary_range = VALUES(salary_range);

-- These five study resources are the original Computer Science cards; file URLs
-- remain NULL because the frontend source does not include actual file assets.
INSERT INTO study_materials (id, subject, type, title, description, file_url, size_mb, duration)
VALUES
  (1, 'cs', 'notes', 'Introduction to Programming (PDF)', 'Notes • 2.4 MB • Python Syntax & Logic Flow', NULL, 2.40, NULL),
  (2, 'cs', 'videos', 'Data Structures Basics', 'Video • 18 mins • Arrays, Stacks, Linked Lists', NULL, NULL, '18 mins'),
  (3, 'cs', 'notes', 'Object Oriented Programming', 'Notes • 1.8 MB • Classes, Objects, Inheritance', NULL, 1.80, NULL),
  (4, 'cs', 'practice', 'Previous Year Papers', 'Practice • 5 sets with verified answer keys', NULL, NULL, NULL),
  (5, 'cs', 'notes', 'Quick Revision Guide', 'PDF • 1.2 MB • One-night formula & snippet sheet', NULL, 1.20, NULL)
ON DUPLICATE KEY UPDATE subject = VALUES(subject), type = VALUES(type),
  title = VALUES(title), description = VALUES(description), file_url = VALUES(file_url),
  size_mb = VALUES(size_mb), duration = VALUES(duration);

-- Sample peer accounts use an unusable password marker and cannot sign in.
INSERT INTO users (name, email, password_hash, stream, role, avatar_url)
VALUES
  ('Rohan Mehta', 'rohan.mehta@example.invalid', '$2b$12$cN/YsWcVFsNnSgtQ2uH0OuPjsOzka2aQwuV5uIb6QlmR2XGQKjWHG', 'Computer Science', 'mentor', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80'),
  ('Sneha Verma', 'sneha.verma@example.invalid', '$2b$12$cN/YsWcVFsNnSgtQ2uH0OuPjsOzka2aQwuV5uIb6QlmR2XGQKjWHG', 'Design', 'mentor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'),
  ('Arjun Nair', 'arjun.nair@example.invalid', '$2b$12$cN/YsWcVFsNnSgtQ2uH0OuPjsOzka2aQwuV5uIb6QlmR2XGQKjWHG', 'Mathematics', 'mentor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'),
  ('Priya Sharma', 'priya.sharma@example.invalid', '$2b$12$cN/YsWcVFsNnSgtQ2uH0OuPjsOzka2aQwuV5uIb6QlmR2XGQKjWHG', 'Arts & Humanities', 'mentor', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80')
ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash),
  stream = VALUES(stream), role = VALUES(role), avatar_url = VALUES(avatar_url);

INSERT INTO skill_offers (user_id, teach_skill, learn_skill)
SELECT id, 'Python Basics, Django', 'UI/UX Design, Figma' FROM users WHERE email = 'rohan.mehta@example.invalid'
UNION ALL SELECT id, 'Graphic Design & Illustrator', 'Data Analysis, SQL' FROM users WHERE email = 'sneha.verma@example.invalid'
UNION ALL SELECT id, 'Calculus & Math Olympiad', 'Web Development' FROM users WHERE email = 'arjun.nair@example.invalid'
UNION ALL SELECT id, 'Public Speaking & Debating', 'Digital Marketing' FROM users WHERE email = 'priya.sharma@example.invalid'
ON DUPLICATE KEY UPDATE teach_skill = VALUES(teach_skill), learn_skill = VALUES(learn_skill);

-- Session times are seeded relative to the import date so the cards stay upcoming.
INSERT INTO live_sessions (id, title, speaker, starts_at, badge)
VALUES
  (1, 'From High School to First Coding Internships',
   'Tanmay Rao (IIT Delhi ''25). Live Q&A on building real projects.',
   DATE_ADD(DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), INTERVAL 18 HOUR),
   'Happening Tomorrow'),
  (2, 'Mastering Figma in 60 Minutes',
   'Sneha Verma. Hands-on wireframing of your first mobile app.',
   DATE_ADD(DATE_ADD(CURRENT_DATE, INTERVAL ((8 - DAYOFWEEK(CURRENT_DATE)) % 7 + 7) DAY), INTERVAL 11 HOUR),
   'Weekend Workshop')
ON DUPLICATE KEY UPDATE title = VALUES(title), speaker = VALUES(speaker),
  starts_at = VALUES(starts_at), badge = VALUES(badge);

INSERT INTO `updates` (id, category, title, summary, details, published_at)
VALUES
  (1, 'exams', 'JEE Main 2026: Registration Dates Announced',
   'National Testing Agency releases session dates for engineering entrance.',
   'Online submission of application forms begins this week. Candidates are advised to keep Aadhaar verification and Class 10/12 roll numbers ready.',
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 HOUR)),
  (2, 'admissions', 'New AI & Machine Learning B.Tech Course Launch by IIT',
   'Curriculum tailored for cutting-edge Generative AI and Autonomous systems.',
   'The specialized program combines statistical modeling with deep learning, robotics, and computing infrastructure.',
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 HOUR)),
  (3, 'reports', 'Top 10 Emerging Careers in 2026',
   'Renewable energy tech, bio-informatics, and prompt engineering lead the list.',
   'The report highlights emerging opportunities in renewable energy technology, bio-informatics, and prompt engineering.',
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)),
  (4, 'scholarships', 'National Scholarship Schemes for STEM Students',
   'Up to ₹50,000 annual aid for female and meritorious high school graduates.',
   'Eligible students can review current national scholarship schemes and application requirements on the official scholarship portal.',
   DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE category = VALUES(category), title = VALUES(title),
  summary = VALUES(summary), details = VALUES(details), published_at = VALUES(published_at);
