"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import BinanceLogo from "./BinanceLogo"
import { useTheme } from "../../context/ThemeContext"
import { Key, Chrome, Apple, Send } from 'lucide-react'
import { loginUser } from "../../services/api"
import { LoginInput } from "../../services/types"

const LoginPage = () => {
  const [form, setForm] = useState<LoginInput>({ email: "", password: "", twoFACode: "" })
  const [error, setError] = useState("")
  const [show2FA, setShow2FA] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  const loginMutation = useMutation({
    mutationFn: () => loginUser({ ...form, ...(show2FA && { twoFACode: form.twoFACode }) }),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    },
    onError: (err: Error) => {
      setError(
        err.message.includes('2FA') ? 'Please enter your 2FA code' : 
        err.message.includes('verified') ? 'Please verify your email first' : 
        err.message.includes('credentials') ? 'Invalid email or password' : 
        err.message.includes('disabled') ? 'Account is disabled' : 
        'Login failed. Please try again.'
      )
      if (err.message.includes('2FA')) setShow2FA(true)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    setForm({...form, [e.target.name]: e.target.value})

  const { bgColor, cardBg, textColor, borderColor, inputBg, socialBtn } = {
    bgColor: isDark ? "bg-[#0b0e11]" : "bg-gray-100",
    cardBg: isDark ? "bg-[#1e2026] border-[#2a2d35]" : "bg-white border-gray-200 shadow-md",
    textColor: isDark ? "text-white" : "text-gray-800",
    borderColor: isDark ? "border-[#474d57]" : "border-gray-300",
    inputBg: isDark ? "bg-[#2b3139] border-[#474d57] text-white placeholder-[#848e9c]" : "bg-white border-gray-300 text-gray-800 placeholder-gray-400",
    socialBtn: isDark ? "bg-[#1e2026] border-[#474d57] hover:bg-[#2b3139]" : "bg-white border-gray-300 hover:bg-gray-50"
  }

  const providers = [
    { name: "Passkey", icon: <Key className="w-4 h-4 mr-2" /> },
    { name: "Google", icon: <Chrome className="w-4 h-4 mr-2" /> },
    { name: "Apple", icon: <Apple className="w-4 h-4 mr-2" /> },
    { name: "Telegram", icon: <Send className="w-4 h-4 mr-2" /> }
  ]

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 ${bgColor}`}>
      <div className="w-full max-w-md relative">
        <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all">
          {isDark ? '☀️' : '🌙'}
        </button>

        <div className="flex justify-center mb-8"><BinanceLogo /></div>

        <div className={`rounded-lg p-8 ${cardBg} border`}>
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-2xl font-semibold ${textColor}`}>Log in</h1>
            <div className={`w-8 h-8 flex items-center justify-center ${borderColor} border`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 3H9V9H3V3ZM7 5H5V7H7V5Z M3 15H9V21H3V15ZM7 17H5V19H7V17Z M15 3H21V9H15V3ZM19 5H17V7H19V5Z M11 11H13V13H11V11Z M11 3H13V9H11V3Z M11 15H13V21H11V15Z M15 11H21V13H15V11Z M15 15H17V17H15V15Z M19 15H21V17H19V15Z M15 19H17V21H15V19Z M19 19H21V21H19V19Z M3 11H9V13H3V11Z" fill={isDark ? "#848E9C" : "#1E2329"} />
              </svg>
            </div>
          </div>

          {error && <div className={`mb-4 p-3 rounded-lg ${isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800"}`}>{error}</div>}

          <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate() }}>
            {['email', 'password'].map((field) => (
              <div key={field} className="mb-4">
                <label className={`block text-sm mb-2 ${isDark ? "text-[#b7bdc6]" : "text-gray-600"}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'password' ? 'password' : 'email'}
                  name={field}
                  value={form[field as keyof LoginInput]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${inputBg} border`}
                  required
                />
              </div>
            ))}

            {show2FA && (
              <div className="mb-4">
                <label className={`block text-sm mb-2 ${isDark ? "text-[#b7bdc6]" : "text-gray-600"}`}>2FA Code</label>
                <input
                  type="text"
                  name="twoFACode"
                  value={form.twoFACode}
                  onChange={handleChange}
                  placeholder="Enter 6-digit 2FA code"
                  className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-colors ${inputBg} border`}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#f0b90b] hover:bg-[#f8d12f] text-black font-medium py-3 rounded-lg transition-colors mb-6 disabled:opacity-50"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Next'}
            </button>
          </form>

          <div className="flex items-center justify-center mb-6">
            <div className={`flex-grow border-t ${borderColor}`} />
            <span className={`px-4 text-sm ${isDark ? "text-[#848e9c]" : "text-gray-500"}`}>or</span>
            <div className={`flex-grow border-t ${borderColor}`} />
          </div>

          <div className="space-y-3">
            {providers.map(({name, icon}) => (
              <button key={name} type="button" className={`w-full py-3 rounded-lg text-sm font-medium border flex items-center justify-center ${socialBtn}`}>
                {icon}Continue with {name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/')} className="text-[#f0b90b] hover:underline font-medium">
            Create Binance Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage