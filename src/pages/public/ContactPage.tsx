import { useState, type FormEvent } from 'react'
import { Mail, User, Send, MapPin, Phone, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Textarea } from '../../components/ui/Textarea'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="space-y-6">
          {[
            { icon: Mail, title: 'Email Us', value: 'support@learnify.ai', sub: 'We reply within 24 hours' },
            { icon: Phone, title: 'Call Us', value: '+1 (800) 123-4567', sub: 'Mon-Fri 9am-6pm EST' },
            { icon: MapPin, title: 'Visit Us', value: 'San Francisco, CA', sub: 'United States' },
          ].map((item) => (
            <div key={item.title} className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/8 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 flex-shrink-0">
                <item.icon size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-indigo-600 dark:text-indigo-300 text-sm">{item.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-8 border border-gray-200 dark:border-white/10">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-600 dark:text-gray-400">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <Button onClick={() => setSent(false)} variant="ghost" className="mt-6">Send Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input label="Your Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={16} />} required />
                <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} required />
              </div>
              <Textarea label="Your Message" placeholder="Tell us how we can help you..." value={message} onChange={(e) => setMessage(e.target.value)} rows={6} required />
              <Button type="submit" loading={loading} icon={<Send size={16} />} size="lg">Send Message</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
