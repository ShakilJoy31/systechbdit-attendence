export interface ProjectImage {
  id: number;
  projectId: number;
  image: string;
}

export interface Project {
  id: number;
  name: string;
  category: string;
  description: string;
  link: string;
  video: string;
  createdAt: string;
  updatedAt: string;
  ProjectImage: ProjectImage[];
}

export interface ProjectResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Project;
}