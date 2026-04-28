import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { contactSchema } from '../../lib/validation';
import type { ContactInput } from '../../lib/validation';

type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 border-2 rounded-xl text-sm text-[#1a0508] placeholder:text-[#d4d4d4] focus:outline-none transition-all duration-200 bg-white ${
    hasError ? 'border-[#64020e] bg-[#fdf2f2]' : 'border-[#e5e5e5] focus:border-[#64020e]'
  }`;

export function ContactPage() {
  const [formData, setFormData] = useState<ContactInput>({
    firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id as keyof ContactInput]) setFieldErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactInput;
        if (field && !errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent!', { description: "We'll get back to you within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1a0508] mb-4">Get in Touch</h1>
          <p className="text-[#737373] max-w-xl mx-auto leading-relaxed">
            Have a question or need assistance? Our team is here to help you find the perfect pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3 bg-[#f5f5f5] rounded-3xl p-8 md:p-10">
            <h2 className="text-xl font-semibold text-[#1a0508] mb-7">Send us a Message</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-14 text-center gap-5">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1a0508] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[#737373]">Thank you, {formData.firstName}. We'll get back to you within 24 hours.</p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ firstName: '', lastName: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                  className="text-sm text-[#64020e] hover:underline font-medium">
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="firstName" className="block mb-1.5 text-sm font-medium text-[#1a0508]">
                      First Name <span className="text-[#64020e]">*</span>
                    </label>
                    <input type="text" id="firstName" value={formData.firstName} onChange={handleChange}
                      className={inputClass(Boolean(fieldErrors.firstName))} placeholder="John" />
                    {fieldErrors.firstName && <p className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-1.5 text-sm font-medium text-[#1a0508]">Last Name</label>
                    <input type="text" id="lastName" value={formData.lastName} onChange={handleChange}
                      className={inputClass(false)} placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-[#1a0508]">
                    Email Address <span className="text-[#64020e]">*</span>
                  </label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange}
                    className={inputClass(Boolean(fieldErrors.email))} placeholder="john@example.com" />
                  {fieldErrors.email && <p className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1.5 text-sm font-medium text-[#1a0508]">
                    Phone <span className="text-[#737373] font-normal text-xs">(Optional)</span>
                  </label>
                  <input type="tel" id="phone" value={formData.phone} onChange={handleChange}
                    className={inputClass(false)} placeholder="+1 (555) 000-0000" />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-1.5 text-sm font-medium text-[#1a0508]">Subject</label>
                  <select id="subject" value={formData.subject} onChange={handleChange}
                    className={`${inputClass(false)} cursor-pointer`}>
                    <option>General Inquiry</option>
                    <option>Order Status</option>
                    <option>Product Information</option>
                    <option>Returns & Exchanges</option>
                    <option>Styling Consultation</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-1.5 text-sm font-medium text-[#1a0508]">
                    Message <span className="text-[#64020e]">*</span>
                  </label>
                  <textarea id="message" rows={5} value={formData.message} onChange={handleChange}
                    className={`${inputClass(Boolean(fieldErrors.message))} resize-none`}
                    placeholder="Tell us how we can help..." />
                  {fieldErrors.message && <p className="mt-1.5 text-xs text-[#64020e] font-medium">{fieldErrors.message}</p>}
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full btn-brand justify-center py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" />Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact cards */}
            {[
              { icon: MapPin, title: 'Visit Our Atelier', lines: ['Via Montenapoleone 12', '20121 Milan, Italy'] },
              { icon: Phone, title: 'Call Us', lines: ['+39 02 7600 1234', 'Mon–Sat: 10:00–19:00 CET'] },
              { icon: Mail, title: 'Email Us', lines: ['contact@fashion-foresight-menswear.com', 'We respond within 24 hours'] },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-white border border-[#e5e5e5] rounded-2xl hover:border-[#64020e]/30 transition-colors">
                <div className="w-10 h-10 bg-[#fdf2f2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#64020e]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a0508] mb-1">{title}</p>
                  {lines.map((l) => <p key={l} className="text-sm text-[#737373]">{l}</p>)}
                </div>
              </div>
            ))}

            {/* Hours */}
            <div className="p-5 bg-white border border-[#e5e5e5] rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#fdf2f2] rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#64020e]" />
                </div>
                <p className="text-sm font-semibold text-[#1a0508]">Business Hours</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { day: 'Monday – Friday', hours: '10:00 – 19:00' },
                  { day: 'Saturday', hours: '10:00 – 18:00' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="text-[#737373]">{day}</span>
                    <span className={`font-medium ${hours === 'Closed' ? 'text-[#64020e]' : 'text-[#1a0508]'}`}>{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Styling CTA */}
            <div className="p-6 bg-[#1a0508] rounded-2xl">
              <p className="text-[10px] text-[#d4a0a0] uppercase tracking-[0.2em] font-semibold mb-2">Exclusive</p>
              <h3 className="text-base font-semibold text-white mb-2">Personal Styling</h3>
              <p className="text-sm text-white/50 mb-4 leading-relaxed">Book a complimentary bespoke consultation with our master tailors.</p>
              <button className="btn-brand text-xs px-5 py-2.5">Schedule Appointment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
