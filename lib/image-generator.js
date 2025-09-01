/**
 * 🎨 Advanced Image Generator
 * Creates beautiful placeholder images for repositories
 */

export const generateRepositoryImages = (repository) => {
  const images = [];
  
  // Main project image with gradient background
  images.push({
    url: generateGradientImage(repository, 'main', '4F46E5', '7C3AED'),
    alt: `${repository.name} - Main Project`,
    description: 'Project Overview',
    type: 'main'
  });

  // Technology stack image
  if (repository.language) {
    const techColors = getLanguageColors(repository.language);
    images.push({
      url: generateGradientImage(repository, 'tech', techColors.primary, techColors.secondary),
      alt: `${repository.name} - Technology Stack`,
      description: `${repository.language} Technology`,
      type: 'tech'
    });
  }

  // Features image
  if (repository.topics && repository.topics.length > 0) {
    images.push({
      url: generateGradientImage(repository, 'features', 'DC2626', 'F59E0B'),
      alt: `${repository.name} - Features`,
      description: 'Key Features',
      type: 'features'
    });
  }

  // Architecture/Design image
  images.push({
    url: generateGradientImage(repository, 'architecture', '059669', '10B981'),
    alt: `${repository.name} - Architecture`,
    description: 'System Architecture',
    type: 'architecture'
  });

  // Demo/Screenshot image
  images.push({
    url: generateGradientImage(repository, 'demo', 'EA580C', 'F97316'),
    alt: `${repository.name} - Demo`,
    description: 'Live Demo',
    type: 'demo'
  });

  return images;
};

const generateGradientImage = (repository, type, color1, color2) => {
  const baseUrl = 'https://via.placeholder.com/400x250';
  const icons = {
    main: '🚀',
    tech: '⚙️',
    features: '✨',
    architecture: '🏗️',
    demo: '🎯'
  };

  const icon = icons[type] || icons.main;
  const projectName = repository.name.replace(/[-_]/g, ' ');
  
  // Create a more sophisticated placeholder with gradient
  const text = `${icon} ${projectName}`;
  const encodedText = encodeURIComponent(text);
  
  return `${baseUrl}/${color1}/${color2}?text=${encodedText}`;
};

const getLanguageColors = (language) => {
  const colorMap = {
    'JavaScript': { primary: 'F7DF1E', secondary: 'F0DB4F' },
    'TypeScript': { primary: '3178C6', secondary: '4A90E2' },
    'Python': { primary: '3776AB', secondary: '4B8BBE' },
    'Java': { primary: 'ED8B00', secondary: 'F89820' },
    'C++': { primary: '00599C', secondary: '0078D4' },
    'C#': { primary: '239120', secondary: '2E7D32' },
    'Go': { primary: '00ADD8', secondary: '00BCD4' },
    'Rust': { primary: '000000', secondary: '333333' },
    'PHP': { primary: '777BB4', secondary: '9C27B0' },
    'Ruby': { primary: 'CC342D', secondary: 'E91E63' },
    'Swift': { primary: 'FA7343', secondary: 'FF5722' },
    'Kotlin': { primary: '7F52FF', secondary: '9C27B0' },
    'React': { primary: '61DAFB', secondary: '21D4FD' },
    'Vue': { primary: '4FC08D', secondary: '00E676' },
    'Angular': { primary: 'DD0031', secondary: 'F44336' },
    'Node.js': { primary: '339933', secondary: '4CAF50' },
    'HTML': { primary: 'E34F26', secondary: 'FF5722' },
    'CSS': { primary: '1572B6', secondary: '2196F3' },
    'SQL': { primary: '336791', secondary: '607D8B' },
    'Shell': { primary: '89E051', secondary: '8BC34A' }
  };

  return colorMap[language] || { primary: '6B7280', secondary: '9CA3AF' };
};

export const generateProjectShowcase = (repository) => {
  // Generate a more detailed project showcase
  const showcase = {
    title: repository.name.replace(/[-_]/g, ' '),
    description: repository.description || 'A professional software project',
    technologies: repository.topics || [],
    language: repository.language,
    stats: {
      stars: repository.stars,
      forks: repository.forks,
      size: repository.size
    },
    images: generateRepositoryImages(repository)
  };

  return showcase;
};

export const createImageCarousel = (images) => {
  return {
    images: images,
    currentIndex: 0,
    totalImages: images.length,
    hasMultipleImages: images.length > 1
  };
};
