import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Send, Download, Paperclip } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/tools/$slug")({
  head: () => ({
    meta: [{ title: "SABI Tool" }],
  }),
  component: ToolDetail,
});

type FieldType = "text" | "textarea" | "select" | "multiselect" | "toggle";

type ToolField = {
  key: string;
  label: string;
  placeholder?: string;
  /** Defaults to "text" when omitted. */
  type?: FieldType;
  /** Options for "select" and "multiselect" fields. Include "Others" to trigger a follow-up free-text input. */
  options?: string[];
  /** Marks the field as not required for generation. Falls back to checking the label for "(optional)" if omitted. */
  optional?: boolean;
};

type ToolConfig = {
  label: string;
  placeholder: string;
  endpoint: string;
  fields: ToolField[];
};

const isFieldOptional = (field: ToolField) =>
  field.optional === true || field.label.toLowerCase().includes("optional");

/** Resolves the effective value for a field, substituting the "Others" free-text input when selected. */
const NEEDS_FOLLOW_UP_TEXT = new Set(["Others", "Custom"]);

const resolveFieldValue = (field: ToolField, form: Record<string, string>) => {
  const raw = form[field.key] || "";
  if (field.type === "select" && NEEDS_FOLLOW_UP_TEXT.has(raw)) {
    return form[`${field.key}Other`]?.trim() || raw;
  }
  return raw;
};

const defaultFormForConfig = (config: ToolConfig): Record<string, string> => {
  const defaults: Record<string, string> = {};
  config.fields.forEach(f => {
    if (f.type === "select" && f.options?.length) defaults[f.key] = f.options[0];
    else if (f.type === "toggle") defaults[f.key] = "No";
    else defaults[f.key] = "";
  });
  return defaults;
};

const TOOL_CONFIG: Record<string, ToolConfig> = {
  "sabi-lesson-plan": {
    label: "Lesson Plan",
    placeholder: "Ask SABI to refine, translate, or adjust...",
    endpoint: "/api/tools/plan",
    fields: [
      // SECTION A — Classroom Context
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 3, JSS 1, Senior Secondary 2" },
      {
        key: "subject", label: "Subject", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Topic you're teaching", type: "text", placeholder: "e.g. Fractions" },
      { key: "subtopic", label: "Sub-topic or focus area (optional)", type: "text", optional: true, placeholder: "e.g. Comparing fractions" },
      {
        key: "curriculum", label: "Curriculum or standard to align with", type: "select",
        options: [
          "Sierra Leone National Curriculum", "Universal Basic Education", "British National Curriculum",
          "Liberia National Curriculum", "American Curriculum", "Montessori Curriculum",
          "Cambridge Assessment International Education", "WAEC", "Competence Based Curriculum", "Others",
        ],
      },
      // SECTION B — Lesson Structure
      {
        key: "duration", label: "Lesson length", type: "select",
        options: ["30 minutes", "45 minutes", "60 minutes", "80+ minutes"],
      },
      { key: "mainObjective", label: "Main learning objective for this lesson", type: "textarea", placeholder: "e.g. Students should be able to identify and compare simple fractions." },
      { key: "endGoal", label: "What should students achieve by the end? (optional)", type: "text", optional: true, placeholder: "e.g. Students should solve simple fraction problems." },
      {
        key: "understandingLevel", label: "Current student understanding level", type: "select",
        options: ["New topic", "Basic understanding", "Moderate understanding", "Advanced understanding"],
      },
      {
        key: "teachingApproach", label: "Teaching approach(es)", type: "multiselect",
        options: ["Discussion", "Group work", "Experiment", "Demonstration", "Storytelling", "Project-based learning", "Direct instruction", "Inquiry-based learning"],
      },
      { key: "referenceNotes", label: "Lesson references or curriculum notes (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION C — Classroom Reality
      {
        key: "classSize", label: "Approximate class size", type: "select",
        options: ["Under 20", "20–40", "40–60", "60+"],
      },
      {
        key: "materials", label: "Materials available", type: "multiselect", optional: true,
        options: ["Chalkboard", "Paper", "Bottles", "Markers", "Rulers", "No materials", "Others"],
      },
      {
        key: "challenges", label: "Classroom challenges SABI should consider", type: "multiselect", optional: true,
        options: ["Mixed-ability learners", "Limited materials", "Large class size", "Language/literacy barriers", "Limited time", "Low student participation", "No internet/electricity", "Others"],
      },
      { key: "supportNeeds", label: "Students who may need additional support (optional)", type: "textarea", optional: true, placeholder: "Describe any learners who need extra support or differentiation..." },
      // SECTION D — Assessment & Follow-Up
      { key: "includeAssessment", label: "Include formative assessment questions?", type: "toggle" },
      { key: "includeHomework", label: "Include homework or follow-up activities?", type: "toggle" },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "French", "Kinyarwanda", "Simple English", "Others"],
      },
    ],
  },
  "sabi-diagnose": {
    label: "Class Diagnostic",
    placeholder: "Ask SABI to adjust or expand the diagnostic...",
    endpoint: "/api/tools/diagnose",
    fields: [
      // SECTION A — Class Information
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 5, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Entrepreneurship", "Food and Nutrition", "French",
          "Geography", "Government", "History", "Home Economics/Management",
          "(ICT) Information and Communication Technology", "Innovation", "Islamic Studies", "Music",
          "Physical Education", "Physics", "Psychology", "Robotics", "General Science", "Social Studies",
          "Special Need Education", "Technical Drawing", "Theatre Arts", "Vocational Studies", "Woodwork",
          "Communication for Impact", "Data and Decisions/Business Analytics", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Topic you're preparing to teach", type: "text", placeholder: "e.g. Photosynthesis" },
      { key: "subtopic", label: "Sub-topic or skill focus (optional)", type: "text", optional: true, placeholder: "e.g. Identifying the parts of a plant" },
      {
        key: "curriculum", label: "Curriculum to align with", type: "select",
        options: [
          "Sierra Leone National Curriculum", "Universal Basic Education", "British National Curriculum",
          "Liberia National Curriculum", "American Curriculum", "Montessori Curriculum",
          "Cambridge Assessment International Education", "WAEC", "Competence Based Curriculum", "Others",
        ],
      },
      // SECTION B — Diagnostic Purpose
      {
        key: "diagnosticFocus", label: "What would you like to diagnose?", type: "multiselect",
        options: [
          "Prior knowledge", "Misconceptions", "Vocabulary understanding", "Problem-solving ability",
          "Reading comprehension", "Practical skills", "Readiness for a new topic", "Confidence level", "Others",
        ],
      },
      {
        key: "goal", label: "Main goal of this diagnostic check", type: "select",
        options: [
          "Understand learner starting point", "Identify learning gaps", "Group students by readiness",
          "Adapt lesson difficulty", "Prepare intervention support", "Review previous learning", "Others",
        ],
      },
      {
        key: "cognitiveLevel", label: "Cognitive level to focus on", type: "select",
        options: ["Recall and memory", "Basic understanding", "Application/problem solving", "Critical thinking", "Mixed levels"],
      },
      // SECTION C — Classroom Context
      {
        key: "classSize", label: "Approximate class size", type: "select",
        options: ["Under 20", "20–40", "40–60", "60+"],
      },
      {
        key: "challenges", label: "Classroom challenges SABI should consider", type: "multiselect", optional: true,
        options: ["Mixed-ability learners", "Low literacy levels", "Limited time", "Large class size", "Language barriers", "Low participation", "Limited resources"],
      },
      {
        key: "differentiated", label: "Include differentiated diagnostic tasks?", type: "toggle",
      },
      // SECTION D — Output Preferences
      {
        key: "activityType", label: "Type of diagnostic activity", type: "multiselect",
        options: ["Quick quiz", "Oral questioning", "Exit-entry questions", "Group discussion prompts", "Short written assessment", "Practical activity", "Confidence/self-rating check"],
      },
      {
        key: "numQuestions", label: "Number of questions/tasks", type: "select",
        options: ["3", "5", "10", "15+", "Custom"],
      },
      {
        key: "outputFormat", label: "Output format", type: "select",
        options: ["Questions only", "Questions with answers", "Questions with teacher interpretation guide", "Questions with misconceptions analysis"],
      },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "French", "Kinyarwanda", "Others"],
      },
      {
        key: "notes", label: "Any relevant consideration I should know? (optional)", type: "textarea", optional: true,
        placeholder: "Anything else SABI should factor in...",
      },
    ],
  },
  "sabi-unit-series": {
    label: "Unit Series",
    placeholder: "Ask SABI to extend or adjust the unit...",
    endpoint: "/api/tools/unit",
    fields: [
      // SECTION A — Curriculum Context
      {
        key: "subject", label: "Subject / learning area", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 4, JSS 2, Senior Secondary 1" },
      { key: "focusTopic", label: "Starting topic or unit focus (optional)", type: "text", optional: true, placeholder: "e.g. Cell Biology" },
      { key: "referenceMaterials", label: "Curriculum guides, schemes of work, syllabus or pacing documents (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      {
        key: "instructionalPeriod", label: "Instructional period to cover", type: "select",
        options: ["1 Month", "Term 1", "Term 2", "Term 3", "Semester 1", "Semester 2", "Full academic year", "Custom duration"],
      },
      // SECTION B — Instructional Structure
      {
        key: "structureType", label: "Instructional structure", type: "select",
        options: ["Weekly scheme of work", "Competency-based sequence", "Topic progression roadmap", "Lesson progression framework", "Exam preparation roadmap", "Project-integrated sequence"],
      },
      {
        key: "priorities", label: "What should SABI prioritize?", type: "multiselect",
        options: ["Concept mastery", "Practical learning", "Critical thinking", "Exam readiness", "Project-based learning", "STEAM integration", "Literacy development", "Skill application"],
      },
      {
        key: "teachingApproaches", label: "Teaching approaches to emphasize", type: "multiselect",
        options: ["Inquiry-based learning", "Discussion", "Group work", "Demonstration", "Storytelling", "Practical activities", "Direct instruction", "Collaborative learning"],
      },
      // SECTION C — Assessment & Progression
      {
        key: "assessmentMethods", label: "How should student learning be assessed?", type: "multiselect",
        options: ["Formative assessment", "Summative assessment", "Projects", "Oral assessment", "Practical assessment", "Peer assessment", "Continuous assessment"],
      },
      {
        key: "includeElements", label: "Should SABI include:", type: "multiselect", optional: true,
        options: ["Revision checkpoints", "Homework recommendations", "Project activities", "Assessment checkpoints", "Real-life/local examples", "Differentiation strategies"],
      },
      // SECTION D — Classroom Reality
      {
        key: "contextFactors", label: "Contextual factors SABI should consider", type: "multiselect", optional: true,
        options: ["Limited materials", "Large class size", "Mixed-ability learners", "Low literacy levels", "Language barriers", "Limited teaching time", "Low student participation", "Others"],
      },
      // SECTION E — Output Preferences
      {
        key: "detailLevel", label: "Level of detail", type: "select",
        options: ["High-level overview", "Weekly breakdown", "Detailed instructional sequence", "Full term roadmap"],
      },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-slides": {
    label: "Slide Deck",
    placeholder: "Ask SABI to add a slide or change the tone...",
    endpoint: "/api/tools/slides",
    fields: [
      // SECTION A — Lesson Context
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. JSS3" },
      {
        key: "subject", label: "Subject / learning area", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Topic the presentation covers", type: "text", placeholder: "e.g. Introduction to Fractions" },
      {
        key: "presentationType", label: "Type of presentation", type: "select",
        options: ["Lesson presentation", "Revision slides", "Concept explanation", "Project presentation", "Assessment review", "Interactive discussion slides", "STEAM activity walkthrough", "Others"],
      },
      // SECTION B — Presentation Design
      {
        key: "teachingStyle", label: "Teaching style to prioritize", type: "multiselect",
        options: ["Visual explanation", "Step-by-step teaching", "Interactive discussion", "Storytelling", "Problem solving", "Inquiry-based learning", "Exam preparation"],
      },
      {
        key: "slideCount", label: "Approximate number of slides", type: "select",
        options: ["5–7 slides", "8–12 slides", "12–20 slides", "Full lesson deck", "Custom"],
      },
      {
        key: "learnerLevel", label: "Learner level to target", type: "select",
        options: ["Beginner", "Basic understanding", "Intermediate", "Advanced", "Mixed ability"],
      },
      // SECTION C — Optional Enhancements
      {
        key: "enhancements", label: "Should SABI include:", type: "multiselect", optional: true,
        options: ["Discussion questions", "Practice activities", "Visual descriptions", "Real-life examples", "Assessment questions", "Homework slide", "Reflection prompts", "Teacher speaking notes"],
      },
      { key: "referenceMaterials", label: "Lesson plans, curriculum materials, or teaching references (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION D — Output Preferences
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-explain": {
    label: "Concept Explanation",
    placeholder: "Ask SABI to simplify or use a different analogy...",
    endpoint: "/api/tools/explain",
    fields: [
      // SECTION A — Class Information
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 4, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Concept or topic to explain", type: "text", placeholder: "e.g. Photosynthesis" },
      { key: "strugglePoint", label: "Specific part students struggle with (optional)", type: "text", optional: true, placeholder: "e.g. Why plants need sunlight" },
      {
        key: "curriculum", label: "Curriculum to align with", type: "select",
        options: [
          "Sierra Leone National Curriculum", "Universal Basic Education", "British National Curriculum",
          "Liberia National Curriculum", "American Curriculum", "Montessori Curriculum",
          "Cambridge Assessment International Education", "WAEC", "Competence Based Curriculum", "Others",
        ],
      },
      // SECTION B — Explanation Style
      {
        key: "explanationTypes", label: "Type of explanation", type: "multiselect",
        options: ["Simple explanation", "Step-by-step explanation", "Real-life example", "Storytelling approach", "Analogy/comparison", "Visual description", "Practical classroom demonstration", "Question-and-answer explanation"],
      },
      {
        key: "learnerLevel", label: "Learner level to target", type: "select",
        options: ["Beginner", "Basic understanding", "Intermediate", "Advanced", "Mixed ability"],
      },
      {
        key: "cognitiveFocus", label: "Cognitive focus", type: "select",
        options: ["Basic understanding", "Application/problem solving", "Critical thinking", "Exam preparation", "Mixed focus"],
      },
      // SECTION C — Classroom Context
      {
        key: "classSize", label: "Approximate class size", type: "select",
        options: ["Under 20", "20–40", "40–60", "60+"],
      },
      {
        key: "challenges", label: "Classroom challenges SABI should consider", type: "multiselect", optional: true,
        options: ["Mixed-ability learners", "Low literacy levels", "Language barriers", "Low participation", "Limited materials", "Limited time", "Large class size"],
      },
      { key: "differentiated", label: "Include differentiated explanation strategies?", type: "toggle" },
      // SECTION D — Output Preferences
      { key: "includeLocalExamples", label: "Include local or culturally relevant examples?", type: "toggle" },
      { key: "includeMisconceptions", label: "Include common misconceptions?", type: "toggle" },
      { key: "includeDiscussionQuestions", label: "Include classroom discussion questions?", type: "toggle" },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-project": {
    label: "Project Activity",
    placeholder: "Ask SABI to adapt for different resources...",
    endpoint: "/api/tools/project",
    fields: [
      // SECTION A — Class Information
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 5, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject / learning area", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Project topic or theme", type: "text", placeholder: "e.g. Renewable Energy" },
      {
        key: "curriculum", label: "Curriculum to align with", type: "select",
        options: [
          "Sierra Leone National Curriculum", "Universal Basic Education", "British National Curriculum",
          "Liberia National Curriculum", "American Curriculum", "Montessori Curriculum",
          "Cambridge Assessment International Education", "WAEC", "Competence Based Curriculum", "Others",
        ],
      },
      // SECTION B — Project Design
      {
        key: "projectType", label: "Type of project", type: "select",
        options: ["STEAM challenge", "Group project", "Inquiry-based project", "Community project", "Innovation challenge", "Practical experiment", "Design-thinking activity", "Research project", "Presentation/exhibition project"],
      },
      {
        key: "finalProduct", label: "What should students produce or demonstrate?", type: "select",
        options: ["Presentation", "Prototype/model", "Poster/display", "Written report", "Demonstration", "Community solution", "Experiment results", "Creative product"],
      },
      {
        key: "projectDuration", label: "How long should this project run?", type: "select",
        options: ["Single lesson", "1 week", "2 weeks", "1 month", "Multi-phase project"],
      },
      {
        key: "skillsFocus", label: "Skills this project should prioritize", type: "multiselect",
        options: ["Critical thinking", "Creativity", "Collaboration", "Communication", "Problem solving", "Leadership", "Research skills", "Practical application"],
      },
      { key: "referenceMaterials", label: "Reference materials — lesson plan, scheme of work, project brief (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION C — Classroom Reality
      {
        key: "classSize", label: "Approximate class size", type: "select",
        options: ["Under 20", "20–40", "40–60", "60+"],
      },
      {
        key: "materials", label: "Materials or resources available", type: "multiselect", optional: true,
        options: ["Paper/cardboard", "Bottles/plastic containers", "Chalkboard", "Markers", "Simple science materials", "Phones/devices", "Internet access", "No materials", "Others"],
      },
      {
        key: "challenges", label: "Classroom challenges SABI should consider", type: "multiselect", optional: true,
        options: ["Limited materials", "Large class size", "Mixed-ability learners", "Limited time", "Low participation", "Limited internet/electricity", "Language barriers", "Others"],
      },
      // SECTION D — Output Preferences
      {
        key: "includeElements", label: "What should SABI include?", type: "multiselect", optional: true,
        options: ["Group role suggestions", "Assessment rubric", "Reflection questions", "Real-life/local examples", "Presentation guidance", "Safety considerations"],
      },
      {
        key: "complexity", label: "Project complexity level", type: "select",
        options: ["Beginner", "Basic", "Intermediate", "Advanced", "Mixed ability"],
      },
      {
        key: "outputFormat", label: "Output format", type: "select",
        options: ["Project overview only", "Structured project plan", "Full classroom implementation guide", "Multi-week project roadmap"],
      },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-exercise": {
    label: "Exercise Sheet",
    placeholder: "Ask SABI to add more questions or increase difficulty...",
    endpoint: "/api/tools/practice",
    fields: [
      // SECTION A — Class Information
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 3, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Topic students are practicing", type: "text", placeholder: "e.g. Fractions" },
      { key: "subtopic", label: "Sub-topic or skill focus (optional)", type: "text", optional: true, placeholder: "e.g. Adding fractions with unlike denominators" },
      {
        key: "curriculum", label: "Curriculum to align with", type: "select",
        options: [
          "Sierra Leone National Curriculum", "Universal Basic Education", "British National Curriculum",
          "Liberia National Curriculum", "American Curriculum", "Montessori Curriculum",
          "Cambridge Assessment International Education", "WAEC", "Competence Based Curriculum", "Others",
        ],
      },
      // SECTION B — Practice Type
      {
        key: "practiceTypes", label: "Type of practice material", type: "multiselect",
        options: ["Classwork", "Homework", "Revision sheet", "Worksheet", "Group activity", "Exam-style questions", "Quick practice", "End-of-topic practice"],
      },
      {
        key: "difficultyLevel", label: "Difficulty level", type: "select",
        options: ["Beginner", "Basic", "Intermediate", "Advanced", "Mixed difficulty"],
      },
      {
        key: "numQuestions", label: "Number of questions/tasks", type: "select",
        options: ["5", "10", "15", "20+", "Custom"],
      },
      { key: "referenceMaterials", label: "Worksheets, textbook pages, or reference exercises (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION C — Learner Context
      {
        key: "understandingLevel", label: "Current student understanding level", type: "select",
        options: ["New topic", "Basic understanding", "Moderate understanding", "Strong understanding"],
      },
      {
        key: "challenges", label: "Classroom challenges SABI should consider", type: "multiselect", optional: true,
        options: ["Mixed-ability learners", "Low literacy levels", "Large class size", "Limited time", "Limited materials", "Language barriers", "Low participation"],
      },
      { key: "differentiated", label: "Include differentiated tasks?", type: "toggle" },
      // SECTION D — Output Preferences
      {
        key: "outputFormat", label: "Output format", type: "select",
        options: ["Questions only", "Questions with answers", "Questions with step-by-step solutions", "Teacher marking guide"],
      },
      { key: "includeLocalExamples", label: "Include real-life or local examples?", type: "toggle" },
      { key: "includeVisualTasks", label: "Include visual/activity-based tasks where appropriate?", type: "toggle" },
      {
        key: "skillFocus", label: "The practice should focus more on:", type: "select",
        options: ["Recall and memory", "Understanding concepts", "Problem solving", "Critical thinking", "Mixed skills"],
      },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-grade": {
    label: "Grading Rubric",
    placeholder: "Ask SABI to adjust criteria or scoring...",
    endpoint: "/api/tools/grade",
    fields: [
      // SECTION A — Class Information
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 5, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject / learning area", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      {
        key: "workType", label: "Type of student work being evaluated", type: "select",
        options: ["Assignment", "Essay", "Worksheet", "Project", "Presentation", "Practical activity", "Group work", "Oral assessment", "Exam/test", "Participation"],
      },
      { key: "topic", label: "Topic, competency, or skill being assessed", type: "text", placeholder: "e.g. Scientific investigation skills" },
      {
        key: "curriculum", label: "Curriculum or assessment framework", type: "select",
        options: [
          "Sierra Leone National Curriculum", "Universal Basic Education", "British National Curriculum",
          "Liberia National Curriculum", "American Curriculum", "Montessori Curriculum",
          "Cambridge Assessment International Education", "WAEC", "Competence Based Curriculum", "Others",
        ],
      },
      // SECTION B — Evaluation Structure
      {
        key: "gradingSupportTypes", label: "Type of grading support", type: "multiselect",
        options: ["Marking scheme", "Rubric", "Performance criteria", "Competency framework", "Scoring guide", "Peer assessment guide", "Self-assessment guide", "Others"],
      },
      {
        key: "assessmentFocus", label: "Assessment focus", type: "multiselect",
        options: ["Accuracy", "Creativity", "Critical thinking", "Problem solving", "Communication", "Collaboration", "Practical application", "Research quality", "Presentation skills"],
      },
      {
        key: "detailLevel", label: "How detailed should the framework be?", type: "select",
        options: ["Basic grading guide", "Standard rubric", "Detailed competency rubric", "Full performance framework"],
      },
      {
        key: "gradingScale", label: "Grading scale", type: "select",
        options: ["Percentage (%)", "Letter grades", "1–5 scale", "1–10 scale", "Competency levels", "Custom grading system"],
      },
      // SECTION C — Classroom Context
      {
        key: "contextFactors", label: "Contextual factors SABI should consider", type: "multiselect", optional: true,
        options: ["Mixed-ability learners", "Large class size", "Group-based work", "Low literacy levels", "Limited project materials", "Limited assessment time", "Language barriers"],
      },
      { key: "differentiated", label: "Include differentiated evaluation considerations?", type: "toggle" },
      // SECTION D — Reference Materials
      { key: "referenceMaterials", label: "Assignments, rubrics, exam papers, or grading criteria (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION E — Output Preferences
      {
        key: "includeElements", label: "Should SABI include:", type: "multiselect", optional: true,
        options: ["Teacher feedback suggestions", "Common mistakes to watch for", "Student self-reflection prompts", "Improvement recommendations", "Exemplary response indicators"],
      },
      {
        key: "outputFormat", label: "Output format", type: "select",
        options: ["Simple marking guide", "Structured rubric", "Competency framework", "Full grading and feedback package"],
      },
      { key: "studentName", label: "Student name (optional)", type: "text", optional: true, placeholder: "e.g. Foday David Kamara" },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-feedback": {
    label: "Student Feedback",
    placeholder: "Ask SABI to adjust the tone or add specific comments...",
    endpoint: "/api/tools/feedback",
    fields: [
      // SECTION A — Class Information
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 5, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject / learning area", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      {
        key: "workType", label: "Type of work or performance", type: "select",
        options: ["Assignment", "Essay", "Worksheet", "Project", "Presentation", "Group work", "Practical activity", "Participation", "Exam/test", "General performance"],
      },
      { key: "studentName", label: "Student name (optional)", type: "text", optional: true, placeholder: "e.g. Foday David Kamara" },
      { key: "topic", label: "Topic, competency, or skill assessed", type: "text", placeholder: "e.g. Scientific investigation skills" },
      // SECTION B — Performance Context
      {
        key: "strengths", label: "Strengths the feedback should recognize", type: "multiselect",
        options: ["Creativity", "Accuracy", "Participation", "Critical thinking", "Teamwork", "Communication", "Problem solving", "Effort", "Leadership", "Others"],
      },
      {
        key: "improvementAreas", label: "Areas that need improvement", type: "multiselect",
        options: ["Understanding concepts", "Organization", "Communication", "Accuracy", "Participation", "Time management", "Problem solving", "Collaboration", "Confidence", "Others"],
      },
      {
        key: "tone", label: "Tone the feedback should use", type: "select",
        options: ["Encouraging", "Professional", "Supportive", "Motivational", "Balanced"],
      },
      // SECTION C — Reference Materials
      { key: "referenceMaterials", label: "Student work, assessment sheets, rubrics, or teacher notes (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION D — Output Preferences
      {
        key: "feedbackTypes", label: "Type of feedback", type: "multiselect",
        options: ["Student feedback comments", "Parent-facing summary", "Improvement recommendations", "Reflection questions", "Report card comments", "Oral feedback guidance"],
      },
      {
        key: "detailLevel", label: "How detailed should the feedback be?", type: "select",
        options: ["Short comment", "Standard feedback", "Detailed growth feedback", "Full feedback package"],
      },
      {
        key: "includeElements", label: "Should SABI include:", type: "multiselect", optional: true,
        options: ["Actionable next steps", "Encouragement statements", "Growth goals", "Learning strategies", "Self-reflection prompts"],
      },
      {
        key: "outputFormat", label: "Output format", type: "select",
        options: ["Paragraph comments", "Bullet-point feedback", "Structured feedback sections", "Full feedback report"],
      },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "Simple English", "French", "Kinyarwanda", "Others"],
      },
    ],
  },
  "sabi-reflect": {
    label: "Reflection",
    placeholder: "Ask SABI to expand on any area...",
    endpoint: "/api/tools/reflect",
    fields: [
      // SECTION A — Lesson / Class Context
      { key: "grade", label: "Grade / Class", type: "text", placeholder: "e.g. Grade 5, JSS 2, Senior Secondary 1" },
      {
        key: "subject", label: "Subject / learning area", type: "select",
        options: [
          "Mathematics", "Science", "English Language", "Information and Communication Technology",
          "Cost Accounting", "Financial Accounting", "Further Mathematics", "Agricultural Science", "Arabic",
          "Arts", "Basic Science and Technology", "Basic Technology", "Biology", "Business Studies", "Chemistry",
          "Chinese", "Christian Religious Studies", "Citizenship Education", "Clothing and Textiles", "Coding",
          "Commerce", "Computer Science/Information Technology", "Creative Arts", "Design and Technology", "Drama",
          "Economic", "Engineering", "English Literature", "Food and Nutrition", "French", "Geography", "Government",
          "History", "Home Economics/Management", "(ICT) Information and Communication Technology", "Innovation",
          "Islamic Studies", "Lego Robotics", "Music", "Physical Education", "Physics", "Psychology", "Robotics",
          "General Science", "Social Studies", "Special Need Education", "Technical Drawing", "Theatre Arts",
          "Vocational Studies", "Woodwork", "Communication for Impact", "Data and Decisions", "Project Management",
          "Entrepreneurial Leadership", "3D Design", "IoT Engineering", "Software Development", "Others",
        ],
      },
      { key: "topic", label: "Lesson, topic, or activity to reflect on", type: "text", placeholder: "e.g. Introduction to Photosynthesis" },
      {
        key: "experienceType", label: "Type of classroom experience", type: "select",
        options: ["Lesson delivery", "Student participation", "Group activity", "Assessment results", "Project implementation", "Classroom management", "Practical activity", "Revision session"],
      },
      // SECTION B — Reflection Inputs
      {
        key: "outcomeRating", label: "How did it generally go?", type: "select",
        options: ["Very successful", "Mostly successful", "Mixed results", "Challenging", "Very difficult"],
      },
      {
        key: "whatWorkedWell", label: "What worked well?", type: "multiselect",
        options: ["Student participation", "Understanding of concepts", "Group collaboration", "Classroom management", "Practical activities", "Discussion quality", "Time management", "Assessment performance", "Others"],
      },
      {
        key: "challenges", label: "What challenges or difficulties emerged?", type: "multiselect",
        options: ["Low participation", "Limited understanding", "Time constraints", "Classroom management", "Limited materials", "Language barriers", "Mixed-ability challenges", "Assessment difficulties", "Others"],
      },
      {
        key: "learningPatterns", label: "Student learning patterns you noticed", type: "multiselect",
        options: ["Strong understanding", "Misconceptions", "Uneven participation", "Difficulty applying concepts", "Low confidence", "Strong collaboration", "Need for reinforcement", "Fast progression"],
      },
      {
        key: "reflectionFocus", label: "What would you like help reflecting on most?", type: "select",
        options: ["Improving lesson delivery", "Increasing participation", "Strengthening understanding", "Better assessment strategies", "Classroom management", "Differentiation strategies", "Project implementation", "Teaching confidence"],
      },
      // SECTION C — Reference Materials
      { key: "referenceMaterials", label: "Lesson plans, student work, or observation notes (optional)", type: "textarea", optional: true, placeholder: "Paste or summarize any reference material SABI should use..." },
      // SECTION D — Output Preferences
      {
        key: "reflectionSupportTypes", label: "Type of reflection support", type: "multiselect",
        options: ["Reflection summary", "Improvement suggestions", "Instructional adjustment ideas", "Student support recommendations", "Participation strategies", "Follow-up lesson suggestions", "Professional growth insights"],
      },
      {
        key: "tone", label: "Tone SABI should use", type: "select",
        options: ["Encouraging", "Reflective", "Professional", "Coaching-oriented", "Balanced"],
      },
      {
        key: "detailLevel", label: "How detailed should the reflection be?", type: "select",
        options: ["Quick reflection summary", "Standard reflection analysis", "Detailed instructional reflection", "Full reflective improvement report"],
      },
      {
        key: "outputLanguage", label: "Output language", type: "select",
        options: ["English", "French", "Arabic", "Others"],
      },
    ],
  },
};

const getConfig = (slug: string): ToolConfig => {
  return TOOL_CONFIG[slug] || {
    label: slug.split("-").map((w: string) => w[0].toUpperCase() + w.slice(1)).join(" "),
    placeholder: "Describe what you need...",
    endpoint: "/api/tools/plan",
    fields: [
      { key: "grade", label: "Grade / Class", placeholder: "e.g. Primary 5" },
      { key: "subject", label: "Subject", placeholder: "e.g. Mathematics" },
      { key: "topic", label: "Topic", placeholder: "e.g. Fractions" },
      { key: "objectives", label: "Learning Objectives", placeholder: "What should students learn?" },
    ],
  };
};

type Message = { role: "assistant" | "user"; content: string };

function ToolDetail() {
  const { slug } = Route.useParams();
  const config = getConfig(slug);

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm SABI. Fill in the details below and I'll generate your ${config.label} instantly.` },
  ]);
  const [form, setForm] = useState<Record<string, string>>(() => defaultFormForConfig(config));
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [showForm, setShowForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset form/output whenever the person switches to a different tool.
  useEffect(() => {
    setForm(defaultFormForConfig(config));
    setOutput("");
    setShowForm(true);
    setMessages([
      { role: "assistant", content: `Hi! I'm SABI. Fill in the details below and I'll generate your ${config.label} instantly.` },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const buildPayload = (extra?: Record<string, string>) => {
    const payload: Record<string, string> = {};
    config.fields.forEach(f => {
      payload[f.key] = resolveFieldValue(f, form);
    });
    return { ...payload, ...extra };
  };

  const handleGenerate = async () => {
    const required = config.fields.filter(f => !isFieldOptional(f));
    const hasRequired = required.every(f => resolveFieldValue(f, form).trim());

    if (!hasRequired) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Please fill in all required fields before generating.",
      }]);
      return;
    }

    setLoading(true);
    setShowForm(false);

    const userMessage = config.fields
      .filter(f => resolveFieldValue(f, form))
      .map(f => `${f.label}: ${resolveFieldValue(f, form)}`)
      .join("\n");

    setMessages(prev => [
      ...prev,
      { role: "user", content: userMessage },
      { role: "assistant", content: `Generating your ${config.label}...` },
    ]);

    try {
      const res = await fetch(`http://127.0.0.1:8000${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      const data = await res.json();
      setOutput(data.output);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", content: `Your ${config.label} is ready! Check the preview on the right. What would you like to refine?` },
      ]);
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "assistant", content: "Something went wrong. Make sure the backend is running on port 8000." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || !output) return;
    const question = followUp;
    setFollowUp("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: question }]);

    try {
      const res = await fetch(`http://127.0.0.1:8000${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildPayload({
            refinementRequest: `Previous output:\n${output}\n\nTeacher request: ${question}`,
          })
        ),
      });
      const data = await res.json();
      setOutput(data.output);
      setMessages(prev => [...prev, { role: "assistant", content: "Updated! Check the preview on the right." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="size-4" /> All tools
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left — chat + form */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col h-[70vh] lg:h-[calc(100vh-10rem)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-[oklch(0.4_0.25_300)] grid place-items-center text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight leading-none">{config.label}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Powered by SABI AI</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "assistant"
                      ? "bg-muted rounded-tl-sm"
                      : "ml-auto bg-primary text-primary-foreground rounded-tr-sm"
                  }`}
                >
                  {msg.content}
                </div>
              ))}

              {showForm && (
                <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
                  {config.fields.map(field => {
                    const type = field.type || "text";
                    const selectedValues = (form[field.key] || "")
                      .split(",")
                      .map(v => v.trim())
                      .filter(Boolean);

                    return (
                      <div key={field.key}>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {field.label}
                        </label>

                        {type === "text" && (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={form[field.key] || ""}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}

                        {type === "textarea" && (
                          <textarea
                            placeholder={field.placeholder}
                            value={form[field.key] || ""}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            rows={3}
                            className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          />
                        )}

                        {type === "select" && (
                          <>
                            <select
                              value={form[field.key] || field.options?.[0] || ""}
                              onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                              className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            {NEEDS_FOLLOW_UP_TEXT.has(form[field.key] || "") && (
                              <input
                                type="text"
                                placeholder="Please specify"
                                value={form[`${field.key}Other`] || ""}
                                onChange={e => setForm(prev => ({ ...prev, [`${field.key}Other`]: e.target.value }))}
                                className="mt-2 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            )}
                          </>
                        )}

                        {type === "multiselect" && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {field.options?.map(opt => {
                              const active = selectedValues.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() =>
                                    setForm(prev => {
                                      const current = (prev[field.key] || "")
                                        .split(",")
                                        .map(v => v.trim())
                                        .filter(Boolean);
                                      const next = active
                                        ? current.filter(v => v !== opt)
                                        : [...current, opt];
                                      return { ...prev, [field.key]: next.join(", ") };
                                    })
                                  }
                                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                                    active
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background border-border text-muted-foreground hover:border-foreground/40"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {type === "toggle" && (
                          <div className="mt-1.5 flex gap-2">
                            {["Yes", "No"].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setForm(prev => ({ ...prev, [field.key]: opt }))}
                                className={`flex-1 text-sm font-semibold py-2 rounded-lg border transition-colors ${
                                  (form[field.key] || "No") === opt
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-border text-muted-foreground hover:border-foreground/40"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Generating..." : `Generate ${config.label}`}
                  </button>
                </div>
              )}

              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-xs text-primary hover:underline"
                >
                  ← Edit inputs
                </button>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border">
              <div className="flex items-end gap-2 bg-muted rounded-2xl p-2">
                <textarea
                  placeholder={output ? config.placeholder : "Fill in the form above to get started..."}
                  rows={1}
                  value={followUp}
                  disabled={!output || loading}
                  onChange={e => setFollowUp(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleFollowUp();
                    }
                  }}
                  className="flex-1 bg-transparent text-sm focus:outline-none resize-none py-2 disabled:opacity-40"
                />
                <button
                  onClick={handleFollowUp}
                  disabled={loading || !output || !followUp.trim()}
                  className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right — output preview */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl overflow-hidden flex flex-col h-[70vh] lg:h-[calc(100vh-10rem)]">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/30 shrink-0">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Preview · {config.label}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                disabled={!output}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary px-3 py-1.5 rounded-lg hover:bg-primary-soft transition-colors disabled:opacity-40"
              >
                <Download className="size-4" /> Copy
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
              {!output && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="size-10 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Fill in the form and click Generate to see your {config.label} here.
                  </p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                  <p className="text-muted-foreground text-sm">
                    SABI is generating your {config.label}...
                  </p>
                </div>
              )}
              {output && !loading && (
  <div className="max-w-[65ch] mx-auto prose prose-sm prose-neutral dark:prose-invert">
    <ReactMarkdown>{output}</ReactMarkdown>
  </div>
)}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}