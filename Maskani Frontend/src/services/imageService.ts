

// Constants for image handling
export const MAX_IMAGES = 30;
export const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB
export const MAX_TOTAL_STORAGE = 1000 * 1024 * 1024; // 1GB

// Get all available slide images
export const getSlideImages = (): string[] => {
  const slideImages = [];
  for (let i = 1; i <= 5; i++) {
    slideImages.push(`/images/slide${i}.jpg`);
    
  }
  return slideImages;
};

// Get dorm images from localStorage
export const getDormImages = (dormName: string): string[] => {
  const storedImages = localStorage.getItem(`dorm_images_${dormName}`);
  return storedImages ? JSON.parse(storedImages) : [];
};

// Save dorm images to localStorage
export const saveDormImages = (dormName: string, images: string[]): void => {
  localStorage.setItem(`dorm_images_${dormName}`, JSON.stringify(images));
};

// Add a new image to a dorm's image collection
export const addDormImage = (dormName: string, imageUrl: string): void => {
  const currentImages = getDormImages(dormName);
  if (currentImages.length >= MAX_IMAGES) {
    throw new Error(`Maximum number of images (${MAX_IMAGES}) reached for this dorm.`);
  }
  currentImages.push(imageUrl);
  saveDormImages(dormName, currentImages);
};

// Remove an image from a dorm's image collection
export const removeDormImage = (dormName: string, imageUrl: string): void => {
  const currentImages = getDormImages(dormName);
  const updatedImages = currentImages.filter(img => img !== imageUrl);
  saveDormImages(dormName, updatedImages);
};

// Clear all images for a dorm
export const clearDormImages = (dormName: string): void => {
  localStorage.removeItem(`dorm_images_${dormName}`);
};

// Get the total size of stored images
export const getTotalStorageSize = (): number => {
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('dorm_images_')) {
      totalSize += localStorage.getItem(key)?.length || 0;
    }
  }
  return totalSize;
};

// Check if adding a new image would exceed storage limits
export const checkStorageLimit = (newImageSize: number): boolean => {
  return getTotalStorageSize() + newImageSize <= MAX_TOTAL_STORAGE;
};

// Handle image upload
export const handleImageUpload = async (file: File, dormName: string): Promise<string> => {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image size exceeds maximum allowed size of ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
  }

  if (!checkStorageLimit(file.size)) {
    throw new Error('Total storage limit exceeded');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imageUrl = e.target?.result as string;
        addDormImage(dormName, imageUrl);
        resolve(imageUrl);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}; 