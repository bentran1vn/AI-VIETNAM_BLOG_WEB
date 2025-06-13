"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";

interface BlogPost {
  path: string;
  title: string;
  author: string;
  content: string;
  category: string;
  fileType: "md" | "pdf";
}

type TreeNode = {
  [key: string]: TreeNode | BlogPost;
};

// Helper to build a tree from file paths
function buildTree(posts: BlogPost[]): TreeNode {
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
  onSelect: (post: BlogPost) => void,
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
        if ((value as BlogPost).path) {
          return (
            <li
              key={currentPath}
              className={`flex items-center py-2 px-4 rounded-lg cursor-pointer transition-all duration-200 text-sm
                ${
                  selectedPath === (value as BlogPost).path
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                }`}
              style={{ paddingLeft: `${(depth + 1) * 20}px` }}
              onClick={() => onSelect(value as BlogPost)}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") onSelect(value as BlogPost);
              }}
            >
              <span className="mr-3 text-lg">📄</span>
              <span className="truncate">{(value as BlogPost).title}</span>
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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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

  useEffect(() => {
    setPdfUrl(null);
    if (selectedPost && selectedPost.fileType === "pdf") {
      setPdfUrl(`/localStorage/${selectedPost.path}`);
    }
  }, [selectedPost]);

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
          setSelectedPost,
          selectedPost?.path || null,
          collapsed,
          handleToggle
        )}
      </aside>
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen">
        {selectedPost ? (
          <article className="bg-white rounded-3xl shadow-2xl p-0 max-w-6xl mx-auto overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-blue-100/60 px-8 pt-8 pb-4 border-b border-gray-200">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-2 leading-tight drop-shadow">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-3 text-base mt-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow">
                  By {selectedPost.author}
                </span>
                <span className="text-gray-400">•</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium shadow">
                  {selectedPost.category}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-8">
              {selectedPost.fileType === "md" ? (
                <div
                  className="markdown-content text-gray-800 prose prose-lg"
                  dangerouslySetInnerHTML={{
                    __html: marked(
                      selectedPost.content.replace(/^# .*(\n|$)/, "")
                    ),
                  }}
                />
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="800px"
                  style={{ border: "1px solid #ccc" }}
                />
              ) : (
                <div>Loading PDF...</div>
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
