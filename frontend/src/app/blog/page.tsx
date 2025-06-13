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
    <ul className="space-y-0.5">
      {Object.entries(node).map(([key, value]) => {
        const currentPath = prefix + key;
        if ((value as BlogPostMetadata).path) {
          const fileType = (value as BlogPostMetadata).fileType;
          return (
            <li
              key={currentPath}
              className={`flex items-center py-1.5 px-3 rounded cursor-pointer transition-all duration-200 text-sm
                ${
                  selectedPath === (value as BlogPostMetadata).path
                    ? "bg-gray-200 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              style={{ paddingLeft: `${(depth + 1) * 16}px` }}
              onClick={() => onSelect(value as BlogPostMetadata)}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") onSelect(value as BlogPostMetadata);
              }}
            >
              <span className="mr-2 text-gray-500">
                {fileType === "md" ? (
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
                    className="text-gray-400"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                ) : (
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
                    className="text-red-500"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                )}
              </span>
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
                  "flex items-center py-1.5 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-all duration-200 cursor-pointer select-none"
                }
                style={{ paddingLeft: `${depth * 16}px` }}
                onClick={() => onToggle(currentPath)}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") onToggle(currentPath);
                }}
              >
                <span className="mr-2 text-gray-500">
                  {isCollapsed ? (
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
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  ) : (
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
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                      <line x1="9" y1="14" x2="15" y2="14"></line>
                    </svg>
                  )}
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
  // Add useState for sidebar visibility at the top with other state variables
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Add a useEffect to handle sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) setSidebarOpen(false);

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
        // If category is not provided, try to extract it from the path
        if (
          postWithContent &&
          !postWithContent.category &&
          postWithContent.path
        ) {
          const pathParts = postWithContent.path.split("/");
          if (pathParts.length > 1) {
            postWithContent.category = pathParts[1];
          }
        }
        setSelectedPost(postWithContent);
      } else if (post.fileType === "pdf") {
        // Fetch metadata from backend first
        const response = await fetch("/api/blog-posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: post.path }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch PDF metadata");
        }

        const postWithContent = await response.json();
        // Now fetch the PDF blob
        const githubRawUrl = `https://raw.githubusercontent.com/bentran1vn/AI-VIETNAM_BLOG_WEB/main/${post.path}`;
        const pdfResponse = await fetch(
          `/api/proxy-pdf?url=${encodeURIComponent(githubRawUrl)}`
        );

        if (!pdfResponse.ok) {
          throw new Error(`Failed to load PDF: ${pdfResponse.statusText}`);
        }

        const blob = await pdfResponse.blob();
        setPdfBlob(blob);
        setSelectedPost({ ...postWithContent, content: "" });
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

  // Replace the return statement with this responsive layout
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Mobile Sidebar Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-md border border-gray-200"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {!sidebarOpen && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      )}

      {/* Sidebar - fixed position and full height */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 w-72 fixed left-0 top-0 bottom-0 h-screen overflow-y-auto transition-transform duration-300 z-30 md:translate-x-0`}
      >
        <div className="sticky top-0 z-10 bg-white pb-3">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Document Library
            </h2>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700 hover:text-gray-900 shadow-sm"
                aria-label="Close sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <div className="h-px w-full bg-gray-200"></div>
        </div>
        <div className="px-2">
          {renderTree(
            tree,
            handlePostSelect,
            selectedPath,
            collapsed,
            handleToggle
          )}
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content - with left margin to accommodate fixed sidebar */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "md:ml-72" : "ml-0"
        }`}
      >
        {selectedPath ? (
          <article className="min-h-screen pt-16 md:pt-0">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 w-full">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-900 mb-1 truncate">
                  {selectedPost?.title || "Loading..."}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm">
                  <span className="text-gray-600">
                    Author:{" "}
                    <span className="font-medium">
                      {selectedPost?.author || "Loading..."}
                    </span>
                  </span>
                  <span className="text-gray-400 hidden md:inline">|</span>
                  <span className="text-gray-600">
                    {selectedPost?.category && (
                      <>
                        Category:{" "}
                        <span className="font-medium">
                          {selectedPost.category}
                        </span>
                      </>
                    )}
                    {!selectedPost?.category && selectedPost?.path && (
                      <>
                        Location:{" "}
                        <span className="font-medium text-xs md:text-sm truncate max-w-[200px] inline-block align-bottom">
                          {selectedPost.path.split("/").slice(0, -1).join("/")}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 w-full overflow-x-auto">
              {loadingContent ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-700 mb-4"></div>
                  <p className="text-gray-600 text-sm font-medium">
                    Loading document...
                  </p>
                </div>
              ) : selectedPost?.fileType === "md" ? (
                <div
                  className="markdown-content text-gray-800 prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-a:text-gray-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded prose-img:shadow-sm break-words"
                  style={{ wordBreak: "break-word" }}
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
                      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-gray-50 p-4 rounded border border-gray-200 w-full">
                        <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-600"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          PDF Document
                        </h2>
                        <a
                          href={URL.createObjectURL(pdfBlob)}
                          download={`${selectedPost?.title}.pdf`}
                          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition flex items-center gap-2 text-sm font-medium"
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
          <div className="flex flex-col items-center justify-center h-screen text-center p-6 bg-white pt-16 md:pt-0 w-full">
            <div className="w-20 h-20 mb-6 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">
              No Document Selected
            </h2>
            <p className="text-gray-500 max-w-md">
              Please select a document from the library to view its contents
            </p>
            {/* Mobile-only button to open sidebar */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="mt-6 md:hidden px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition flex items-center gap-2 text-sm font-medium"
            >
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
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Browse Documents</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
