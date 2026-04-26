"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, CheckCircle2, ArrowRight, FileText, Loader2 } from "lucide-react";

type ResumeContent = {
  name: string;
  contact: string;
  summary: string;
  experience: { company: string; title: string; period: string; location: string; bullets: string[] }[];
  education: { degree: string; university: string; year: string; gpa?: string }[];
  skills: { category: string; items: string }[];
  certifications?: string[];
  projects?: { name: string; bullets: string[] }[];
};

type Template = {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  color: string;
  bg: string;
  border: string;
  features: string[];
  badge?: string;
  content: ResumeContent;
};

const templates: Template[] = [
  {
    id: "classic-professional",
    name: "Classic Professional",
    desc: "Single-column layout. Maximum ATS compatibility. Ideal for corporate, finance, and government roles.",
    tags: ["ATS-Safe", "Single Column", "All Industries"],
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-700",
    features: ["No tables or columns", "Standard section headings", "Clean serif font", "1-page format"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  City, State",
      summary: "Results-driven professional with 5+ years of experience delivering measurable outcomes in fast-paced environments. Proven ability to manage cross-functional projects, build stakeholder relationships, and drive process improvements. Seeking a challenging role where I can contribute expertise and continue growing.",
      experience: [
        { company: "ABC Corporation", title: "Senior Manager", period: "Jan 2021 – Present", location: "Mumbai, India", bullets: ["Led a team of 12 across 3 departments, improving delivery efficiency by 28%", "Spearheaded a process redesign initiative that saved ₹40L annually", "Managed vendor relationships worth ₹2Cr+ and renegotiated contracts saving 15%"] },
        { company: "XYZ Enterprises", title: "Manager", period: "Jun 2018 – Dec 2020", location: "Bangalore, India", bullets: ["Delivered 15+ projects on time and under budget across a 2-year tenure", "Built and mentored a team of 6, with 2 promoted to senior roles", "Introduced weekly reporting dashboards adopted company-wide"] },
      ],
      education: [{ degree: "Bachelor of Business Administration", university: "University of Delhi", year: "2018", gpa: "8.4/10" }],
      skills: [{ category: "Core Skills", items: "Project Management, Stakeholder Communication, Process Improvement, Data Analysis, Team Leadership" }, { category: "Tools", items: "MS Office Suite, Salesforce, Jira, Power BI, Slack" }],
    },
  },
  {
    id: "modern-clean",
    name: "Modern Clean",
    desc: "Subtle design with header accent. Good balance of aesthetics and ATS readability for tech and creative roles.",
    tags: ["ATS-Friendly", "Tech / Creative"],
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700",
    features: ["Minimal colour accents", "Skill section included", "Works in Google Docs", "Easy to customise"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  github.com/yourname  |  City, State",
      summary: "Creative and technically skilled professional with 4 years of experience building user-facing products. Comfortable working across the full product lifecycle from ideation to deployment. Passionate about clean design, performance, and measurable user impact.",
      experience: [
        { company: "Tech Startup Co.", title: "Product Designer / Developer", period: "Mar 2021 – Present", location: "Bangalore, India", bullets: ["Redesigned the core product flow, increasing user task completion rate from 54% to 81%", "Collaborated with 3 engineering squads to ship 12 major features in 18 months", "Led user research sessions with 40+ participants to validate product direction"] },
        { company: "Digital Agency Ltd.", title: "Junior Designer", period: "Jul 2019 – Feb 2021", location: "Hyderabad, India", bullets: ["Delivered 20+ client projects ranging from brand identity to web design", "Reduced design-to-dev handoff time by 40% by introducing a Figma component library"] },
      ],
      education: [{ degree: "B.Tech in Computer Science", university: "VIT University", year: "2019", gpa: "8.7/10" }],
      skills: [{ category: "Design", items: "Figma, Adobe Illustrator, Photoshop, Sketch, Prototyping" }, { category: "Development", items: "HTML, CSS, JavaScript, React, Tailwind CSS" }, { category: "Tools", items: "Jira, Notion, Miro, Git, Hotjar" }],
    },
  },
  {
    id: "fresher-entry",
    name: "Fresher / Entry Level",
    desc: "Highlights education, projects, and skills over experience. Perfect for students and recent graduates.",
    tags: ["Students", "Entry Level", "ATS-Safe"],
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-700",
    features: ["Education first layout", "Projects section", "Skills & certifications", "Internship-ready"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  github.com/yourname  |  City, State",
      summary: "Final-year Computer Science student with hands-on experience in full-stack development through internships and personal projects. Built and deployed 3 web applications with real user bases. Eager to contribute technical skills and fresh perspective to a growth-oriented engineering team.",
      experience: [
        { company: "Startup Name (Internship)", title: "Software Development Intern", period: "May 2024 – Jul 2024", location: "Remote", bullets: ["Developed 4 REST API endpoints in Node.js used by 500+ daily active users", "Fixed 12 production bugs reducing user-reported errors by 30%", "Wrote unit tests improving code coverage from 60% to 82% on the payments module"] },
      ],
      education: [{ degree: "B.Tech in Computer Science and Engineering", university: "NIT Trichy", year: "2025 (Expected)", gpa: "8.9/10" }],
      skills: [{ category: "Programming", items: "Python, JavaScript, Java, C++" }, { category: "Web", items: "React, Node.js, Express, HTML, CSS, REST APIs" }, { category: "Databases", items: "MySQL, MongoDB, Firebase" }, { category: "Tools", items: "Git, VS Code, Postman, Linux, AWS (basics)" }],
      certifications: ["AWS Certified Cloud Practitioner — Amazon, 2024", "Meta Front-End Developer Certificate — Coursera, 2023"],
      projects: [
        { name: "Job Portal Web App (github.com/yourname/jobportal)", bullets: ["Built a full-stack job board with React and Node.js, supporting 200+ job listings", "Implemented JWT authentication, search filters, and email notification system"] },
        { name: "Expense Tracker Mobile App (github.com/yourname/expenseapp)", bullets: ["Developed a cross-platform app using React Native with local SQLite storage", "Added data visualisation charts reducing manual tracking time by 70% for test users"] },
      ],
    },
  },
  {
    id: "executive-senior",
    name: "Executive / Senior",
    desc: "Spacious layout for 10+ years of experience. Emphasises leadership, impact metrics, and key achievements.",
    tags: ["Senior", "Leadership", "2-Page"],
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-700",
    features: ["2-page format", "Executive summary", "Achievement-focused", "Metrics & impact"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  City, State",
      summary: "Senior technology leader with 12+ years of experience scaling engineering organisations from seed to Series C. Built and led teams of 80+ engineers across India and Southeast Asia. Track record of delivering enterprise platforms serving 10M+ users with 99.99% uptime. Known for building high-performance cultures, strategic vendor relationships, and board-level communication.",
      experience: [
        { company: "Enterprise Solutions Ltd.", title: "VP of Engineering", period: "Jan 2020 – Present", location: "Mumbai, India", bullets: ["Scaled engineering org from 15 to 80 engineers across 6 product squads over 3 years", "Delivered a platform migration to microservices, reducing infrastructure costs by ₹2.4Cr/year", "Established engineering OKR framework adopted across the entire tech organisation", "Represented engineering at board and investor meetings, securing Series C technical due diligence"] },
        { company: "GrowthTech Pvt. Ltd.", title: "Director of Engineering", period: "Jun 2016 – Dec 2019", location: "Bangalore, India", bullets: ["Built greenfield payments platform processing ₹500Cr+ in monthly transactions", "Hired and managed 30 engineers, with 8 promoted to senior/lead roles under my tenure", "Reduced deployment cycle from 2 weeks to daily releases via CI/CD transformation"] },
        { company: "Infosys Ltd.", title: "Senior Software Engineer → Tech Lead", period: "Aug 2011 – May 2016", location: "Pune, India", bullets: ["Led a 10-person team delivering a banking middleware platform for a Fortune 500 client", "Architected a caching solution that reduced API latency by 65% across 3 products"] },
      ],
      education: [{ degree: "M.Tech in Computer Science", university: "IIT Bombay", year: "2011", gpa: "9.1/10" }, { degree: "B.E. in Information Technology", university: "BITS Pilani", year: "2009" }],
      skills: [{ category: "Leadership", items: "Engineering Management, Hiring, OKRs, Agile, Board Communication, P&L Ownership" }, { category: "Architecture", items: "Microservices, Event-Driven Systems, Cloud (AWS/GCP), Kubernetes, System Design" }, { category: "Technology", items: "Java, Go, Python, PostgreSQL, Kafka, Redis, Terraform" }],
      certifications: ["AWS Solutions Architect Professional", "Certified Kubernetes Administrator (CKA)"],
    },
  },
  {
    id: "software-engineer",
    name: "Software Engineer",
    badge: "Role-Specific",
    desc: "Keyword-optimised for engineering roles. Highlights technical stack, system design, and impact metrics.",
    tags: ["ATS-Safe", "Tech", "SWE"],
    color: "text-blue-700",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-300 dark:border-blue-600",
    features: ["Technical skills grid", "GitHub / portfolio link", "Impact metrics", "System design keywords"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  github.com/yourname  |  linkedin.com/in/yourname  |  City, State",
      summary: "Backend-focused software engineer with 4 years of experience building scalable distributed systems in Node.js and Go. Delivered APIs serving 5M+ daily requests with p99 latency under 50ms. Strong in system design, performance optimisation, and mentoring junior engineers. Passionate about clean code, high test coverage, and blameless post-mortems.",
      experience: [
        { company: "FinTech Startup", title: "Software Engineer II", period: "Jan 2022 – Present", location: "Bangalore, India", bullets: ["Designed and built a real-time transaction processing service handling 80K TPS using Kafka and Redis", "Reduced p99 API latency from 340ms to 48ms through query optimisation and caching strategy", "Led migration of 3 monolith modules to microservices, enabling independent deployments", "Mentored 3 junior engineers, conducting weekly code reviews and pair programming sessions"] },
        { company: "Software Services Co.", title: "Junior Software Engineer", period: "Jul 2020 – Dec 2021", location: "Hyderabad, India", bullets: ["Built 12 REST API endpoints for a logistics management platform used by 200+ enterprise clients", "Increased unit test coverage from 41% to 78% on the core order management service", "Automated manual reporting workflows saving 15 hours/week of analyst time"] },
      ],
      education: [{ degree: "B.Tech in Computer Science", university: "IIT Hyderabad", year: "2020", gpa: "8.6/10" }],
      skills: [{ category: "Languages", items: "Go, Node.js (TypeScript), Python, SQL" }, { category: "Infrastructure", items: "AWS (EC2, RDS, SQS, Lambda), Docker, Kubernetes, Terraform" }, { category: "Databases", items: "PostgreSQL, Redis, MongoDB, Elasticsearch" }, { category: "Tools", items: "Git, GitHub Actions, DataDog, Postman, Jira" }],
      certifications: ["AWS Certified Developer – Associate, 2023"],
    },
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    badge: "Role-Specific",
    desc: "Tailored for data and analytics roles. Highlights SQL depth, BI tools, and business insight delivery.",
    tags: ["ATS-Safe", "Analytics", "Data"],
    color: "text-cyan-700",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-300 dark:border-cyan-600",
    features: ["SQL & BI tools highlighted", "Dashboard impact metrics", "Stakeholder communication", "Analytical keywords"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  City, State",
      summary: "Data analyst with 3 years of experience turning complex datasets into actionable business insights. Proficient in SQL, Python, and Power BI. Delivered dashboards and analyses that directly informed ₹1Cr+ in budget decisions. Strong communicator who can translate technical findings for non-technical stakeholders at the C-level.",
      experience: [
        { company: "E-commerce Company", title: "Data Analyst", period: "Feb 2022 – Present", location: "Gurgaon, India", bullets: ["Built an executive KPI dashboard in Power BI used daily by 15 senior leaders, eliminating 8 manual reports", "Conducted cohort analysis that identified a 22% drop-off in Month-2 retention, leading to a product intervention that recovered ₹18L ARR", "Wrote 50+ complex SQL queries across BigQuery for ad-hoc analyses with average 2-hour SLA", "Created a pricing sensitivity model that informed a 12% price increase with <1% churn impact"] },
        { company: "Market Research Firm", title: "Junior Analyst", period: "Jun 2020 – Jan 2022", location: "Mumbai, India", bullets: ["Automated weekly sales reports using Python pandas, saving 6 hours/week across the team", "Cleaned and standardised a 2M-row customer dataset, improving data quality score from 61% to 94%"] },
      ],
      education: [{ degree: "B.Sc. in Statistics", university: "University of Mumbai", year: "2020", gpa: "8.8/10" }],
      skills: [{ category: "Analytics", items: "SQL (BigQuery, PostgreSQL), Python (pandas, numpy), Excel (advanced), R" }, { category: "Visualisation", items: "Power BI, Tableau, Google Looker Studio, Matplotlib, Seaborn" }, { category: "Concepts", items: "Cohort Analysis, A/B Testing, Funnel Analysis, Statistical Modelling, ETL" }],
      certifications: ["Google Data Analytics Professional Certificate, 2022", "Microsoft Power BI Data Analyst Associate, 2023"],
    },
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    badge: "Role-Specific",
    desc: "Built for ML and data science roles. Showcases model deployment, experiment design, and business impact.",
    tags: ["ATS-Safe", "ML / AI", "Data Science"],
    color: "text-indigo-700",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-300 dark:border-indigo-600",
    features: ["Model deployment keywords", "Experiment design", "ML framework skills", "Research & production balance"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  github.com/yourname  |  City, State",
      summary: "Data scientist with 4 years of experience building and deploying machine learning models in production. Led end-to-end ML projects from problem framing to model monitoring, with measurable business outcomes. Proficient in Python, scikit-learn, XGBoost, and cloud ML platforms. Strong foundation in statistics and experiment design.",
      experience: [
        { company: "FinTech Platform", title: "Data Scientist", period: "Mar 2021 – Present", location: "Bangalore, India", bullets: ["Built and deployed a fraud detection model (XGBoost) reducing false positives by 34% while maintaining 98.7% recall, saving ₹80L/year in manual review costs", "Designed and ran 12 A/B experiments following rigorous statistical methods (power analysis, multiple testing correction), directly influencing 3 major product decisions", "Developed a customer LTV prediction model that improved targeted upsell campaign ROAS by 2.8x", "Set up Evidently-based model monitoring pipeline detecting drift within 24 hours of distribution shift"] },
        { company: "Analytics Consulting Co.", title: "Junior Data Scientist", period: "Aug 2019 – Feb 2021", location: "Pune, India", bullets: ["Built demand forecasting models for 3 FMCG clients, achieving MAPE below 8%", "Automated feature engineering pipeline reducing model development time by 40%"] },
      ],
      education: [{ degree: "M.Tech in Data Science", university: "IIT Madras", year: "2019", gpa: "9.0/10" }],
      skills: [{ category: "ML / Modelling", items: "Python, scikit-learn, XGBoost, LightGBM, TensorFlow, PyTorch, Statsmodels" }, { category: "Data & Cloud", items: "SQL, Spark, BigQuery, AWS SageMaker, MLflow, DVC" }, { category: "Concepts", items: "Supervised / Unsupervised Learning, A/B Testing, Time-Series Forecasting, NLP, Model Deployment" }],
      certifications: ["AWS Certified Machine Learning – Specialty, 2023", "Deep Learning Specialisation — Coursera (Andrew Ng), 2021"],
    },
  },
  {
    id: "product-manager",
    name: "Product Manager",
    badge: "Role-Specific",
    desc: "Optimised for PM roles. Highlights product outcomes, user research, prioritisation, and cross-functional leadership.",
    tags: ["ATS-Safe", "Product", "Strategy"],
    color: "text-purple-700",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-300 dark:border-purple-600",
    features: ["Outcome-based experience", "Metrics & OKRs", "Stakeholder language", "PM framework keywords"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  City, State",
      summary: "Product manager with 5 years of experience in B2C fintech and SaaS. Owned product areas from 0 to 1 and scaled features to 2M+ users. Known for data-informed decision-making, tight collaboration with engineering and design, and translating complex user needs into clear product requirements. Consistently delivered against OKRs while maintaining high team velocity.",
      experience: [
        { company: "Fintech Scale-up", title: "Product Manager", period: "Feb 2021 – Present", location: "Bangalore, India", bullets: ["Owned the lending product vertical generating ₹45Cr monthly disbursements, growing 3x over 18 months", "Led redesign of loan application flow, reducing drop-off by 38% and increasing completion rate from 29% to 67%", "Defined and tracked 8 product OKRs per quarter with >80% achievement rate across 6 consecutive quarters", "Ran monthly discovery sprints with 6+ user interviews, synthesising insights into actionable roadmap items"] },
        { company: "SaaS Product Company", title: "Associate Product Manager", period: "Jul 2019 – Jan 2021", location: "Mumbai, India", bullets: ["Launched 3 new features on time and under scope, contributing to a 22% improvement in Day-30 retention", "Managed backlog of 80+ user stories, prioritising using RICE scoring in collaboration with engineering leads"] },
      ],
      education: [{ degree: "MBA (Marketing & Strategy)", university: "IIM Kozhikode", year: "2019", gpa: "3.7/4.0" }],
      skills: [{ category: "Product", items: "Product Strategy, Roadmapping, PRD Writing, User Research, A/B Testing, OKRs, Agile / Scrum" }, { category: "Analytics", items: "Mixpanel, Amplitude, SQL (basic), Excel, Looker" }, { category: "Tools", items: "Jira, Confluence, Figma (read-only), Notion, Miro" }],
    },
  },
  {
    id: "graphic-designer",
    name: "Graphic Designer",
    badge: "Role-Specific",
    desc: "Designed for creative professionals. Highlights brand systems, tools, and portfolio-worthy project outcomes.",
    tags: ["ATS-Safe", "Creative", "Design"],
    color: "text-fuchsia-700",
    bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    border: "border-fuchsia-300 dark:border-fuchsia-600",
    features: ["Brand system keywords", "Portfolio link included", "Print & digital scope", "Creative impact metrics"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  portfolio.yourname.com  |  linkedin.com/in/yourname  |  City, State",
      summary: "Graphic designer with 5 years of experience creating brand identities, marketing collateral, and digital assets for D2C and SaaS brands. Delivered cohesive visual systems across print and digital channels. Known for balancing creative quality with fast turnaround, strong client communication, and systematic design thinking that scales.",
      experience: [
        { company: "Brand Design Studio", title: "Senior Graphic Designer", period: "Jan 2022 – Present", location: "Mumbai, India", bullets: ["Led visual identity refresh for 6 brands annually, including logo systems, typography, and colour palette documentation", "Designed packaging for a D2C beauty brand that contributed to a 30% increase in online conversion rate", "Built a Figma component library of 200+ brand assets reducing onboarding time for new designers by 60%", "Managed 3 junior designers, conducting weekly design reviews and providing structured feedback"] },
        { company: "Digital Marketing Agency", title: "Graphic Designer", period: "Jun 2019 – Dec 2021", location: "Bangalore, India", bullets: ["Produced 500+ social media creatives per year across 12 client brands, consistently meeting 24-hour turnaround SLA", "Created motion graphics using After Effects for 3 product launch campaigns with 2M+ combined views"] },
      ],
      education: [{ degree: "Bachelor of Design (Visual Communication)", university: "National Institute of Design, Ahmedabad", year: "2019", gpa: "8.5/10" }],
      skills: [{ category: "Design Tools", items: "Adobe Illustrator, Photoshop, InDesign, After Effects, Figma" }, { category: "Specialisations", items: "Brand Identity, Packaging Design, Typography, Motion Graphics, Social Media Creatives" }, { category: "Other", items: "CMYK / RGB colour management, Print production, Client presentations, Canva, Procreate" }],
    },
  },
  {
    id: "devops-engineer",
    name: "DevOps / Cloud Engineer",
    badge: "Role-Specific",
    desc: "Keyword-rich template for DevOps, SRE, and cloud roles. Highlights infrastructure, CI/CD, and reliability.",
    tags: ["ATS-Safe", "DevOps", "Cloud"],
    color: "text-orange-700",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-300 dark:border-orange-600",
    features: ["Infrastructure keywords", "SRE & reliability metrics", "IaC & CI/CD focus", "Cloud certifications"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  github.com/yourname  |  City, State",
      summary: "DevOps engineer with 5 years of experience building and operating cloud-native infrastructure on AWS and GCP. Designed CI/CD pipelines and Kubernetes platforms that reduced deployment time by 90% and improved service uptime to 99.99%. Passionate about infrastructure as code, developer experience, and SRE practices.",
      experience: [
        { company: "Cloud-Native SaaS Co.", title: "Senior DevOps Engineer", period: "Apr 2021 – Present", location: "Bangalore, India", bullets: ["Architected and maintained a multi-region Kubernetes platform on AWS EKS serving 50M daily requests", "Built fully automated CI/CD pipeline using GitHub Actions and ArgoCD reducing deployment time from 45 mins to under 4 mins", "Implemented Terraform-managed infrastructure across 3 environments with 100% IaC coverage, eliminating click-ops", "Drove mean time to recovery (MTTR) from 47 minutes to 8 minutes through improved observability and runbooks"] },
        { company: "IT Services Company", title: "DevOps Engineer", period: "Aug 2018 – Mar 2021", location: "Hyderabad, India", bullets: ["Migrated 20+ legacy applications to Docker containers, reducing environment inconsistency issues by 80%", "Set up Prometheus and Grafana monitoring stack with 150+ custom dashboards and alerting rules"] },
      ],
      education: [{ degree: "B.Tech in Information Technology", university: "BITS Hyderabad", year: "2018", gpa: "8.2/10" }],
      skills: [{ category: "Cloud & Infra", items: "AWS (EKS, EC2, RDS, S3, Lambda, VPC), GCP, Terraform, Helm, Kubernetes, Docker" }, { category: "CI/CD & Automation", items: "GitHub Actions, ArgoCD, Jenkins, Ansible, Bash scripting, Python" }, { category: "Observability", items: "Prometheus, Grafana, Datadog, ELK Stack, Loki, PagerDuty" }],
      certifications: ["AWS Certified DevOps Engineer – Professional, 2023", "Certified Kubernetes Administrator (CKA), 2022"],
    },
  },
  {
    id: "business-analyst",
    name: "Business Analyst",
    badge: "Role-Specific",
    desc: "Structured for BA roles in tech, banking, and consulting. Highlights requirements, process design, and stakeholder management.",
    tags: ["ATS-Safe", "BA", "Consulting"],
    color: "text-teal-700",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-300 dark:border-teal-600",
    features: ["Requirements & process keywords", "BPMN & use case skills", "Agile & waterfall", "Banking / tech optimised"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  City, State",
      summary: "Business analyst with 5 years of experience in banking and enterprise software. Expert in requirements elicitation, process mapping (BPMN), and bridging the gap between business stakeholders and technology teams. Delivered projects worth ₹8Cr+ on time and within scope. Certified in Agile BA practices and CBAP-trained.",
      experience: [
        { company: "Private Sector Bank", title: "Senior Business Analyst", period: "Jan 2021 – Present", location: "Mumbai, India", bullets: ["Led BA workstream for a loan origination automation project reducing processing time from 8 days to 1.5 days, saving ₹2.2Cr annually", "Elicited and documented 200+ functional and non-functional requirements via stakeholder workshops, interviews, and process observation", "Produced BRDs, use case documents, and UAT test cases for 6 major regulatory compliance projects", "Facilitated gap analysis workshops with process owners, identifying 11 days of avoidable handoff delay in the lending workflow"] },
        { company: "IT Consulting Firm", title: "Business Analyst", period: "Jun 2018 – Dec 2020", location: "Pune, India", bullets: ["Delivered requirements for 3 enterprise ERP implementations across BFSI and manufacturing clients", "Created 40+ BPMN process maps using Lucidchart, reducing requirement ambiguity and rework by 35%"] },
      ],
      education: [{ degree: "MBA (Finance & Systems)", university: "Symbiosis Institute of Business Management", year: "2018", gpa: "3.6/4.0" }],
      skills: [{ category: "BA Tools", items: "Jira, Confluence, Lucidchart, Visio, MS Excel (advanced), SQL (intermediate)" }, { category: "Methods", items: "BPMN 2.0, Use Case Modelling, User Stories, Gap Analysis, Process Mapping, MoSCoW Prioritisation" }, { category: "Frameworks", items: "Agile / Scrum, Waterfall, BABOK v3, UAT, Change Management" }],
      certifications: ["Certified Business Analysis Professional (CBAP) — in progress", "IIBA ECBA Certified, 2021"],
    },
  },
  {
    id: "marketing-manager",
    name: "Marketing Manager",
    badge: "Role-Specific",
    desc: "Campaign and growth-focused. Highlights ROI-driven results, channel expertise, and brand strategy.",
    tags: ["ATS-Safe", "Marketing", "Growth"],
    color: "text-pink-700",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-300 dark:border-pink-600",
    features: ["Campaign ROI metrics", "Channel expertise", "Brand & demand gen", "Analytics tool keywords"],
    content: {
      name: "Your Full Name",
      contact: "your.email@example.com  |  +91 98765 43210  |  linkedin.com/in/yourname  |  City, State",
      summary: "Performance and brand marketing manager with 5 years of experience in B2B SaaS and D2C e-commerce. Managed ₹1.2Cr+ annual ad budgets with average ROAS of 3.8x. Expert in full-funnel strategy — demand generation, content marketing, paid media, and retention. Data-driven decision maker who uses customer insights to drive measurable business outcomes.",
      experience: [
        { company: "SaaS Scale-up", title: "Marketing Manager", period: "Mar 2021 – Present", location: "Bangalore, India", bullets: ["Managed ₹80L/month marketing budget across Google Ads, LinkedIn, and content, achieving 3.8x blended ROAS", "Built a content engine generating 3,000 organic MQLs/quarter, reducing CPL by 60% vs paid channels", "Led rebranding project including new website, messaging framework, and visual identity — implemented in 8 weeks", "Set up HubSpot CRM with full lead scoring and attribution model, improving MQL-to-SQL conversion by 28%"] },
        { company: "D2C Brand", title: "Digital Marketing Executive", period: "Jul 2019 – Feb 2021", location: "Mumbai, India", bullets: ["Executed performance marketing campaigns on Meta and Google achieving 4.2x ROAS on ₹25L monthly spend", "Grew Instagram following from 8K to 62K in 12 months through organic content strategy and influencer partnerships"] },
      ],
      education: [{ degree: "PGDM (Marketing)", university: "XLRI Jamshedpur", year: "2019", gpa: "3.5/4.0" }],
      skills: [{ category: "Marketing", items: "Performance Marketing, SEO/SEM, Content Strategy, ABM, Email Marketing, Brand Strategy" }, { category: "Tools", items: "HubSpot, Google Ads, Meta Ads Manager, Semrush, Mailchimp, Canva, GA4, Hotjar" }, { category: "Analytics", items: "Google Analytics 4, Tableau, Excel (advanced), Marketing attribution modelling" }],
    },
  },
];

const atsRules = [
  "Use standard section headings: Work Experience, Education, Skills",
  "Avoid tables, text boxes, headers/footers, and columns",
  "Save as .docx or plain PDF — not image-based PDF",
  "Include keywords exactly as they appear in the job description",
  "Use a standard font: Arial, Calibri, Times New Roman, or Garamond",
  "Dates should be in Month YYYY format (e.g., Jan 2023)",
  "Spell out abbreviations at least once (e.g., AI (Artificial Intelligence))",
  "Don't put contact info in the document header — ATS often skips it",
];

async function generateResumePDF(template: Template) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  const lm = 20, rm = 20, tm = 18;
  const pageW = 210, contentW = pageW - lm - rm;
  let y = tm;

  function checkPageBreak(needed = 10) {
    if (y + needed > 277) { doc.addPage(); y = tm; }
  }

  function hline(yy: number, gray = false) {
    doc.setDrawColor(gray ? 200 : 60, gray ? 200 : 60, gray ? 200 : 60);
    doc.setLineWidth(0.3);
    doc.line(lm, yy, pageW - rm, yy);
  }

  function sectionHeader(title: string) {
    checkPageBreak(12);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 30);
    doc.text(title.toUpperCase(), lm, y);
    y += 1.5;
    hline(y);
    y += 4;
  }

  function wrappedText(text: string, x: number, startY: number, maxW: number, size = 9.5, style = "normal", color: [number,number,number] = [60,60,60]): number {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      checkPageBreak(5);
      doc.text(line, x, startY);
      startY += 5;
    }
    return startY;
  }

  // ── NAME ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text(template.content.name, pageW / 2, y, { align: "center" });
  y += 7;

  // ── CONTACT ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const contactLines = doc.splitTextToSize(template.content.contact, contentW);
  for (const cl of contactLines) { doc.text(cl, pageW / 2, y, { align: "center" }); y += 4.5; }
  y += 2;
  hline(y, true);
  y += 5;

  // ── SUMMARY ──
  sectionHeader("Professional Summary");
  y = wrappedText(template.content.summary, lm, y, contentW);
  y += 2;

  // ── EXPERIENCE ──
  sectionHeader("Work Experience");
  for (const exp of template.content.experience) {
    checkPageBreak(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(exp.title, lm, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(exp.period, pageW - rm, y, { align: "right" });
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 40);
    doc.text(`${exp.company}  |  ${exp.location}`, lm, y);
    y += 5;
    for (const bullet of exp.bullets) {
      checkPageBreak(6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      const bLines = doc.splitTextToSize(`•  ${bullet}`, contentW - 4);
      for (const bl of bLines) { doc.text(bl, lm + 2, y); y += 4.8; }
    }
    y += 3;
  }

  // ── EDUCATION ──
  sectionHeader("Education");
  for (const edu of template.content.education) {
    checkPageBreak(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.text(edu.degree, lm, y);
    y += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    let eduLine = `${edu.university}  |  ${edu.year}`;
    if (edu.gpa) eduLine += `  |  GPA: ${edu.gpa}`;
    doc.text(eduLine, lm, y);
    y += 7;
  }

  // ── PROJECTS (if any) ──
  if (template.content.projects?.length) {
    sectionHeader("Projects");
    for (const proj of template.content.projects) {
      checkPageBreak(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(proj.name, lm, y);
      y += 5;
      for (const b of proj.bullets) {
        checkPageBreak(6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(60, 60, 60);
        const bls = doc.splitTextToSize(`•  ${b}`, contentW - 4);
        for (const bl of bls) { doc.text(bl, lm + 2, y); y += 4.8; }
      }
      y += 3;
    }
  }

  // ── SKILLS ──
  sectionHeader("Skills");
  for (const s of template.content.skills) {
    checkPageBreak(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text(`${s.category}: `, lm, y);
    const labelW = doc.getTextWidth(`${s.category}: `);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 60);
    const skillLines = doc.splitTextToSize(s.items, contentW - labelW - 2);
    doc.text(skillLines[0], lm + labelW, y);
    y += 4.8;
    for (let i = 1; i < skillLines.length; i++) { doc.text(skillLines[i], lm + labelW, y); y += 4.8; }
  }
  y += 2;

  // ── CERTIFICATIONS ──
  if (template.content.certifications?.length) {
    sectionHeader("Certifications");
    for (const cert of template.content.certifications) {
      checkPageBreak(6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      doc.text(`•  ${cert}`, lm + 2, y);
      y += 5;
    }
  }

  doc.save(`${template.id}-resume-template.pdf`);
}

export default function ResumeTemplatesClient() {
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(template: Template) {
    setDownloading(template.id);
    try {
      await generateResumePDF(template);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(null);
    }
  }

  const general = templates.filter(t => !t.badge);
  const roleSpecific = templates.filter(t => t.badge);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Free Download · No Sign-Up</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          ATS-Friendly Resume Templates
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          12 templates built to pass Applicant Tracking Systems. Download instantly as PDF — pre-filled with role-specific content and keywords. No sign-up needed.
        </p>
      </div>

      {/* ATS tip banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl px-5 py-4 mb-10">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Why ATS matters</p>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
          Over 95% of Fortune 500 companies use ATS software to filter resumes before a human reads them. A beautifully designed resume can score 0% on ATS if it uses tables, images, or non-standard formatting. These templates are built to pass the scan and include industry-specific keywords.
        </p>
      </div>

      {/* General templates */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Templates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {general.map((t) => (
          <TemplateCard key={t.id} t={t} downloading={downloading} onDownload={handleDownload} />
        ))}
      </div>

      {/* Role-specific templates */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Role-Specific Templates</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Pre-filled with role-appropriate language, keywords, and measurable achievements.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {roleSpecific.map((t) => (
          <TemplateCard key={t.id} t={t} downloading={downloading} onDownload={handleDownload} />
        ))}
      </div>

      {/* ATS rules */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ATS Resume Rules — Quick Checklist</h2>
        <ul className="space-y-2.5">
          {atsRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Done editing? Check how well your resume matches a job description.</p>
        <Link
          href="/tools/ats-score"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Check My ATS Score <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

function TemplateCard({ t, downloading, onDownload }: { t: Template; downloading: string | null; onDownload: (t: Template) => void }) {
  const isLoading = downloading === t.id;
  return (
    <div className={`rounded-2xl border p-6 ${t.bg} ${t.border}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${t.color}`}>
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`font-bold text-base ${t.color}`}>{t.name}</h2>
            {t.badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70 dark:bg-gray-900/40 ${t.color} border ${t.border}`}>
                {t.badge}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {t.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white/60 dark:bg-gray-900/40 border border-white/80 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{t.desc}</p>
      <ul className="space-y-1.5 mb-5">
        {t.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${t.color}`} /> {f}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onDownload(t)}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 bg-white dark:bg-gray-800 border ${t.border} ${t.color} font-semibold text-sm px-4 py-2 rounded-xl hover:shadow-sm transition-all disabled:opacity-60`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isLoading ? "Generating…" : "Download PDF"}
      </button>
    </div>
  );
}
