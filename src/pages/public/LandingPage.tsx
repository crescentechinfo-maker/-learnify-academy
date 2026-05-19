import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowRight, Play, Star, BookOpen, Award, Zap, Globe, Shield, TrendingUp,
  CheckCircle, ChevronRight,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { CourseCard } from '../../components/CourseCard'
import { getCourses } from '../../lib/courses'
import type { Course } from '../../types'

const features = [
  { icon: Zap, title: 'AI-Powered Learning', desc: 'Personalized learning paths adapted to your pace and style.' },
  { icon: Globe, title: 'Learn Anywhere', desc: 'Access courses on any device, online or offline, anytime.' },
  { icon: Shield, title: 'Verified Certificates', desc: 'Earn industry-recognized certificates upon completion.' },
  { icon: TrendingUp, title: 'Track Progress', desc: 'Real-time progress tracking with detailed analytics.' },
]

const stats = [
  { value: '10K+', label: 'Active Students' },
  { value: '500+', label: 'Expert Courses' },
  { value: '95%', label: 'Completion Rate' },
  { value: '4.9★', label: 'Average Rating' },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    text: 'Learnify AI transformed my career. The courses are world-class and the certificate got me my dream job!',
    avatar: 'SC',
  },
  {
    name: 'Marcus Williams',
    role: 'Data Scientist',
    text: 'The AI-powered learning paths are incredible. I went from beginner to pro in just 3 months.',
    avatar: 'MW',
  },
  {
    name: 'Priya Patel',
    role: 'UX Designer',
    text: 'Best investment I\'ve ever made in my education. The quality and depth of content is unmatched.',
    avatar: 'PP',
  },
]

export function LandingPage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])

  useEffect(() => {
    getCourses().then((courses) => setFeaturedCourses(courses.slice(0, 3)))
  }, [])

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm mb-6">
                <Zap size={14} className="text-amber-500 dark:text-amber-400" />
                AI-Powered E-Learning Platform
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Learn
                <span className="gradient-text"> Smarter,</span>
                <br />
                Grow Faster
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-6 leading-relaxed max-w-lg">
                Master in-demand skills with expert-led courses. Get certified, track your progress, and accelerate your career with Learnify AI Academy.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/register">
                  <Button size="lg" variant="gold" icon={<ArrowRight size={18} />}>
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="secondary" icon={<Play size={18} />}>
                    Browse Courses
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {['SC', 'MW', 'PP', 'JK'].map((init) => (
                    <div key={init} className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-100 dark:border-gray-950">
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Trusted by 10,000+ learners</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative glass rounded-3xl p-8 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs text-gray-500">learnify-ai.app</span>
                </div>
                <div className="space-y-4">
                  {['Web Development', 'Data Science', 'UI/UX Design', 'Machine Learning'].map((course, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center">
                        <BookOpen size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{course}</p>
                        <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                            style={{ width: `${[75, 45, 90, 30][i]}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">{[75, 45, 90, 30][i]}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-400/10 border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Award size={20} className="text-amber-500 dark:text-amber-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Certificate Earned!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Web Development Mastery</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-600/30 to-indigo-400/10 rounded-2xl blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-yellow-400/10 rounded-2xl blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 dark:border-white/10 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Why Choose Learnify AI?</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Experience the future of learning with our cutting-edge platform designed for modern learners.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/8 hover:border-indigo-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="py-24 bg-gray-100 dark:bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Start learning with our most popular courses</p>
              </div>
              <Link to="/courses">
                <Button variant="ghost" icon={<ChevronRight size={16} />}>
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">What Our Students Say</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Join thousands of learners who transformed their careers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 dark:from-indigo-900/20 to-amber-100/30 dark:to-amber-900/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your <span className="gradient-text">Learning Journey?</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Join over 10,000 students already learning on Learnify AI Academy. Get started for free today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="gold" icon={<ArrowRight size={18} />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="secondary">
                Explore Courses
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            {['No credit card required', 'Cancel anytime', '30-day money back'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
