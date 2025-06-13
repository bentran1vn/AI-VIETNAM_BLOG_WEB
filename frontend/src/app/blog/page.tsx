"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
import BlogPdfViewer from "@/components/BlogPdfViewer";

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

type TreeNode = {
  [key: string]: TreeNode | BlogPostMetadata;
};

// Helper to build a tree from file paths
function buildTree(posts: BlogPostMetadata[]): TreeNode {
  const root: TreeNode = {};
  posts.forEach((post) => {
    const parts = post.path.replace(/^localStorage\//, "").split("/");
    let node: TreeNode = root;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] = (node[parts[i]] as TreeNode) || {};
      node = node[parts[i]] as TreeNode;
    }
    node[parts[parts.length - 1]] = post;
  });
  return root;
}

function renderTree(
  node: TreeNode,
  onSelect: (post: BlogPostMetadata) => void,
  selectedPath: string | null,
  collapsed: { [key: string]: boolean },
  onToggle: (path: string) => void,
  depth = 0,
  prefix = ""
) {
  return (
    <ul className="space-y-1">
      {Object.entries(node).map(([key, value]) => {
        const currentPath = prefix + key;
        if ((value as BlogPostMetadata).path) {
          return (
            <li
              key={currentPath}
              className={`flex items-center py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 text-sm
                ${
                  selectedPath === (value as BlogPostMetadata).path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                }`}
              style={{ paddingLeft: `${(depth + 1) * 20}px` }}
              onClick={() => onSelect(value as BlogPostMetadata)}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") onSelect(value as BlogPostMetadata);
              }}
            >
              <span className="mr-3 text-lg">📄</span>
              <span className="truncate">
                {(value as BlogPostMetadata).title}
              </span>
            </li>
          );
        } else {
          const isCollapsed = collapsed[currentPath];
          return (
            <li key={currentPath}>
              <div
                className={
                  "flex items-center py-2 px-4 text-sm font-semibold text-blue-800 uppercase tracking-wider hover:bg-blue-50 transition-all duration-200 cursor-pointer select-none"
                }
                style={{ paddingLeft: `${depth * 20}px` }}
                onClick={() => onToggle(currentPath)}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") onToggle(currentPath);
                }}
              >
                <span className="mr-3 text-lg">
                  {isCollapsed ? <span>📁</span> : <span>📂</span>}
                </span>
                {key}
              </div>
              {!isCollapsed &&
                renderTree(
                  value as TreeNode,
                  onSelect,
                  selectedPath,
                  collapsed,
                  onToggle,
                  depth + 1,
                  currentPath + "/"
                )}
            </li>
          );
        }
      })}
    </ul>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostMetadata[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await fetch("/api/blog-posts");
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handlePostSelect = async (post: BlogPostMetadata) => {
    setSelectedPath(post.path);
    setSelectedPost(null);
    setLoadingContent(true);
    setPdfBlob(null);

    try {
      if (post.fileType === "md") {
        const response = await fetch("/api/blog-posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: post.path }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post content");
        }

        const postWithContent = await response.json();
        setSelectedPost(postWithContent);
      } else if (post.fileType === "pdf") {
        const githubRawUrl = `https://raw.githubusercontent.com/bentran1vn/AI-VIETNAM_BLOG_WEB/main/${post.path}`;
        const response = await fetch(
          `/api/proxy-pdf?url=${encodeURIComponent(githubRawUrl)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        setPdfBlob(blob);
        setSelectedPost({ ...post, content: "" });
      }
    } catch (error) {
      console.error("Error loading post:", error);
      // You could set an error state here if needed
    } finally {
      setLoadingContent(false);
    }
  };

  const tree = buildTree(posts);

  const handleToggle = (path: string) => {
    setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 shadow-xl w-full md:w-72 lg:w-80 xl:w-96 h-screen sticky top-0 overflow-y-auto py-8 px-6 transition-all duration-300 rounded-r-3xl hide-scrollbar">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-blue-50 to-transparent pb-4 mb-4">
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            Blog Categories
          </h2>
          <div className="h-1 w-16 bg-blue-200 rounded-full mt-2"></div>
        </div>
        {renderTree(
          tree,
          handlePostSelect,
          selectedPath,
          collapsed,
          handleToggle
        )}
      </aside>
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen">
        {selectedPath ? (
          <article className="bg-white rounded-3xl shadow-2xl p-0 max-w-6xl mx-auto overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-blue-100/60 px-8 pt-8 pb-4 border-b border-gray-200">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-2 leading-tight drop-shadow">
                {selectedPost?.title || "Loading..."}
              </h1>
              <div className="flex items-center gap-3 text-base mt-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow">
                  By {selectedPost?.author || "Loading..."}
                </span>
                <span className="text-gray-400">•</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium shadow">
                  {selectedPost?.category || "Loading..."}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-8">
              {loadingContent ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg p-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
                  <p className="text-gray-600 text-lg font-medium">
                    Loading content...
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please wait while we fetch the content
                  </p>
                </div>
              ) : selectedPost?.fileType === "md" ? (
                <div
                  className="markdown-content text-gray-800 prose prose-lg"
                  dangerouslySetInnerHTML={{
                    __html: marked(
                      selectedPost.content.replace(/^# .*(\n|$)/, "")
                    ),
                  }}
                />
              ) : (
                <div className="pdf-container">
                  {pdfBlob ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">
                          PDF Document
                        </h2>
                        <a
                          href={URL.createObjectURL(pdfBlob)}
                          download={`${selectedPost?.title}.pdf`}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          <span>Download PDF</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </a>
                      </div>
                      <BlogPdfViewer pdfBlob={pdfBlob} />
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-600 text-xl sm:text-2xl font-medium">
            Select a blog post to read
          </div>
        )}
      </main>
    </div>
  );
}
