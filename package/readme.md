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
