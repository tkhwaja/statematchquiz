import { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePostHog } from "@/contexts/PostHogContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CloudBackground from "@/components/CloudBackground";
import { blogPosts } from "@/data/blog-posts";

const Blog = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("page_view", { page: "blog" });
  }, []);

  return (
    <div className="min-h-screen relative">
      <CloudBackground />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">StateMatch Blog</h1>
            <p className="text-muted-foreground text-lg">
              Guides, data, and insights to help you find your perfect place to live
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.date} • {post.readTime}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
