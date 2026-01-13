import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerification } from '@/store/slices/authSlice';
import { FaEnvelope, FaCheckCircle, FaClock, FaPaperPlane } from 'react-icons/fa';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    try {
      setLoading(true);
      await dispatch(verifyEmail(token)).unwrap();
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(resendVerification()).unwrap();
      setCanResend(false);
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  if (userInfo?.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Already Verified
            </h1>
            <p className="text-gray-600 mb-6">
              Your email has already been verified. You can access all features.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-6"></div>
              <h1 className="text-xl font-bold text-gray-900 mb-4">
                Verifying your email...
              </h1>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-blue-500 text-4xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Email Verified Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Your email has been verified. You will be redirected to the homepage shortly.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-blue-600">Redirecting in 3 seconds...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaEnvelope className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">
            Please verify your email to access all features
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <FaClock className="text-yellow-500 text-2xl mt-1" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Check your inbox</h3>
              <p className="text-gray-600 text-sm">
                We've sent a verification email to{' '}
                <span className="font-semibold">{userInfo?.email}</span>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> The verification link will expire in 24 hours.
              If you don't verify your email, some features will be restricted.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                canResend
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <FaPaperPlane />
              <span>
                {canResend
                  ? 'Resend Verification Email'
                  : `Resend available in ${countdown}s`}
              </span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Didn't receive the email?</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes and try again</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;