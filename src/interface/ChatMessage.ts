export type UserMessage = {
  role: 'user'
  content: string
}

export type AssistantMessage = {
  role: 'assistant'
  content: string
}

export type PDFDoc = {
  file_id: string;
  file_name: string;
  page: string;
  page_content: string;
}

export type SearchDoc = {
  text: string;
  title: string;
  link: string
}

export type SourceDoc = PDFDoc | SearchDoc

export type ChatMessage = (UserMessage | AssistantMessage) & {
  sourceDocs?: SourceDoc[]
}
