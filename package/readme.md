# functions.do

## Introduction

AI is enabling massive transformations in business by automating tasks that traditionally required human workers. However, integrating today's large language models into existing applications and systems introduces many engineering and operational challenges. This is primarily due to the clash between the non-deterministic nature of AI versus the purely deterministic characteristics of traditional software applications and systems.

These challenges include:

- **Reliability**: Unlike traditional software that produces consistent outputs for the same inputs, AI models are inherently non-deterministic. The same prompt with identical parameters can produce different outputs each time, making it difficult to build reliable systems. This unpredictability creates significant challenges for testing, debugging, and maintaining production applications where consistency and reliability are critical requirements.

- **Accuracy**: AI systems can hallucinate, produce incorrect information, or fail in unpredictable ways. Building robust error handling, validation mechanisms, and fallback strategies becomes essential but extremely complex when the nature and frequency of errors cannot be predetermined.

- **Model Selection**: New state-of-the-art models are being released every week, each with their own pros and cons. Some excel at creativity, while others are better at logic and reasoning. Larger models generally demonstrate higher intelligence but are slower and more expensive. Smaller models can be much faster and cost-effective but possess less world knowledge and make errors more frequently.

- **Prompt Engineering**: Combining elements of psychology and communication, prompt engineering is often more art than science. Sometimes bizarre techniques (such as phrases like offering to "tip more" or threatening to "take a life") have demonstrated increased performance and accuracy, making the process unpredictable and difficult to standardize.

- **Configuration Settings**: Parameters like temperature, topK, seed, and others have complex and interconnected effects on model outputs, requiring careful tuning and expertise to optimize.

## The Solution

functions.do solves these challenges by creating a clean separation between AI capabilities and application code. By providing a cleanly defined API with strongly-typed data schema interfaces, functions.do eliminates the leaky abstractions of AI models, prompts, and settings.

This approach enables:

- Rapid prototyping and iteration of AI applications, agents, and workflows
- Abstraction of complex model details from consuming applications
- Continuous improvement of prompts, models, and settings without disrupting application code
- Objective and subjective evaluations with support for deterministic tests, LLM-as-Judge, and human feedback
- Optimization of each function by cost, latency, and/or evaluation performance


## Usage

You can use it by simply calling any function name with any arguments on the `ai` object like:

```typescript
import { ai } from 'functions.do'

const results = await ai.writeBlogPostTitles({ topic: 'automating business workflows with LLMs', audience: 'executives', count: 10 })

console.log(results)
// {
//   blogPostTitles: [
//     '10 Steps to Automate Your Business Workflows with LLMs',
//     'The Executive's Guide to LLM-Powered Process Automation',
//     'Transforming Executive Decision-Making with AI Workflows',
//     'How LLMs Are Revolutionizing C-Suite Productivity',
//     'Strategic Implementation of LLMs: An Executive Roadmap',
//     'Competitive Advantage Through Intelligent Automation',
//     'Measuring ROI on LLM Integration in Enterprise Workflows',
//     'From Boardroom to Automation: The Executive's LLM Playbook',
//     'Scaling Business Operations with AI-Driven Workflow Solutions',
//     'Future-Proofing Your Business with Intelligent LLM Systems'
//   ]
// }
```

Alternatively, you can define the return type of the function during initialization to get strongly-typed responses:

```typescript
import { AI } from 'functions.do'

const ai = AI({

  createLeanCanvas: {
      problems: ['top 3 problems the business solves'],
      customerSegments: ['target customers and users for the product'],
      uniqueValueProposition: 'clear and compelling message that states why you are different and worth buying',
      solutions: ['outline of the solutions to the identified problems'],
      unfairAdvantage: 'something that cannot be easily copied or bought',
      revenueStreams: ['revenue model, lifetime value, revenue, gross margin'],
      costStructure: ['customer acquisition costs', 'distribution costs', 'hosting', 'people', 'etc.'],
      keyMetrics: ['key activities you measure (acquisition, retention, referrals, etc.)'],
      channels: ['path to customers (inbound, outbound, viral, etc.)'],
      earlyAdopters: 'characteristics of the ideal early adopter'
    }

})


const results = await ai.createLeanCanvas({ domain: 'aws.amazon.com' })
```


Finally, you can also define the return type and override system settings for a specific function like:

```typescript
import { ai } from 'functions.do'

const results = await ai.generateLandingPage({ brand: 'Functions.do', idea: 'AI-powered Functions-as-a-Service' }, {
  model: 'anthropic/claude-3.7-sonnet:thinking',
  system: 'You an expert at generating highly-converting marketing copy for startup landing pages',
  temperature: 1.0,
  seed: 1741452228,
  schema: {
    headline: 'attention-grabbing headline that clearly states value proposition',
    subheadline: 'supporting statement that adds clarity to the headline',
    productDescription: 'concise explanation of what the product does and its benefits',
    keyFeatures: ['list of main features or benefits'],
    socialProof: ['testimonials, user counts, or other trust indicators'],
    captureForm: 'description of email capture form and call to action',
    incentive: 'what users get for joining the waitlist (early access, discount, etc.)',
    visualElements: 'description of images, videos, or other visual elements',
    faq: [{
      question: 'frequently asked question related to an objection',
      answer: 'clear answer to the question that overcomes the objection'
    }],
    launchDate: 'expected product launch date or timeline',
    callToAction: 'primary button text and action',
    secondaryAction: 'secondary button text and action'
  }
})