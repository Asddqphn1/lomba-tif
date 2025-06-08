import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginSection: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigasi = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Lakukan login terlebih dahulu
      const response = await fetch(
        "https://hono-api-lomba-tif-production.up.railway.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      
      console.log(data.message);

      // 2. Setelah login berhasil, ambil data user terbaru
      const userResponse = await fetch(
        "https://hono-api-lomba-tif-production.up.railway.app/auth/me",
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!userResponse.ok) {
        console.log(userResponse);
        throw new Error("Failed to get user data");
        
      }

      const userData = await userResponse.json();
      const currentRole = userData.user?.role;
      

      // 3. Navigasi berdasarkan role yang baru diambil
      if (currentRole) {
        switch (currentRole) {
          case "ADMIN":
            navigasi("/admindashboard", { replace: true });
            break;
          case "USERS":
            navigasi("/daftarlomba", { replace: true });
            break;
          case "PESERTA":
            navigasi(`/pesertadashboard/${userData.user?.id}`, { replace: true });
            break;
          case "JURI":
            navigasi("/juridashboard", { replace: true });
            break;
          default:
            navigasi("/login", { replace: true });
        }
      } else {
        throw new Error("Role not found");
      }
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://hono-api-lomba-tif-production.up.railway.app/auth/google";
  };

  return (
    <div className="bg-[url(/logotiflomba.jpeg)] bg-cover bg-center bg-no-repeat">
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-blue-600">
              Welcome to LombaTIF
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="text-red-700">{error}</div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                >
                  <path
                    fill="#4285F4" // Blue
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853" // Green
                    d="M46.98 24.55c0-1.7-.15-3.35-.43-4.94H24v9.37h12.84c-.56 2.96-2.24 5.48-4.78 7.18l7.98 6.19c4.63-4.27 7.94-10.61 7.94-17.8z"
                  />
                  <path
                    fill="#FBBC05" // Yellow
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#EA4335" // Red
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.98-6.19c-2.24 1.5-5.08 2.39-7.91 2.39-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>
            </div>
          </div>

          <div
            className="mt-6 text-center cursor-pointer"
            onClick={() => navigasi("/register")}
          >
            <p className="text-sm text-gray-600">Don't have an account?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
