export type UserMessage = {
  role: 'user'
  content: string
}

export type AssistantMessage = {
  role: 'assistant'
  content: string
}

export type ChatMessage = UserMessage | AssistantMessage
