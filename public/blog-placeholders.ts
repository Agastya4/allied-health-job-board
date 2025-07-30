// Placeholder images for blog posts
// These will be used until you add your own custom images

export const blogPlaceholderImages = [
  // Career Guides
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop&crop=center",
  
  // Resume & Interview
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center",
  
  // Professional Development
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop&crop=center",
  
  // Salary & Industry
  "https://images.unsplash.com/photo-1554224154-26032cdc-7c3?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center",
  
  // Physiotherapy
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center",
  
  // Occupational Therapy
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center",
  
  // Speech Pathology
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center",
  
  // General Healthcare
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop&crop=center"
];

// Function to get a random placeholder image
export function getRandomPlaceholderImage(): string {
  const randomIndex = Math.floor(Math.random() * blogPlaceholderImages.length);
  return blogPlaceholderImages[randomIndex];
}

// Function to get placeholder image by category
export function getPlaceholderImageByCategory(category: string): string {
  const categoryImages: { [key: string]: string[] } = {
    "Career Guides": [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center"
    ],
    "Resume & Interview": [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center"
    ],
    "Professional Development": [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center"
    ],
    "Salary & Industry": [
      "https://images.unsplash.com/photo-1554224154-26032cdc-7c3?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center"
    ],
    "Physiotherapy": [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&crop=center"
    ],
    "Occupational Therapy": [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&crop=center"
    ],
    "Speech Pathology": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&crop=center"
    ]
  };
  
  const images = categoryImages[category] || blogPlaceholderImages;
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
} 