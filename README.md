# functions.do

The concept of functions.do is to seperate the iteration and testing of models, prompts, and evals from consuming applications.

Objectives:

- Enable the Rapid Prototyping & Iteration of AI Applications, Agents, and Workflows
- Hide the leaky abstractions of models, prompts, and settings (i.e. temperature, etc)
- Iterate & improve prompts, models, and settings
- Run Objective & Subjective evals with support for deterministic tests, LLM-as-Judge, and Human Feedback
- Optimize each function by cost, latency, and/or eval performance

Assumptions:
- 

Initial version:

- [ ] generateObject - JSON Object
- [ ] generateObject - JSON Schema
- [ ] generateObject - Array
- [ ] generateObject - Enum
- [ ] generateText as string
- [ ] list with markdown numbered list and/or json string array
- [ ] Support Typescript, JSON Schema, Zod, and simple w/ descriptions