"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if ((username === "test_user" || username === "test_failure") && password === "test_pass") {
      login(username)
      router.push("/products")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8 px-4">
      {/* Logo */}
      <div className="mb-6">
        <Link href="/" className="text-3xl font-bold text-gray-900">
          ImagineX <span className="text-yellow-500">Deals</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 mb-4">
          <h1 className="text-3xl font-normal mb-6">Sign in</h1>

          {error && (
            <div
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start"
              data-testid="login-error"
            >
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-800">There was a problem</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-bold mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                data-testid="login-username"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-bold mb-1">
                  Password
                </label>
                <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                data-testid="login-password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2" data-testid="login-button">
              Sign in
            </button>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Keep me signed in
              </label>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              By continuing, you agree to ImagineX Deals&apos;{" "}
              <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Conditions of Use
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                Privacy Notice
              </Link>
              .
            </p>
          </div>

          <div className="mt-4 text-sm">
            <details>
              <summary className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">Need help?</summary>
              <div className="mt-2 pl-4 space-y-1">
                <p className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">Forgot your password</p>
                <p className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                  Other issues with Sign-In
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-100 text-gray-500">New to ImagineX Deals?</span>
          </div>
        </div>

        {/* Create Account Button */}
        <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          Create your ImagineX Deals account
        </button>

        {/* Test Credentials */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 font-medium">Test Credentials</p>
          <p className="text-sm text-blue-700">Username: test_user / Password: test_pass (successful payments)</p>
          <p className="text-sm text-blue-700">Username: test_failure / Password: test_pass (failed payments)</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 w-full max-w-md">
        <div className="border-t border-gray-300 pt-4">
          <div className="flex justify-center space-x-4 text-xs text-blue-600">
            <Link href="#" className="hover:text-blue-800 hover:underline">
              Conditions of Use
            </Link>
            <Link href="#" className="hover:text-blue-800 hover:underline">
              Privacy Notice
            </Link>
            <Link href="#" className="hover:text-blue-800 hover:underline">
              Help
            </Link>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">© 2023 ImagineX Deals. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
