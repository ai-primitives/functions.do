# functions.do

The concept of functions.do is to seperate the iteration and testing of models, prompts, and evals from consuming applications.

## Objectives:

- Enable the Rapid Prototyping & Iteration of AI Applications, Agents, and Workflows
- Hide the leaky abstractions of models, prompts, and settings (i.e. temperature, etc)
- Iterate & improve prompts, models, and settings without changing the return type or updating the application
- Run Objective & Subjective evals with support for deterministic tests, LLM-as-Judge, and Human Feedback
- Optimize each function by cost, latency, and/or eval performance

## Assumptions:

-
