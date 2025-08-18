# Expo React Native AI Streaming Example

## Example of AI streaming responses in Expo + React Native

## Issue

React Native fetch API lacks:

- **ReadableStream API**: The `response.body?.getReader()` method
- **Streaming support**: Native fetch doesn't handle streaming responses
- **TextDecoder**: May not be available or fully compatible

## Solution

### 1. **Fetch with polyfill**

Use [fetch from Expo](https://docs.expo.dev/versions/latest/sdk/expo/)

```tsx
import { fetch } from "expo/fetch";
```

It provides Expo's polyfilled fetch with streaming support.

### 2. **Stream Processing**

Now you can follow examples of how to implement it from OpenAI or OpenRouter docs for web.

- Reading the response stream chunk by chunk
  The implementation can be checked [here](/app/index.tsx)

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [OpenRouter API Docs](https://openrouter.ai/docs)
