import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, clearError } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

function LoginPage() {
  const { loading: authLoading, error: authError, isAuthenticated, user } = useSelector(state => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.is_root_admin) {
        router.push('/rootAdminDashboard');
      } else if (user.is_reseller_admin) {
        router.push('/resellerAdmindashboard');
      } else if (user.is_department_admin) {
        router.push('/departmentAdmindashboard');
      } else {
        router.push('/home-page');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (authError) {
      setLoginError(
        authError.detail ||
        (typeof authError === 'string' ? authError : 'Authentication failed')
      );
    }
  }, [authError]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLoginError("");
    dispatch(clearError());
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError("Please enter both email and password");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setLoginError("Please fill out all fields");
      return;
    }
    dispatch(registerUser({ name, email, password }));
  };

  // Reusable Error Box
  const ErrorBox = () => (
    loginError && (
      <div className="w-full max-w-md mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
        {loginError}
      </div>
    )
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-center font-bungee text-[#087da8] font-medium text-3xl mb-2">SaaS Portal</h1>
        <p className="text-center text-gray-600 mb-6">Welcome to SaaS Portal</p>
        
        <ErrorBox />
        
        {isLoginMode ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                id="email"
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                id="password"
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="hidden peer" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all">
                  {rememberMe && (
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20 8l-1.4-1.4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">Remember Me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full p-2 bg-[#087da8] text-white font-semibold rounded-md hover:bg-[#065c81] transition flex items-center justify-center"
            >
              {authLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                id="name"
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" 
              />
            </div>
            
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                id="signup-email"
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" 
              />
            </div>
            
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                id="signup-password"
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#087da8]" 
              />
            </div>
            
            <p className="text-center text-xs text-gray-900">
              By clicking on <span className="font-semibold">"Create Account"</span>, I agree to the
              <span className="text-[#087da8] cursor-pointer"> Terms of Service</span>,
              <span className="text-[#087da8] cursor-pointer"> Privacy Policy</span>, and
              <span className="text-[#087da8] cursor-pointer"> Use of Cookies</span>.
            </p>
            
            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full p-2 bg-[#087da8] text-white font-semibold rounded-md hover:bg-[#065c81] transition flex items-center justify-center"
            >
              {authLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"} 
            <span onClick={toggleMode} className="ml-1 text-[#087da8] font-semibold cursor-pointer">
              {isLoginMode ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
