'use client'

import { signIn } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Cctv } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const res = await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirect: false,
      })

      if (res?.error) {
        setError('بيانات الاعتماد غير صالحة')
        return
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setError('حدث خطأ')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center p-4" dir="rtl">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 rounded-[30px] shadow-2xl">
          <div className="text-center">
            <div className=" mx-auto mb-6 flex items-center justify-center">
              <Cctv className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">تسجيل الدخول</h2>
            <p className="mt-2 text-sm text-zinc-400">الرجاء إدخال بيانات الاعتماد الخاصة بك</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-white/5 border border-white/10 text-white p-4 rounded-2xl text-sm text-center backdrop-blur-sm animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-2">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-3 pr-12 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
                    placeholder="ادخل اسم المستخدم"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-3 pr-12 py-3 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 border border-emerald-500/30 rounded-2xl text-sm font-medium text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all duration-200 shadow-lg relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-lg"></div>
              <span className="relative z-10">دخول</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}