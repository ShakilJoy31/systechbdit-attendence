
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

export interface ProjectsResponse {
  success: boolean;
  statusCode: number;
  meta: {
    page: number;
    size: number;
    total: number;
    totalPage: number;
  };
  message: string;
  data: Project[];
}

export default async function getProjects(): Promise<ProjectsResponse> {
  try {
    const response = await fetch('https://tech-element-backend.vercel.app/api/v1/project/get-project-all');

    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }

    const projects: ProjectsResponse = await response.json();
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return empty data structure on error
    return {
      success: false,
      statusCode: 500,
      meta: { page: 1, size: 10, total: 0, totalPage: 1 },
      message: 'Failed to fetch projects',
      data: []
    };
  }
}