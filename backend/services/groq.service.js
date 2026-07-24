import '../config/env.js';
import { OpenAI } from 'openai';

const apiKey = process.env.GROQ_API_KEY;
let groq = null;

if (apiKey) {
  groq = new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  console.log('Groq client initialized successfully.');
} else {
  console.warn('WARNING: GROQ_API_KEY is not defined. The application will run in MOCK mode for AI operations.');
}

// Helper to generate mock questions if no API key is provided
const generateMockQuestions = (profile) => {
  const { jobRole, certificationLevel, skills } = profile;
  const mockTopics = skills.length > 0 ? skills : ['Core Concepts', 'Best Practices', 'System Design'];

  const questionTypes = ['MCQ', 'MSQ', 'Short', 'Long', 'Scenario', 'Logical', 'Analytical'];
  const questions = [];

  for (let i = 1; i <= 20; i++) {
    const type = questionTypes[(i - 1) % questionTypes.length];
    const topic = mockTopics[(i - 1) % mockTopics.length];

    let text = '';
    let options = [];
    let correctAnswer = '';
    let timerDuration = 60;

    switch (type) {
      case 'MCQ':
        text = `For the role of ${jobRole} (${certificationLevel}), what is the primary purpose of ${topic} in a typical modern architecture?`;
        options = ['To optimize execution speeds', 'To secure networking protocols', 'To delegate standard component lifecycle operations', 'To manage state distribution'];
        correctAnswer = options[0];
        timerDuration = 30;
        break;
      case 'MSQ':
        text = `Select the core characteristics of ${topic} that apply in an enterprise environment (Choose all that apply):`;
        options = ['High scalability & fault tolerance', 'Strict single-threaded sync execution', 'Decoupled services integration', 'Automatic compile-time reflection'];
        correctAnswer = [options[0], options[2]];
        timerDuration = 45;
        break;
      case 'Short':
        text = `Explain in brief (1-2 sentences) how ${topic} manages caching mechanisms.`;
        correctAnswer = `By storing key-value pairs in memory to avoid repeating expensive computation.`;
        timerDuration = 90;
        break;
      case 'Long':
        text = `Write a detailed explanation of a design pattern that leverages ${topic} to solve standard synchronization issues in a distributed system. Include a mock code block or pseudo-code showing implementation.`;
        correctAnswer = `Detailed pattern using locking or optimistic concurrency.`;
        timerDuration = 300;
        break;
      case 'Scenario':
        text = `A client reports that under heavy load, the database component executing ${topic} becomes unresponsive. Describe your step-by-step diagnostic process and mitigation plan.`;
        correctAnswer = `Check CPU logs, scale database read-replicas, evaluate indexes, use queue throttling.`;
        timerDuration = 240;
        break;
      case 'Logical':
        text = `If component A relies on ${topic} and has a timeout of 5s, and component B relies on A with a timeout of 3s, what is a potential race condition under load, and how would you resolve it?`;
        correctAnswer = `B times out before A. Fix by increasing B's timeout or implementing a fallback circuit breaker.`;
        timerDuration = 120;
        break;
      case 'Analytical':
        text = `Analyze the trade-offs of using ${topic} vs. an in-memory database storage system for high-throughput session state management.`;
        correctAnswer = `Discuss network latencies, memory footprint, data persistence guarantees, and horizontal scaling capacities.`;
        timerDuration = 120;
        break;
    }

    questions.push({
      text,
      type,
      options,
      correctAnswer,
      timerDuration,
      order: i,
      topic,
    });
  }

  return questions;
};

// Generates personalized questions based on profile details using Groq Llama 3
export const generateQuestions = async (profile) => {
  if (!groq) {
    console.log('Using Mock Question Generator.');
    return generateMockQuestions(profile);
  }

  try {
    const prompt = `
      You are an elite technical assessment agent. Your goal is to generate exactly 20 challenging questions for a certification candidate with the following profile:
      - Full Name: ${profile.name}
      - Job Role: ${profile.jobRole}
      - Experience: ${profile.experience} years
      - Core Skills: ${profile.skills.join(', ')}
      - Target Certification Level: ${profile.certificationLevel}

      Rules for generation:
      1. Difficulty MUST strictly match the certification level (${profile.certificationLevel}).
      2. Make sure all the questions generated are always unique and not repeated.
      3. The distribution should be dynamic: generate a mix of MCQ, MSQ, Short (Short Answer), Long (Long Answer), Scenario (Scenario Based), Logical (Logical Reasoning), and Analytical (Analytical Thinking) questions.
      4. For MCQ and MSQ questions, include an array of options (exactly 4 options).
      5. Provide a 'correctAnswer' containing the exact correct option string (for MCQ), an array of correct option strings (for MSQ), or a model rubric/ideal answer (for Short, Long, Scenario, Logical, Analytical).
      6. timerDuration MUST be in seconds matching the requirements:
         - MCQ: 30
         - MSQ: 45
         - Short: 90
         - Long: 300
         - Scenario: 240
         - Logical: 120
         - Analytical: 120
      7. Provide a relevant 'topic' for each question (e.g. "Caching", "State Management", "Concurrency").
      
      Return ONLY a JSON object of this structure:
      {
        "questions": [
          {
            "text": "The text of the question?",
            "type": "MCQ" | "MSQ" | "Short" | "Long" | "Scenario" | "Logical" | "Analytical",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A" or ["Option A", "Option C"] or "ideal answer description",
            "timerDuration": 30,
            "topic": "Topic Name"
          }
        ]
      }
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const data = JSON.parse(response.choices[0].message.content);

    // Add sorting order field
    return data.questions.map((q, idx) => ({ ...q, order: idx + 1 }));
  } catch (error) {
    console.error('Error generating questions from Groq API:', error);
    console.log('Falling back to Mock Question Generator.');
    return generateMockQuestions(profile);
  }
};

// Evaluate text answers (Short, Long, Scenario, Logical, Analytical)
export const evaluateTextAnswer = async (questionText, questionType, candidateAnswer, rubrics) => {
  if (!groq) {
    // Mock Evaluation
    if (!candidateAnswer || candidateAnswer.trim() === '') {
      return { score: 0, feedback: 'No answer was provided.' };
    }
    const score = Math.floor(Math.random() * 41) + 60; // 60 to 100
    return { score, feedback: 'The answer shows a good comprehension of the core concepts, though it could benefit from more detailed production examples.' };
  }

  try {
    const prompt = `
      You are an expert technical evaluator. Evaluate the candidate's answer based on the question and the ideal rubric answer.
      
      Question: "${questionText}"
      Question Type: ${questionType}
      Ideal Rubric Answer: "${rubrics}"
      Candidate's Answer: "${candidateAnswer || '(Unanswered / Timed out)'}"
      
      Rules for evaluation:
      1. Assign a score between 0 and 100 based on accuracy, depth, correctness, and reasoning.
      2. If candidate answer is blank or empty, score is 0.
      3. Provide a brief constructive feedback paragraph.
      
      Return ONLY a JSON object of this structure:
      {
        "score": 85,
        "feedback": "Your evaluation comments here..."
      }
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error evaluating text answer using Groq:', error);
    return { score: 50, feedback: 'Standard automatic evaluation fallback due to API connection state.' };
  }
};

// Generates the final feedback analysis report
export const generateFinalReportText = async (profile, assessmentData) => {
  if (!groq) {
    // Return mock values
    return {
      strengths: ['Solid understanding of modern workflows', 'Strong logical analysis of database caching models'],
      weaknesses: ['Needs improvement in handling edge cases under load', 'Could structure scenario-based diagrams more concisely'],
      skillGapAnalysis: [
        { skill: profile.skills[0] || 'Core Architecture', gap: 'No Gap', recommendedAction: 'Continue practice' },
        { skill: profile.skills[1] || 'State Distribution', gap: 'Minor Gap', recommendedAction: 'Read up on distributed logs and synchronization algorithms' }
      ],
      recommendations: [
        'Study system design case studies for distributed setups.',
        'Experiment with load testing tools to observe bottlenecks.'
      ],
      learningSuggestions: [
        { topic: 'Distributed Caching', resources: ['System Design Interview by Alex Xu', 'Redis Official Architecture Guides'] },
        { topic: 'Load and Concurrency Management', resources: ['Designing Data-Intensive Applications by Martin Kleppmann'] }
      ],
      performanceSummary: `Candidate ${profile.name} exhibited a strong aptitude for ${profile.jobRole} at the ${profile.certificationLevel} tier. Scoring indicates readiness for mid-to-high scale deployments, with room for improvement in high-performance edge indexing.`
    };
  }

  try {
    const prompt = `
      You are an expert talent developer and assessor. Based on the candidate's assessment performance, compile an analytical assessment report.
      
      Candidate Profile:
      - Job Role: ${profile.jobRole}
      - Level: ${profile.certificationLevel}
      - Skills: ${profile.skills.join(', ')}
      
      Performance Data:
      - Overall Score: ${assessmentData.overallScore}%
      - Questions and Answers Details (Includes individual score, question type, and text):
      ${JSON.stringify(assessmentData.questionsAnswers, null, 2)}

      Please generate:
      1. Key Strengths (array of strings, minimum 2)
      2. Weaknesses / Improvement Areas (array of strings, minimum 2)
      3. Skill Gap Analysis (for each skill in the profile, state the gap: 'No Gap', 'Minor Gap', or 'Major Gap', and recommend action)
      4. General Recommendations (array of strings)
      5. Specific Learning Suggestions (topics and links/books/resources)
      6. A detailed, professional Performance Summary text (paragraph).

      Return ONLY a JSON object of this structure:
      {
        "strengths": ["...", "..."],
        "weaknesses": ["...", "..."],
        "skillGapAnalysis": [
          { "skill": "Skill Name", "gap": "No Gap" | "Minor Gap" | "Major Gap", "recommendedAction": "Action details..." }
        ],
        "recommendations": ["...", "..."],
        "learningSuggestions": [
          { "topic": "Topic Name", "resources": ["Resource 1", "Resource 2"] }
        ],
        "performanceSummary": "Detailed summary..."
      }
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating report text from Groq:', error);
    return {
      strengths: ['Logical flow in problem solving', 'Good standard syntax and logic application'],
      weaknesses: ['Time constraints management', 'Explanation detail depth'],
      skillGapAnalysis: [{ skill: 'Technical Concepts', gap: 'Minor Gap', recommendedAction: 'Revise core principles' }],
      recommendations: ['Revise core modules.', 'Perform mock exercises with timers.'],
      learningSuggestions: [{ topic: 'Core Engineering concepts', resources: ['Standard documentation'] }],
      performanceSummary: 'The assessment was completed with standard marks. Review the recommendations to strengthen key areas.'
    };
  }
};
