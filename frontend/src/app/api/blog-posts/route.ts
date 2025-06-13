import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface BlogPost {
  path: string;
  title: string;
  author: string;
  content: string;
  category: string;
  fileType: "md" | "tex" | "pdf";
}

async function getFilesRecursively(
  owner: string,
  repo: string,
  path: string,
  category: string,
  posts: BlogPost[]
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
      let content = "";
      let title = item.name;
      const author = "Unknown";

      if (item.name.endsWith(".md")) {
        const { data: fileContent } = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
        });

        if (!("content" in fileContent)) return;

        content = Buffer.from(fileContent.content, "base64").toString();
        const titleMatch = content.match(/^# (.+)$/m);
        title = titleMatch ? titleMatch[1] : item.name;
      }

      posts.push({
        path: item.path,
        title,
        author,
        content,
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
    const posts: BlogPost[] = [];

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
