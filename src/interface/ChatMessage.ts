export type UserMessage = {
  role: 'user'
  content: string
}

export type AssistantMessage = {
  role: 'assistant'
  content: string
}

export type SourceDoc = {
  file_id: string;
  file_name: string;
  page: string;
  page_content: string;
}

export type ChatMessage = (UserMessage | AssistantMessage) & {
  sourceDocs?: SourceDoc[]
}
