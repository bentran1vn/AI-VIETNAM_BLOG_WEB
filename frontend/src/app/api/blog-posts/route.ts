import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface BlogPostMetadata {
  path: string;
  title: string;
  author: string;
  category: string;
  fileType: "md" | "pdf";
}

interface BlogPost extends BlogPostMetadata {
  content: string;
}

async function getFilesRecursively(
  owner: string,
  repo: string,
  path: string,
  category: string,
  posts: BlogPostMetadata[]
) {
  const { data: contents } = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  if (!Array.isArray(contents)) return;

  for (const item of contents) {
    if (item.type === "dir") {
      // Recurse into subdirectory
      await getFilesRecursively(owner, repo, item.path, item.name, posts);
    } else if (
      item.type === "file" &&
      (item.name.endsWith(".md") || item.name.endsWith(".pdf"))
    ) {
      const title = item.name;
      const author = "Unknown";

      posts.push({
        path: item.path,
        title,
        author,
        category,
        fileType: item.name.endsWith(".md") ? "md" : "pdf",
      });
    }
  }
}

export async function GET() {
  try {
    const owner = "bentran1vn";
    const repo = "AI-VIETNAM_BLOG_WEB";
    const path = "localStorage";
    const posts: BlogPostMetadata[] = [];

    await getFilesRecursively(owner, repo, path, "root", posts);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// New endpoint to fetch content for a specific post
export async function POST(
  req: Request
): Promise<NextResponse<BlogPost | { error: string }>> {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const owner = "bentran1vn";
    const repo = "AI-VIETNAM_BLOG_WEB";

    const { data: fileContent } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (!("content" in fileContent)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const content = Buffer.from(fileContent.content, "base64").toString();
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.split("/").pop() || "";

    return NextResponse.json({
      path,
      title,
      author: "Unknown",
      content,
      category: path.split("/")[1] || "root",
      fileType: path.endsWith(".md") ? "md" : "pdf",
    });
  } catch (error) {
    console.error("Error fetching blog post content:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post content" },
      { status: 500 }
    );
  }
}
