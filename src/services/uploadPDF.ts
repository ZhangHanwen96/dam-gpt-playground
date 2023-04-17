import http from "@/http";

export interface UploadPDFResponse {
    "file_name": string;
    "file_id": string;
    "parse_status": "success" | "error"
}