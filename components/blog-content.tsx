import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Share2, BookOpen } from 'lucide-react';
import { BlogPost } from '@/lib/blog-data';

interface BlogContentProps {
  post: BlogPost;
}

export function BlogContent({ post }: BlogContentProps) {
  // Function to render content with proper heading styling
  const renderContent = (content: string) => {
    // Split content into paragraphs and process each one
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;
      
      // Check if it's a heading (starts with #, ##, ###, etc.)
      if (trimmed.startsWith('#')) {
        const level = trimmed.match(/^#+/)?.[0].length || 1;
        const text = trimmed.replace(/^#+\s*/, '');
        
        const headingClasses = {
          1: 'text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8',
          2: 'text-3xl font-bold text-gray-900 dark:text-white mb-5 mt-7',
          3: 'text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-6',
          4: 'text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-5',
          5: 'text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4',
          6: 'text-base font-medium text-gray-900 dark:text-white mb-2 mt-4'
        };
        
        const headingLevel = Math.min(level, 6) as keyof typeof headingClasses;
        
        if (headingLevel === 1) {
          return <h1 key={index} className={headingClasses[headingLevel]}>{text}</h1>;
        } else if (headingLevel === 2) {
          return <h2 key={index} className={headingClasses[headingLevel]}>{text}</h2>;
        } else if (headingLevel === 3) {
          return <h3 key={index} className={headingClasses[headingLevel]}>{text}</h3>;
        } else if (headingLevel === 4) {
          return <h4 key={index} className={headingClasses[headingLevel]}>{text}</h4>;
        } else if (headingLevel === 5) {
          return <h5 key={index} className={headingClasses[headingLevel]}>{text}</h5>;
        } else {
          return <h6 key={index} className={headingClasses[headingLevel]}>{text}</h6>;
        }
      }
      
      // Check if it's a list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(item => item.trim().startsWith('- ') || item.trim().startsWith('* '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {item.replace(/^[-*]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }
      
      // Check if it's a numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').filter(item => /^\d+\.\s/.test(item.trim()));
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">
                {item.replace(/^\d+\.\s*/, '')}
              </li>
            ))}
          </ol>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="mb-8">
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
        />
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300">
            {post.category}
          </Badge>
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.publishedAt).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{post.content.split(/\s+/).length} words</span>
          </div>
        </div>
        
        <Separator className="mb-8" />
      </div>
      
      {/* Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white">
        {renderContent(post.content)}
      </div>
      
      {/* Author Bio */}
      <Card className="mt-12 bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                About {post.author}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Healthcare professional and career advisor with expertise in allied health recruitment and professional development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
} 