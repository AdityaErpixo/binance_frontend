import React, { useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

const BinanceSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    referralCode: ''
  });
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => navigate('/signin'),
    onError: (err: any) => setError(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isChecked) {
      setError('You must agree to the Terms of Service and Privacy Notice');
      return;
    }

    if (!formData.email || !formData.password || !formData.username) {
      setError('All fields are required');
      return;
    }

    registerMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      referralCode: formData.referralCode || undefined
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#181a20]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-[#2b3139] bg-[#181a20]">

          <div className='flex justify-end'>
            <button
              className="text-[#f0b90b] hover:text-yellow-400 font-medium"
              onClick={() => navigate('/dashboard')}
              disabled
            >
              Skip
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-[#f0b90b]">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                <path d="M9 12l2-2 4 4 2-2-6-6-6 6 2 2z" fill="#181a20" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">BINANCE</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-8">Welcome to Binance</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {['username', 'email', 'password', 'phone', 'referralCode'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-white text-sm font-medium mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {(field === 'phone' || field === 'referralCode') && ' (Optional)'}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={
                    field === 'username' ? 'Choose a username' :
                      field === 'email' ? 'Your email address' :
                        field === 'password' ? 'Create a password' :
                          field === 'phone' ? 'Phone number' : 'Referral code'
                  }
                  className="w-full px-4 py-3 rounded-lg bg-transparent text-white placeholder-gray-400 border-2 border-[#474d57] hover:border-[#f0b90b] focus:outline-none focus:ring-2 focus:border-[#f0b90b] transition-colors caret-[#f0b90b]"
                />
              </div>
            ))}

            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-2 accent-[#f0b90b]"
              />
              <div className="ml-3 text-sm text-white">
                By creating an account, I agree to Binance's{' '}
                <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="underline cursor-pointer">Privacy Notice</span>.
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3 rounded-lg text-black font-semibold text-lg mb-6 hover:opacity-90 bg-[#f0b90b] disabled:opacity-50"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          <div className="space-y-3">
            {[
              { icon: 'google', text: 'Continue with Google' },
              { icon: 'apple', text: 'Continue with Apple' },
              { icon: 'telegram', text: 'Continue with Telegram' }
            ].map((item) => (
              <button key={item.text} className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-transparent border border-gray-600 text-white hover:bg-gray-800 relative">
                {item.icon === 'apple' ? (
                  <FaApple className="absolute left-4 text-xl" />
                ) : item.icon === 'google' ? (
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="absolute left-4" viewBox="0 0 24 24" ><g clip-path="url(#clip0_2445_976)"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.68 12.1818C19.68 11.6146 19.6291 11.0691 19.5345 10.5455H12V13.64H16.3055C16.12 14.64 15.5564 15.4873 14.7091 16.0546V18.0618H17.2945C18.8073 16.6691 19.68 14.6182 19.68 12.1818Z" fill="#4285F4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9997 20C14.1597 20 15.9706 19.2836 17.2942 18.0618L14.7088 16.0545C13.9924 16.5345 13.076 16.8182 11.9997 16.8182C9.91604 16.8182 8.1524 15.4109 7.52331 13.52H4.85059V15.5927C6.16695 18.2073 8.8724 20 11.9997 20Z" fill="#34A853"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.52364 13.52C7.36364 13.04 7.27273 12.5273 7.27273 12C7.27273 11.4727 7.36364 10.96 7.52364 10.48V8.40729H4.85091C4.30909 9.48729 4 10.7091 4 12C4 13.2909 4.30909 14.5127 4.85091 15.5927L7.52364 13.52Z" fill="#FBBC05"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9997 7.18182C13.1742 7.18182 14.2288 7.58545 15.0579 8.37818L17.3524 6.08364C15.9669 4.79273 14.156 4 11.9997 4C8.8724 4 6.16695 5.79273 4.85059 8.40727L7.52331 10.48C8.1524 8.58909 9.91604 7.18182 11.9997 7.18182Z" fill="#EA4335"></path></g><defs><clipPath id="clip0_2445_976"><rect width="16" height="16" fill="none" transform="translate(4 4)"></rect></clipPath></defs>
                  </svg>
                ) : (
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-4"
                  >
                    <path d="M2.81274 9.27228C7.28665 7.32306 10.27 6.03802 11.7627 5.41715C16.0247 3.64445 16.9103 3.33651 17.4875 3.32634C17.6144 3.3241 17.8983 3.35557 18.0822 3.50477C18.2374 3.63075 18.2801 3.80094 18.3006 3.92038C18.321 4.03983 18.3465 4.31192 18.3263 4.52453C18.0953 6.95123 17.0959 12.8402 16.5875 15.5581C16.3724 16.7082 15.9488 17.0938 15.5387 17.1315C14.6475 17.2136 13.9707 16.5426 13.1076 15.9767C11.7568 15.0913 10.9938 14.5401 9.68265 13.6761C8.16744 12.6776 9.14969 12.1288 10.0132 11.232C10.2392 10.9972 14.1659 7.42557 14.2419 7.10157C14.2514 7.06104 14.2603 6.90999 14.1705 6.83024C14.0808 6.75048 13.9483 6.77775 13.8528 6.79944C13.7173 6.83019 11.5595 8.25641 7.37938 11.0781C6.7669 11.4987 6.21213 11.7036 5.71508 11.6929C5.16711 11.681 4.11306 11.383 3.32947 11.1283C2.36838 10.8159 1.60451 10.6507 1.67103 10.1202C1.70568 9.84381 2.08624 9.56118 2.81274 9.27228Z" fill="#00AEED"></path>
                  </svg>
                )}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Always visible footer */}
      <div className="opacity-100 translate-y-0">
        <div className="mt-2 mb-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
          <button className="text-[#f0b90b] hover:text-yellow-400 font-medium">Sign up as an entity</button>
          <span className="text-gray-500">or</span>
          <button
            className="text-[#f0b90b] hover:text-yellow-400 font-medium"
            onClick={() => navigate('/signin')}
          >
            Log in
          </button>
        </div>

        <div className="px-4 py-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center gap-2 cursor-pointer hover:text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.546 2.393a.75.75 0 011.048.167c3.729 5.139 3.748 9.88 2.8 13.338a15.985 15.985 0 01-1.76 4.067c-.294.482-.56.858-.754 1.117a9.308 9.308 0 01-.301.38l-.02.023-.006.007-.002.002c0 .001-.001.002-.564-.494l.563.495a.75.75 0 01-1.127-.99m0 0l.012-.014c.01-.012.028-.032.05-.06.045-.054.112-.138.196-.25a12.5 12.5 0 00.672-.997 14.488 14.488 0 001.595-3.682c.842-3.075.861-7.335-2.568-12.062a.75.75 0 01.166-1.047M11.454 2.393a.75.75 0 00-1.048.167c-3.728 5.139-3.748 9.88-2.8 13.338a15.986 15.986 0 001.76 4.067c.294.482.56.858.754 1.117a9.308 9.308 0 00.301.38l.02.023.006.007.002.002c0 .001.001.002.564-.494l-.563.495a.75.75 0 001.127-.99m0 0l-.012-.014a7.939 7.939 0 01-.245-.31 12.5 12.5 0 01-.673-.997 14.485 14.485 0 01-1.595-3.682C8.21 12.427 8.191 8.167 11.62 3.44a.75.75 0 00-.166-1.047" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M3.25 8.57A.75.75 0 014 7.82h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zM3.25 15.43a.75.75 0 01.75-.75h16a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20.5a8.5 8.5 0 110-17 8.5 8.5 0 010 17zm0 1.5C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="currentColor"></path>
              </svg>
              <span>English (India)</span>
            </div>
            {['Cookies', 'Terms', 'Privacy'].map((text) => (
              <button key={text} className="hover:text-white">
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinanceSignup;
