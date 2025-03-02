export interface Tag {
  _id: string;
  title: string;
}

export interface Content {
  _id: string;
  link: string;
  type: "image" | "video" | "article" | "audio";
  title: string;
  tags: Tag[] | string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  access_token?: string;
  userId?: string;
}

export interface ContentResponse {
  message: string;
  content?: Content[];
}

export interface ShareLinkResponse {
  message: string;
  link?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: any[];
}
