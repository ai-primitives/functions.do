# functions.do

```bash
npm i functions.do
```

## Configuration

Environment variables are stored in the `.env` or `env.local` file:

```bash

```


```typescript
import { ai } from 'functions.do'

const result = await ai.generateText({
  model: 'gpt-4o',
  prompt: 'Hello, world!',
})
```