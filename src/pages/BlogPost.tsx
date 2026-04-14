import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePostHog } from "@/contexts/PostHogContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CloudBackground from "@/components/CloudBackground";
import { blogPosts } from "@/data/blog-posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate("/blog", { replace: true });
      return;
    }
    posthog.capture("page_view", { page: "blog_post", slug });
  }, [post, slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | StateMatch`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", post.description);
    }
    return () => {
      document.title = "StateMatch — Find Your Ideal Place to Live";
    };
  }, [post]);

  if (!post) return null;

  return (
    <div className="min-h-screen relative">
      <CloudBackground />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center justify-between py-4 mb-8">
            <Link to="/" className="font-bold text-xl">StateMatch</Link>
            <div className="flex items-center gap-6">
              <Link to="/blog" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</Link>
              <Button variant="hero" size="sm" onClick={() => navigate("/quiz")}>Take the Quiz</Button>
            </div>
          </nav>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article>
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            <p className="text-muted-foreground mb-8">
              {post.date} • {post.readTime}
            </p>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* CTA */}
          <Card className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">
                Find Your Perfect State Match
              </h3>
              <p className="text-muted-foreground mb-6">
                Take our free 30-question quiz to discover which states align
                with your lifestyle, values, and priorities.
              </p>
              <Button
                variant="hero"
                size="lg"
                className="text-lg px-12 py-6 h-auto"
                onClick={() => {
                  posthog.capture("blog_cta_clicked", { slug: post.slug });
                  navigate("/quiz");
                }}
              >
                Take the Free Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
