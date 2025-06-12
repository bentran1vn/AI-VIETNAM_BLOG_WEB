"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "Blog Admin",
    siteDescription: "A modern blog platform",
    allowRegistration: true,
    requireEmailVerification: true,
    defaultUserRole: "STUDENT",
    postsPerPage: 10,
    enableComments: true,
    moderateComments: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to save settings
    console.log("Saving settings:", settings);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your application settings and configuration.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8 divide-y divide-gray-200"
        >
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  General Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Basic configuration for your blog platform.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="siteName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Site Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="siteName"
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="siteDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Site Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      rows={3}
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          siteDescription: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  User Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure user registration and role settings.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="allowRegistration"
                      name="allowRegistration"
                      type="checkbox"
                      checked={settings.allowRegistration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          allowRegistration: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="allowRegistration"
                      className="font-medium text-gray-700"
                    >
                      Allow User Registration
                    </label>
                    <p className="text-gray-500">
                      Enable or disable new user registration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="requireEmailVerification"
                      name="requireEmailVerification"
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          requireEmailVerification: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="requireEmailVerification"
                      className="font-medium text-gray-700"
                    >
                      Require Email Verification
                    </label>
                    <p className="text-gray-500">
                      Require users to verify their email address.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="defaultUserRole"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Default User Role
                  </label>
                  <select
                    id="defaultUserRole"
                    name="defaultUserRole"
                    value={settings.defaultUserRole}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        defaultUserRole: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Content Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure how content is displayed and managed.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="postsPerPage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Posts Per Page
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="postsPerPage"
                      id="postsPerPage"
                      min="1"
                      max="50"
                      value={settings.postsPerPage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          postsPerPage: parseInt(e.target.value),
                        })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="enableComments"
                      name="enableComments"
                      type="checkbox"
                      checked={settings.enableComments}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          enableComments: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="enableComments"
                      className="font-medium text-gray-700"
                    >
                      Enable Comments
                    </label>
                    <p className="text-gray-500">
                      Allow users to comment on posts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="moderateComments"
                      name="moderateComments"
                      type="checkbox"
                      checked={settings.moderateComments}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          moderateComments: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="moderateComments"
                      className="font-medium text-gray-700"
                    >
                      Moderate Comments
                    </label>
                    <p className="text-gray-500">
                      Require admin approval for new comments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
