from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SABI_CONTEXT = """
You are SABI, an AI-powered teacher infrastructure platform built specifically for African educators.
SABI stands beside teachers — it does not replace them.

STRICT OUTPUT RULES — follow these without exception:
- NO emojis anywhere in the output. Not a single one.
- NO emoji symbols of any kind (no stars, checkmarks as symbols, lightning bolts, etc.)
- Use only plain text, markdown headers, tables, and bullet points
- Tables must use proper markdown pipe format
- Keep language professional, warm, and teacher-friendly

Every output must:
- Be practical and immediately usable in real African classrooms
- Account for limited resources (limited printing, large classes of 40+ students, mixed ability)
- Use local, culturally relevant examples (markets, farming, community life, local names like Amara, Kofi, Fatima, Ngozi, Chidi, Emeka, Aisha, Yusuf)
- Respect teacher expertise and professional judgment
- Follow the CLA (Central Leadership Academy) learning philosophy where relevant
- Align with competency-based curriculum frameworks used across Africa
"""

# ── Request Models ──────────────────────────────────────────────────────────

class BaseRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "45 minutes"
    objectives: str
    curriculum: str = ""
    context: str = ""

class DiagnoseRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    objectives: str
    curriculum: str = ""
    context: str = ""

class UnitRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "4 weeks"
    objectives: str
    curriculum: str = ""
    context: str = ""

class SlidesRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "8 slides"
    objectives: str
    curriculum: str = ""
    context: str = ""

class ExplainRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    objectives: str
    context: str = ""

class ProjectRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "4 weeks"
    objectives: str
    curriculum: str = ""
    context: str = ""

class PracticeRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "15 questions"
    objectives: str
    context: str = ""

class CheckRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "5 questions"
    objectives: str
    context: str = ""

class GradeRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    duration: str = "50 marks"
    objectives: str
    context: str = ""

class FeedbackRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    objectives: str
    context: str = ""

class ReflectRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    objectives: str
    context: str = ""

class CraftRequest(BaseModel):
    grade: str
    subject: str
    topic: str
    objectives: str
    context: str = ""


# ── Tool 1: SABI Plan ───────────────────────────────────────────────────────

@app.post("/api/tools/plan")
async def sabi_plan(request: BaseRequest):
    dur = request.duration.split()[0] if request.duration else "45"
    try:
        total = int(dur)
        explore = max(5, round(total * 0.15))
        build = max(15, round(total * 0.45))
        implement = max(8, round(total * 0.25))
        closure = total - explore - build - implement
    except:
        explore, build, implement, closure = 5, 20, 12, 5

    prompt = f"""{SABI_CONTEXT}

Generate a complete, curriculum-aligned SABI Lesson Plan.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Topic: {request.topic}
- Duration: {request.duration}
- Learning Objectives: {request.objectives}
- Curriculum: {request.curriculum or "General / Adaptable"}
- Classroom Context: {request.context or "Standard African classroom, mixed ability"}

Use this EXACT structure. No emojis anywhere.

# SABI Lesson Plan

---

## Lesson Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Topic | {request.topic} |
| Duration | {request.duration} |
| Curriculum | {request.curriculum or "General / Adaptable"} |
| Classroom Context | {request.context or "Standard classroom"} |

---

## Learning Outcomes

[2-3 broad outcome statements. Format: "Learners are able to..." — what they can demonstrate by end of lesson]

---

## Learning Objectives

By the end of this lesson, students will be able to:

[4-5 specific measurable objectives using action verbs: Define, Identify, Construct, Apply, Analyse, Compare, Write, Explain, Distinguish, Interpret]

---

## Competencies Developed

- Effective Communication Skills
- Analytical Skills
- Creativity and Innovation Skills
[Add subject-specific competencies relevant to this topic]

---

## Materials and Resources

| Item | Low-Resource Alternative |
|---|---|
[List all materials. Always include at least one free online resource URL where relevant. Mark items that require printing clearly.]

---

## Assessment Strategies

| Strategy | Description |
|---|---|
| Classwork | [How classwork will be used this lesson] |
| Oral Questions | [3 specific questions to ask during the lesson] |
| Individual Work | [Specific individual task] |
| Exit Ticket | [Exact exit ticket question or task] |
| Homework | [Optional homework — mark clearly as optional] |

---

## CLA Learning Cycle

### EXPLORE — Introduction and Activation ({explore} mins)

[Engaging hook that activates prior knowledge. Connect to students everyday life using a local African scenario — market, farm, family, community. Include:
- Exact teacher instructions (what to say and do)
- Student activity (what students do)
- Key questions to ask (2-3 guiding questions — do not give answers away)
This phase: students observe, question, and connect to real life.]

---

### BUILD — Main Teaching Activity ({build} mins)

[Step-by-step teaching sequence structured as numbered steps. For each step include:
- What the teacher says and writes on the board
- What students do and respond
- At least 2 worked examples using local African names and contexts
- A memory technique or chant where appropriate
- A quick oral drill or whole-class check mid-way through]

---

### IMPLEMENT — Student Practice ({implement} mins)

**Section A — Foundation** (All students attempt this)
[3-4 straightforward questions or tasks directly applying what was just taught]

**Section B — Application** (On-track students)
[3-4 word problems or applied tasks using local African contexts — names, markets, farms, schools]

**Section C — Challenge** (Advanced / fast finishers)
[1-2 higher-order thinking tasks — analysis, evaluation, or creative application]

Teacher actions during practice:
- Walk the room — do not sit
- Quietly support struggling students without drawing attention
- Use thumbs up / sideways / down mid-practice to gauge understanding

---

## Differentiation

| Learner Group | Strategy |
|---|---|
| Struggling learners | [Specific support — reduced tasks, peer pairing, board reference] |
| On-track learners | [Standard expectation — complete all sections] |
| Advanced learners | [Extension — Section C plus independent challenge] |
| Large class (40+ students) | [Specific management strategy for large African classrooms] |

---

## Closure — Wrap-Up ({closure} mins)

[How to end the lesson well. Include:
- A "Teach It Back" moment — student summarises to class
- Connection to next lesson
- Any homework instruction if applicable]

---

## Teacher Notes

[Important reminders, common misconceptions students have about this topic, preparation tips, and any safety or sensitivity considerations. No emojis.]

---

## Cross-Curricular Links

[Brief connections to 2-3 other subjects where this topic naturally connects]
""".format(
    explore=explore, build=build, implement=implement, closure=closure
)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 2: SABI Diagnose ───────────────────────────────────────────────────

@app.post("/api/tools/diagnose")
async def sabi_diagnose(request: DiagnoseRequest):
    prompt = f"""{SABI_CONTEXT}

Generate a SABI Diagnostic — a structured tool to help a teacher understand learner readiness BEFORE teaching. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Topic to be taught: {request.topic}
- What the teacher wants to understand: {request.objectives}
- Curriculum: {request.curriculum or "General"}
- Context: {request.context or "Standard African classroom"}

# SABI Diagnose — {request.topic}

---

## Lesson Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Topic | {request.topic} |
| Purpose | Pre-teaching diagnostic |

---

## Learning Outcomes

[What the teacher will understand about their learners after running this diagnostic]

---

## Competencies Assessed

- Effective Communication Skills
- Analytical Skills
[Add relevant subject competencies]

---

## Prior Knowledge Required

[List 4-6 things students should already know or be able to do before this topic. These are what you are checking for.]

---

## Diagnostic Activity (10-15 minutes)

[A quick, low-resource classroom activity that reveals what students know. Include exact teacher instructions and student task. Suitable for large African classrooms.]

---

## Diagnostic Questions

[10 carefully graded questions. Start easy, build to complex. Mix: oral, written, practical.
For each question include: the question, the expected correct response, and what a wrong answer reveals.]

| # | Question | Expected Response | If Wrong — This Suggests |
|---|---|---|---|
[Fill 10 rows]

---

## Reading the Results

| Result Pattern | What It Means | Recommended Action |
|---|---|---|
| Most students answer correctly | Ready to proceed | Begin the unit as planned |
| Mixed results | Partial readiness | Brief review of prerequisites before proceeding |
| Most students struggle | Not yet ready | Reteach prerequisite skills first |

---

## Common Gaps and Misconceptions

[5 typical misconceptions or knowledge gaps students bring to this topic. For each: name the misconception, explain why students develop it, suggest how to address it.]

---

## Grouping Recommendation

After the diagnostic, group students into:
- Group A (Ready): [Description and next steps]
- Group B (Nearly there): [Description and support needed]
- Group C (Needs prerequisite review): [Description and what to reteach]

---

## Assessment Strategies

| Strategy | How to Use |
|---|---|
| Observation | [What to watch for during the diagnostic] |
| Oral responses | [How to collect and read oral responses] |
| Written responses | [How to quickly scan written responses] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 3: SABI Unit ───────────────────────────────────────────────────────

@app.post("/api/tools/unit")
async def sabi_unit(request: UnitRequest):
    prompt = f"""{SABI_CONTEXT}

Generate a SABI Unit Series — a complete scheme of work sequencing instruction across multiple lessons. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Unit Topic: {request.topic}
- Duration: {request.duration}
- Learning Goals: {request.objectives}
- Curriculum: {request.curriculum or "General / Adaptable"}
- Context: {request.context or "Standard African classroom"}

# SABI Unit Series — {request.topic}

---

## Unit Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Unit Topic | {request.topic} |
| Duration | {request.duration} |
| Curriculum | {request.curriculum or "General / Adaptable"} |

---

## Learning Outcomes

[3-4 broad outcomes. Format: "Learners are able to..."]

---

## Unit Learning Objectives

[5-7 specific, measurable objectives for the full unit using action verbs]

---

## Competencies Developed

- Effective Communication Skills
- Analytical Skills
- Creativity and Innovation Skills
[Add subject-specific competencies]

---

## Prerequisite Knowledge

[What students must know before starting this unit — list 4-5 prerequisites]

---

## Unit Sequence

| Lesson | Title | Key Focus | Core Activity | Assessment Moment |
|---|---|---|---|---|
[Create a lesson-by-lesson breakdown for the full duration. Each row = one lesson.]

---

## Key Concepts and Vocabulary

| Term | Simple Definition | Example from African Context |
|---|---|---|
[8-12 key terms students will learn during this unit]

---

## Unit Assessment Plan

| Stage | Assessment Type | What to Look For |
|---|---|---|
| Beginning of unit | Diagnostic | [Prior knowledge check] |
| Mid-unit | Formative | [Progress check — specific tasks] |
| End of unit | Summative | [Final assessment description] |

---

## Materials and Resources

[What the teacher needs for the full unit. Group by: always needed / occasionally needed / optional]

---

## Differentiation Strategy

| Group | Approach Across the Unit |
|---|---|
| Struggling learners | [Unit-wide support strategy] |
| On-track learners | [Standard progression] |
| Advanced learners | [Enrichment and extension] |

---

## Cross-Curricular Links

[Connections to 2-3 other subjects across this unit]

---

## Assessment Strategies

| Strategy | When to Use |
|---|---|
| Assignment | [Description] |
| Individual work | [Description] |
| Quizzes | [When and how] |
| Tests | [End of unit test description] |
| Project | [Optional unit project] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 4: SABI Slides ─────────────────────────────────────────────────────

@app.post("/api/tools/slides")
async def sabi_slides(request: SlidesRequest):
    prompt = f"""{SABI_CONTEXT}

Generate SABI Slides — a complete instructional slide deck outline. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Topic: {request.topic}
- Number of Slides: {request.duration}
- Key Points: {request.objectives}
- Curriculum: {request.curriculum or "General"}
- Context: {request.context or "Standard classroom"}

# SABI Slides — {request.topic}

---

## Deck Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Topic | {request.topic} |
| Total Slides | {request.duration} |
| Estimated Delivery Time | [Calculate based on slides] |

---

## Learning Outcomes

[2-3 outcomes. "Learners are able to..."]

---

## Competencies Developed

- Effective Communication Skills
- Analytical Skills
[Add relevant competencies]

---

## Slide Breakdown

For each slide use this format:

---

### Slide [N]: [Title]

**Key Content:**
[Bullet points that go on the slide — concise, no more than 5 bullets]

**Visual:**
[Describe what image, diagram, or table would work here]

**Teacher Talking Points:**
[What the teacher explains at this slide — natural spoken language]

**Student Interaction:**
[Question, activity, or discussion prompt at this slide]

---

[Include slides for: Title, Learning Objectives, Warm-Up/Hook, Key Concept 1, Key Concept 2, Key Concept 3, Worked Example with local African context, Student Activity, Summary, Exit Question]

---

## Delivery Notes

[3-4 practical tips for presenting these slides effectively in a large African classroom]

---

## Assessment Strategies

| Strategy | How to Use with These Slides |
|---|---|
| Oral questions | [Specific to this deck] |
| Individual work | [Activity during slides] |
| Exit ticket | [Final slide exit question] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 5: SABI Explain ───────────────────────────────────────────────────

@app.post("/api/tools/explain")
async def sabi_explain(request: ExplainRequest):
    prompt = f"""{SABI_CONTEXT}

Generate a SABI Explanation — a clear, multi-layered explanation of a difficult concept. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Concept: {request.topic}
- What students find confusing: {request.objectives}
- Local Context: {request.context or "General African classroom"}

# SABI Explain — {request.topic}

---

## Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Concept | {request.topic} |
| Audience | {request.context or "Standard classroom"} |

---

## Learning Outcomes

[2 outcomes — what learners will be able to do after this explanation]

---

## Competencies Developed

- Effective Communication Skills
- Analytical Skills
[Add relevant competencies]

---

## The Core Idea in One Sentence

[The simplest possible definition — what this concept really means at its heart]

---

## Why Students Find This Difficult

[3 specific reasons this concept confuses students — name the exact misconceptions]

---

## Explanation 1 — The Everyday Analogy

[Explain using a familiar local analogy from African daily life: markets, farming, cooking, family, transport. Make it vivid, relatable, and completely free of technical language.]

---

## Explanation 2 — Step-by-Step Breakdown

[Break the concept into 4-6 numbered steps. Each step must be simple enough for a struggling student to follow without teacher help.]

---

## Explanation 3 — Visual or Physical Model

[Describe a simple diagram, demonstration, or hands-on activity using locally available materials. Include exact instructions for the teacher.]

---

## Worked Example with Local Context

[A fully worked example using African names, places, and situations. Show every step. Use the same style as the curriculum examples — clear, annotated, and student-friendly.]

---

## Common Mistakes and Corrections

| Common Mistake | What It Reveals | How to Correct It |
|---|---|---|
[4 rows — specific mistakes, not vague ones]

---

## Check Questions

[5 questions to verify understanding — range from simple recall to application. Include expected answers.]

---

## If They Still Do Not Understand

[A completely different angle or metaphor to try — a backup explanation]

---

## Assessment Strategies

| Strategy | Description |
|---|---|
| Oral questions | [Specific questions to ask after explaining] |
| Individual work | [Quick written check] |
| Classwork | [Practice task] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 6: SABI Project ───────────────────────────────────────────────────

@app.post("/api/tools/project")
async def sabi_project(request: ProjectRequest):
    prompt = f"""{SABI_CONTEXT}

Generate a SABI Project — a complete project-based learning experience following the CLA EXPLORE-BUILD-IMPLEMENT cycle. No emojis.

CLA Learning Cycle:
- EXPLORE: Students understand a real problem and its root causes. Teacher guides — does not provide answers.
- BUILD: Students design, test, and refine possible solutions.
- IMPLEMENT: Students apply their solution and reflect on impact.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Project Theme: {request.topic}
- Duration: {request.duration}
- Learning Goals: {request.objectives}
- Curriculum: {request.curriculum or "General / STEAM"}
- Resources: {request.context or "Low-resource classroom with community access"}

# SABI Project — {request.topic}

---

## Project Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Theme | {request.topic} |
| Duration | {request.duration} |
| Group Size | 3-5 students per group |
| Curriculum | {request.curriculum or "General / STEAM"} |

---

## Learning Outcomes

[3 broad outcomes. "Learners are able to..."]

---

## Competencies Developed

- Effective Communication Skills
- Analytical Skills
- Creativity and Innovation Skills
- Collaboration and Leadership
- Research and Problem Solving Skills

---

## Introduction for Teachers

[What this project develops in students. How the teacher facilitates without providing answers. The teacher guides thinking — students find solutions.]

---

## WEEK 1 — EXPLORE: Understanding the Problem

**Goal:** Help students identify a real issue they care about and understand its root causes.

### Session 1 — Introduction to the Project
**Teacher Instructions:**
[Exact steps for the teacher — how to introduce the project, the three stages, and a local problem example]

**Student Activities:**
[What students do — observe, discuss, share]

**Key Questions to Ask (do not answer these for students):**
- [Question 1]
- [Question 2]
- [Question 3]

### Session 2 — Identifying the Problem
**Teacher Instructions:**
[How to guide problem identification in school, community, environment, health, safety]

**Student Activities:**
[Observe, list, select 2-3 problems they care about]

**Teacher Note:**
[Remind students a good problem is one they can observe — not just hear about]

### Session 3 — Understanding Root Causes
**Teacher Instructions:**
[How to guide "Why does this happen?" questioning — model one example]

**Student Activities:**
[Root cause analysis — ask Why repeatedly]

**End-of-Week Output:**
Each group writes one clear problem statement: what the problem is, who it affects, why it matters.

---

## WEEK 2 — BUILD: Designing Solutions

**Goal:** Help students generate, evaluate, and plan realistic solutions.

### Session 4 — Generating Ideas
**Teacher Instructions:**
[Brainstorming facilitation — no idea is wrong, quantity matters]

**Student Activities:**
[Generate as many solutions as possible — no evaluation yet]

**Teacher Reminder:**
Do not discuss feasibility yet. Focus on ideas.

### Session 5 — Choosing a Solution
**Teacher Instructions:**
[How to guide decision-making using these questions]

**Decision Questions:**
- Can we realistically do this with what we have?
- Will this help the people affected?
- Can we do it within the time we have?

**Student Activities:**
[Discuss strengths and limits, vote on one solution, name the project]

**End-of-Week Output:**
One selected solution per group with a clear explanation of why it was chosen.

---

## WEEK 3 — BUILD: Planning and Testing

**Goal:** Turn plans into action through making, testing, and improvement.

### Sessions 6-8 — Planning, Building, Testing
**Teacher Instructions:**
[How to supervise safely, encourage iteration, normalise mistakes as learning]

**Student Activities:**
[Build prototypes or prepare activities, test ideas, observe what works and what does not, make improvements]

**End-of-Week Output:**
Working prototype or pilot activity and notes on changes made and reasons.

---

## WEEK 4 — IMPLEMENT: Taking Action

**Goal:** Apply the solution responsibly and reflect on its impact.

### Session 9 — Taking Action
**Teacher Instructions:**
[Support and observe — facilitate responsibility and ethics]

**Student Activities:**
[Implement solution in school or community, observe responses and outcomes, take notes or photos]

### Session 10 — Reflection and Sharing
**Teacher Instructions:**
[Guide reflection using open questions — emphasise learning not perfection]

**Reflection Questions:**
- What changed because of our action?
- What worked better than expected?
- What would we improve next time?
- What did we learn about leadership and teamwork?

**Final Outputs:**
- Short presentation, poster, or demonstration
- Reflection summary — written, oral, or visual
- Evidence of action taken

---

## Assessment Approach (CLA Style)

Assessment focuses on:

| Area | What to Look For | Marks |
|---|---|---|
| Understanding of the problem | Clarity of problem statement, evidence of observation | /25 |
| Quality of thinking and decision-making | Reasoning behind solution choice, feasibility thinking | /25 |
| Collaboration and leadership | Teamwork, roles, group dynamics | /25 |
| Reflection and learning growth | Depth of reflection, honest self-assessment | /25 |
| **Total** | | **/100** |

---

## Low-Resource Adaptations

[How to run this project with no internet, minimal materials, and in a large class of 40+ students]

---

## Cross-Curricular Links

[How this project connects to at least 3 curriculum subjects]
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 7: SABI Practice ─────────────────────────────────────────────────

@app.post("/api/tools/practice")
async def sabi_practice(request: PracticeRequest):
    prompt = f"""{SABI_CONTEXT}

Generate SABI Practice — a complete, print-ready exercise sheet. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Topic: {request.topic}
- Number of Questions: {request.duration}
- Skills to Practice: {request.objectives}
- Difficulty: {request.context or "Mixed ability"}

# SABI Practice Sheet — {request.topic}

**Grade:** {request.grade} | **Subject:** {request.subject} | **Name:** _________________________ | **Date:** ___________

---

## Instructions

[Clear, simple 1-2 sentence instruction for students]

---

## Section A — Foundation
*(All students)*

[4-5 straightforward questions testing basic recall and simple application. Every student should attempt these.]

---

## Section B — Application
*(On-track students)*

[5-6 word problems using local African contexts — names like Amara, Kofi, Fatima, Ngozi, Chidi; places like markets, schools, farms, community centres]

---

## Section C — Challenge
*(Advanced learners and fast finishers)*

[2-3 higher-order questions requiring multi-step reasoning, analysis, or creative application]

---

## Create Your Own

[One open-ended task where students create their own example related to the topic]

---

## Teacher Answer Key

[Complete answers for all questions. Include worked solutions for Section B and C.]

---

## Differentiation Notes

| Group | Focus |
|---|---|
| Struggling learners | Section A only — secure the basics |
| On-track learners | Sections A and B — full worksheet |
| Advanced learners | All sections including Create Your Own |

---

## Assessment Strategies

| Strategy | Description |
|---|---|
| Classwork | Mark Section A during the lesson |
| Homework | Assign Section B as homework if not completed |
| Individual work | Section C as independent challenge |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 8: SABI Check ────────────────────────────────────────────────────

@app.post("/api/tools/check")
async def sabi_check(request: CheckRequest):
    prompt = f"""{SABI_CONTEXT}

Generate SABI Check — a formative assessment tool. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Topic Just Taught: {request.topic}
- Format: {request.duration}
- What to Check: {request.objectives}
- Context: {request.context or "Standard classroom"}

# SABI Check — {request.topic}

---

## Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Topic | {request.topic} |
| Purpose | Formative assessment — check for understanding |
| Time Required | 3-5 minutes |

---

## Learning Outcomes Checked

[What this assessment reveals about student understanding]

---

## Competencies Assessed

- Effective Communication Skills
- Analytical Skills

---

## Option A — Exit Ticket (Individual, 3-5 minutes)

[5 questions students answer in their books or on a slip of paper before leaving]

| # | Question | Type | Expected Answer |
|---|---|---|---|
| 1 | [Recall question] | Recall | [Answer] |
| 2 | [Understanding question] | Understanding | [Answer] |
| 3 | [Application question] | Application | [Answer] |
| 4 | [Connection question] | Connection | [Answer] |
| 5 | [Reflection question] | Reflection | [Answer] |

**Reading the results:** [How to quickly sort responses into: understood / nearly there / not yet]

---

## Option B — Whole-Class Oral Check (2-3 minutes)

[5 questions asked out loud — students respond with hands, thumbs, slates, or call-out. Good for large classes with limited materials.]

1. [Question] — Expected: [Answer]
2. [Question] — Expected: [Answer]
3. [Question] — Expected: [Answer]
4. [Question] — Expected: [Answer]
5. [Question] — Expected: [Answer]

**How to run it:** [Exact teacher instructions — suitable for 40+ students]

---

## Option C — Show-Me Activity (3-5 minutes)

[A physical or written response activity — students write on slates, hold up fingers, stand or sit, or call out. Describe the exact activity and what the teacher watches for.]

---

## Reading the Results

| Result | What It Means | Recommended Action |
|---|---|---|
| Most students correct | Understanding confirmed | Proceed to next lesson |
| Mixed results | Partial understanding | Brief review before moving on |
| Most students wrong | Concept not yet secure | Reteach before proceeding |

---

## Quick Re-teach Strategy

[If many students did not understand — one 3-minute re-teaching strategy to use immediately. Must be a different approach from original teaching.]

---

## Assessment Strategies

| Strategy | Description |
|---|---|
| Classwork | [How to use this as a classwork grade] |
| Individual work | [Individual follow-up task if needed] |
| Quizzes | [How this connects to a future quiz] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 9: SABI Grade ────────────────────────────────────────────────────

@app.post("/api/tools/grade")
async def sabi_grade(request: GradeRequest):
    prompt = f"""{SABI_CONTEXT}

Generate SABI Grade — a clear rubric and marking guide. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Assessment Task: {request.topic}
- Total Marks: {request.duration}
- What You Are Assessing: {request.objectives}
- Context: {request.context or "Standard assessment"}

# SABI Grade — {request.topic}

---

## Assessment Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Task | {request.topic} |
| Total Marks | {request.duration} |
| Competencies Assessed | Effective Communication, Analytical Skills |

---

## Marking Rubric

| Criterion | Excellent (Full marks) | Good (Above average) | Satisfactory (Meets minimum) | Needs Improvement | Marks |
|---|---|---|---|---|---|
[4-6 rows — criteria relevant to this specific task]

---

## Mark Scheme

[Question-by-question breakdown of how marks are allocated. Include:
- What earns full marks
- What earns partial marks
- What earns no marks
- Common acceptable alternative answers]

---

## Grade Boundaries

| Grade | Mark Range | Description |
|---|---|---|
| Distinction | [X]% and above | Exceptional understanding and application |
| Credit | [X]% - [X]% | Good understanding with minor gaps |
| Pass | [X]% - [X]% | Basic understanding demonstrated |
| Below Pass | Under [X]% | Significant gaps — intervention needed |

---

## Annotation Guide

| Symbol | Meaning |
|---|---|
| [tick] | Correct |
| [cross] | Incorrect |
| ^ | Missing point |
| sp | Spelling error |
| [arrow] | Good point — needs development |
| // | Irrelevant content |

---

## Common Errors

| Error | How Much to Penalise | Corrective Note for Student |
|---|---|---|
[5 rows — specific to this task and topic]

---

## Ready-Made Feedback Phrases

**Positive:**
- [Phrase 1]
- [Phrase 2]
- [Phrase 3]

**Constructive:**
- [Phrase 1]
- [Phrase 2]
- [Phrase 3]

---

## Assessment Strategies

| Strategy | Description |
|---|---|
| Individual work | [How to use this rubric for individual marking] |
| Peer assessment | [How students can use this rubric to assess each other] |
| Test | [How this connects to a formal test grade] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 10: SABI Feedback ───────────────────────────────────────────────

@app.post("/api/tools/feedback")
async def sabi_feedback(request: FeedbackRequest):
    prompt = f"""{SABI_CONTEXT}

Generate SABI Feedback — personalised, growth-oriented student feedback. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Task: {request.topic}
- What the student did / struggled with: {request.objectives}
- Tone: {request.context or "Encouraging and growth-focused"}

# SABI Feedback — {request.topic}

---

## Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Task | {request.topic} |
| Feedback Style | {request.context or "Encouraging, growth-focused"} |

---

## Written Feedback (For Student Book or Paper)

[4-6 sentence paragraph structured as:
1. Specific genuine strength — name exactly what was done well
2. Main area for improvement — be specific, not vague
3. One clear, actionable next step
4. Encouraging forward-looking statement]

---

## Verbal Feedback Script (For Teacher to Use)

[What the teacher says in a 1-minute conversation with the student when returning work. Natural, warm, direct. Include the exact words.]

---

## Improvement Task

[One specific short task the student can do immediately to act on the feedback. Must be achievable in 5-10 minutes.]

---

## For a Struggling Student

[Gentler version of the feedback — acknowledges effort, reduces the improvement task to one achievable step, avoids comparison]

---

## For an Advanced Student

[Feedback that pushes further — acknowledges strong performance and sets a higher challenge]

---

## Whole-Class Pattern Note

[If this feedback reflects a common issue across the class — what the teacher should address with the full group and how]

---

## Parent Communication

[2-3 sentences a teacher can share with a parent — honest, positive, actionable]

---

## Assessment Strategies

| Strategy | Description |
|---|---|
| Individual work | [Follow-up individual task based on this feedback] |
| Assignment | [Extended assignment if more practice is needed] |
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 11: SABI Reflect ─────────────────────────────────────────────────

@app.post("/api/tools/reflect")
async def sabi_reflect(request: ReflectRequest):
    prompt = f"""{SABI_CONTEXT}

Generate SABI Reflect — a structured professional teacher reflection. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- Lesson or Experience: {request.topic}
- What went well / what did not: {request.objectives}
- Focus Area: {request.context or "General teaching practice"}

# SABI Reflect — {request.topic}

---

## Reflection Overview

| Detail | Information |
|---|---|
| Grade / Class | {request.grade} |
| Subject | {request.subject} |
| Lesson / Experience | {request.topic} |
| Focus Area | {request.context or "General teaching practice"} |

---

## Reflection Snapshot

[2-3 sentence summary of what happened in the lesson or experience]

---

## What Worked Well

[3-4 specific things that went well — concrete evidence, not general praise.
For each: name it, describe the evidence that it worked.]

---

## What Could Be Improved

[3-4 honest observations about what did not work as planned.
For each: name what happened, explore why, and frame a constructive alternative.]

---

## Student Learning Analysis

| Question | Your Reflection |
|---|---|
| Who was engaged and why? | |
| Who was disengaged and what might explain it? | |
| Were learning objectives met for most students? | |
| What evidence supports your assessment? | |

---

## Key Insight

[The most important thing this experience taught you about your teaching — 2-3 sentences. Be honest.]

---

## Action Plan for Next Time

1. [Specific change to make next time — concrete and actionable]
2. [Specific change to make next time]
3. [Specific change to make next time]

---

## Professional Development Connection

[Is there a skill, strategy, or knowledge area this reflection points to? What support or learning would help you grow in this area?]

---

## Teacher Wellbeing Check

[An honest, brief check-in. How did this experience make you feel? What do you need to sustain your energy and commitment?]

---

## Closing Thought

[One short, relevant quote about teaching, growth, or resilience that fits this reflection. Attribute it properly.]
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Tool 12: SABI Craft ───────────────────────────────────────────────────

@app.post("/api/tools/craft")
async def sabi_craft(request: CraftRequest):
    prompt = f"""{SABI_CONTEXT}

You are SABI Craft — a flexible open workspace. Create exactly what the teacher asks for. No emojis.

TEACHER INPUT:
- Grade / Class: {request.grade}
- Subject: {request.subject}
- What to create: {request.topic}
- Purpose: {request.objectives}
- Requirements: {request.context or "None specified"}

Read the request carefully and produce the most complete, immediately usable version of what was asked.

If a game — create full rules, materials list, and instructions.
If a template — create a clean, fully labelled template.
If a letter or notice — write it completely.
If a quiz — create a complete quiz with answer key.
If a vocabulary activity — create a ready-to-use activity with instructions.
If a story or scenario — write it in full.
If a timetable or schedule — create a complete, formatted version.

Whatever was requested — produce it completely. Zero additional work should be needed.

Start with a title and brief description of what you have created.

At the end include:

---

## Teacher Tips

[2-3 practical tips for getting the most from this material]

---

## Variations

[2 quick ideas for adapting or extending this material for different contexts or ability levels]

---

## Assessment Strategies

[How this material can be used for assessment — classwork, homework, quiz, individual work]
"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )
    return {"output": message.content[0].text}


# ── Health Check ──────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "SABI backend running", "tools": 12, "version": "2.0"}