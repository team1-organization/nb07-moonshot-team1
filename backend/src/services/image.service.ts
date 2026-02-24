import * as imageRepository from '../repositories/image.repository';

export async function uploadImages(
  imageType: 'user' | 'task' | 'others',
  targetId: string,
  filenames: string[],
) {
  if (imageType === 'user') {
    return await Promise.all(
      filenames.map((filename, index) =>
        imageRepository.userImageUpload(targetId, filename, index),
      ),
    );
  } else if (imageType === 'task') {
    return await Promise.all(
      filenames.map((filename, index) =>
        imageRepository.taskImageUpload(targetId, filename, index),
      ),
    );
  }
}
