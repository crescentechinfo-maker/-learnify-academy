import { GraduationCap, Zap, Globe, Shield, Users, Award, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

const team = [
  { name: 'Alex Rivera', role: 'CEO & Co-Founder', avatar: 'AR', bio: 'Former Google Engineer with 10+ years in EdTech' },
  { name: 'Maya Johnson', role: 'Chief Learning Officer', avatar: 'MJ', bio: 'PhD in Educational Psychology, ex-Stanford faculty' },
  { name: 'David Kim', role: 'CTO', avatar: 'DK', bio: 'Full-stack architect, open-source contributor' },
]

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm mb-6">
          <GraduationCap size={14} />
          About Learnify AI Academy
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          We're on a mission to<br />
          <span className="gradient-text">democratize education</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          Learnify AI Academy was founded with the belief that everyone deserves access to world-class education.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-24">
        {[
          { icon: Zap, title: 'Innovation', desc: 'We continuously push the boundaries of educational technology to create better learning outcomes.' },
          { icon: Globe, title: 'Accessibility', desc: "Education should be available to everyone, everywhere. We're removing barriers to learning." },
          { icon: Shield, title: 'Quality', desc: 'Every course goes through rigorous quality review to ensure the highest learning standards.' },
        ].map((val) => (
          <div key={val.title} className="glass rounded-2xl p-8 border border-gray-200 dark:border-white/8 text-center hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center mx-auto mb-4">
              <val.icon size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{val.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{val.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-10 mb-24 border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-transparent">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, value: '10K+', label: 'Active Students' },
            { icon: BookOpen, value: '500+', label: 'Expert Courses' },
            { icon: Award, value: '8K+', label: 'Certificates Issued' },
            { icon: Globe, value: '50+', label: 'Countries' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon size={24} className="text-indigo-500 mx-auto mb-2" />
              <div className="text-3xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="glass rounded-2xl p-8 border border-gray-200 dark:border-white/8 text-center group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                {member.avatar}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-1 mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center glass rounded-3xl p-12 border border-gray-200 dark:border-white/10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Join Our Community</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">Start your learning journey today and join thousands of students transforming their careers.</p>
        <Link to="/register"><Button size="lg" variant="gold">Get Started Free</Button></Link>
      </div>
    </div>
  )
}
