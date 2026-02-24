import { ProjectSummary } from '../types/project.type';
import * as projectRepository from '../repositories/project.repository';
import { listResponse, searchParamsDTO } from '../dtos/common.dto';

// export async function createProject({
//   userId,
//   data,
// }: {
//   userId: string;
//   data: simpleCreateProjectDTO;
// }) {
//   const projectData = await projectRepository.createProject({
//     userId,
//     data,
//   });
//   if (!projectData) {
//     throw new Error('프로젝트를 생성하지 못했습니다.');
//   }
//   await memberRepository.createMember(userId, projectData.id.toString());
//   return Project.fromEntity(projectData);
// }

export async function getMyProjects(
  userId: string,
  params: searchParamsDTO,
): Promise<listResponse<ProjectSummary>> {
  const { projects, total } = await projectRepository.getMyProjects({
    userId,
    params,
  });
  return {
    data: ProjectSummary.fromEntityList(projects),
    total,
  };
}
