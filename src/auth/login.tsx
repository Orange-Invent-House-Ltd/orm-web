/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Lock, Mail, ArrowRight} from "lucide-react";
import clsx from "clsx";
import FormInput, { PasswordInput } from "../components/reuseable/text_field";
import logo from "../assets/logo.png";
import { useLogin } from "../api/mutation";
import LoadingOverlay from "../components/reuseable/loading-overlay";
import Footer from "../components/reuseable/footer";


// Main Login Component
const ProfessionalLogin = () => {
  
  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const { mutate: login, isPending } = useLogin();

  const onSubmit = async (data: any) => {
    login(data);
  };

  // Validation rules
  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address"
    }
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters"
    }
  };

  // Register fields with validation
  React.useEffect(() => {
    methods.register("email", emailValidation);
    methods.register("password", passwordValidation);
  }, [methods]);

  return (
    <div className="min-h-screen flex items-center justify-center sm:p-4 p-2 relative overflow-hidden">
        {isPending && <LoadingOverlay />}
      {/* Background decoration */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div> */}

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-36 h-36 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-lg bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 ">
            <img src={logo} className="w-28 h-28 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/80 text-lg">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 ">
          <FormProvider {...methods}>
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-3 top-8 transform -translate-y-1/2 text-white/60 w-5 h-5 mt-3" />
                <div className="pl-10">
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-3 top-8 transform -translate-y-1/2 text-white/60 w-5 h-5 mt-3" />
                <div className="pl-10">
                  <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-white/90 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-400 focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <button 
                  type="button"
                  className="text-white/90 hover:text-white transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div> */}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                onClick={handleSubmit(onSubmit)}
                className={clsx(
                  "w-full bg-white text-green-600 font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg",
                  {
                    "hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-0.5": !isPending,
                    "opacity-80 cursor-not-allowed": isPending,
                  }
                )}
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Divider */}
              {/* <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/70">Or continue with</span>
                </div>
              </div> */}

              {/* Social Login Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/90 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/90 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div> */}
            </div>
          </FormProvider>

          {/* Sign Up Link */}
          {/* <div className="mt-8 text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <button className="text-white font-semibold hover:underline">
                Sign up here
              </button>
            </p>
          </div> */}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ProfessionalLogin;