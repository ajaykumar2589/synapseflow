import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    api.get('/api/v1/portfolio').then(res => setData(res.data)).catch(console.error);
  }, []);

  // ADD THIS FUNCTION:
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFormStatus('');

    try {
      await api.post('/api/v1/contact', contactForm);
      setFormStatus('success');
      setContactForm({ name: '', email: '', message: '' }); // Clear the form
    } catch (error) {
      console.error("Failed to send message", error);
      setFormStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-xl font-bold text-gray-400">Loading Portfolio...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-800 selection:bg-blue-200 overflow-x-hidden">
      
      {/* Navbar matching the reference style */}
      <nav className="w-full py-6 px-12 flex justify-between items-center absolute top-0 z-50">
        <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">
          AC
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-500 tracking-wider">
          <a href="#home" className="hover:text-blue-600 transition">HOME</a>
          <a href="#experience" className="hover:text-blue-600 transition">WORK</a>
          <a href="#projects" className="hover:text-blue-600 transition">PORTFOLIO</a>
          <a href="#contact" className="hover:text-blue-600 transition">CONTACT</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="px-6 py-2 text-gray-600 font-bold hover:text-blue-600 transition">Login</Link>
          <Link to="/register" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* 1. HERO SECTION (The Floating UI Look) */}
      <section id="home" className="relative pt-40 pb-20 max-w-7xl mx-auto px-8 min-h-screen flex items-center">
        
        {/* Left Side: Text */}
        <div className="w-1/3 z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-3xl">👋</span>
            <p className="text-gray-500 font-medium">{data.hero.greeting}</p>
          </div>
          <h1 className="text-7xl font-extrabold text-black mb-6 tracking-tight">{data.hero.name.split(' ')[0]}</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 leading-loose max-w-xs">
            {data.hero.role}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            {data.hero.bio}
          </p>
        </div>

        {/* Center: Image */}
        <div className="w-1/3 flex justify-center relative z-10">
          {/* Replace 'profile.png' with your actual image in the public folder */}
          <div className="w-72 h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl relative z-20 bg-gray-200">
             <img src="/profile.png" alt="Ajay" className="w-full h-full object-cover" />
          </div>
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>

        {/* Right Side: Floating Tech Badges */}
        <div className="w-1/3 relative h-96 z-10">
        <div className="absolute top-4 right-48 w-24 h-24 bg-white rounded-full shadow-xl flex flex-col items-center justify-center transform hover:scale-110 transition duration-300">
            {/* Swap this emoji with your custom Java image like you did for the others! */}
            <span className="text-4xl mb-1 text-red-500">☕</span> 
            <span className="text-xs font-bold text-gray-600">Java</span>
          </div>
          {/* Spring Boot Badge */}
          <div className="absolute top-0 right-10 w-28 h-28 bg-white rounded-full shadow-xl flex flex-col items-center justify-center transform hover:scale-110 transition duration-300">
            <span className="text-3xl mb-1 text-green-500">🍃</span>
            <span className="text-xs font-bold text-gray-600">Spring</span>
          </div>
          {/* React Badge */}
          <div className="absolute top-1/2 right-32 w-36 h-36 bg-white rounded-full shadow-xl flex flex-col items-center justify-center transform hover:scale-110 transition duration-300">
            <span className="text-5xl mb-1 text-cyan-400">⚛️</span>
            <span className="text-sm font-bold text-gray-600">React</span>
          </div>
          {/* AWS Badge */}
          <div className="absolute bottom-0 right-16 w-24 h-24 bg-white rounded-full shadow-xl flex flex-col items-center justify-center transform hover:scale-110 transition duration-300">
            <span className="text-2xl mb-1 text-orange-500">☁️</span>
            <span className="text-xs font-bold text-gray-600">AWS</span>
          </div>
        </div>
      </section>

      {/* 2. EXPERIENCE SECTION */}
      <section id="experience" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-extrabold text-black mb-2">My Engineering <span className="text-blue-600">Experience</span></h2>
          <p className="text-gray-500 mb-16">Building enterprise-scale systems and AI applications.</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="bg-[#f8f9fa] p-8 rounded-2xl shadow-sm text-left hover:shadow-xl transition duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl font-bold text-blue-600 mb-6">
                  {exp.company.charAt(0)}
                </div>
                <h3 className="text-xl font-extrabold text-black mb-1">{exp.title}</h3>
                <p className="text-sm text-blue-600 font-bold mb-4">{exp.company} | {exp.period}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CREATIVE PORTFOLIO SECTION */}
      <section id="projects" className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-black">My Creative <span className="text-blue-600">Portfolio</span> Section</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition duration-300 border border-gray-100">
                <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-4xl text-white opacity-50">💻 Project</span>
                </div>
                <div className="p-8 text-center relative">
                  <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                    {proj.category}
                  </span>
                  <h3 className="text-2xl font-extrabold text-black mt-4 mb-3">{proj.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{proj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION */}
      <section id="contact" className="py-20 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-black">Take A Coffee And <span className="text-blue-600">Chat</span></h2>
          </div>

          {/* Email & Phone Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
            <a href={`mailto:${data.contact.email}`} className="flex items-center bg-[#fff0f0] px-8 py-5 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 border border-red-50">
              <span className="text-3xl mr-4">📧</span>
              <span className="text-gray-800 font-bold">{data.contact.email}</span>
            </a>
            <a href={`tel:${data.contact.phone}`} className="flex items-center bg-[#f0f7ff] px-8 py-5 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1 border border-blue-50">
              <span className="text-3xl mr-4">📱</span>
              <span className="text-gray-800 font-bold">{data.contact.phone}</span>
            </a>
          </div>

          {/* Contact Form with Soft Glow Effects */}
          {/* Contact Form with Soft Glow Effects */}
          <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSendMessage}>
            
            {formStatus === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-bold border border-green-100">
                ✅ Message sent successfully! I'll get back to you soon.
              </div>
            )}
            
            <input 
              type="text" 
              placeholder="Your Name" 
              required
              value={contactForm.name}
              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
              className="w-full bg-white border border-gray-100 rounded-xl p-5 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm transition"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              required
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              className="w-full bg-white border border-gray-100 rounded-xl p-5 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm transition"
            />
            <textarea 
              placeholder="Your Message" 
              rows="5"
              required
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              className="w-full bg-white border border-gray-100 rounded-xl p-5 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm transition"
            ></textarea>
            
            <div className="text-center">
              <button 
                type="submit" 
                disabled={isSending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-12 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-blue-400 disabled:transform-none"
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>

      
    </div>
  );
}