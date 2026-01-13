import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      details: ['+92 300 1234567', '+92 321 1234567'],
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      details: ['support@cosmeticsstore.com', 'sales@cosmeticsstore.com'],
      color: 'text-red-600 bg-red-50',
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      details: ['DHA Phase 5, Karachi', 'Pakistan'],
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: <FaClock />,
      title: 'Business Hours',
      details: ['Monday - Friday: 9AM - 10PM', 'Saturday - Sunday: 10AM - 8PM'],
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const subjects = [
    'Order Inquiry',
    'Product Information',
    'Shipping & Delivery',
    'Returns & Refunds',
    'Account Issues',
    'Wholesale Inquiry',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help! Whether you have questions about products, orders, 
            or just want to say hello, we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`p-3 rounded-xl mr-4 ${info.color}`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-10 pt-8 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200">
                    <FaFacebook size={20} />
                  </a>
                  <a href="#" className="p-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200">
                    <FaInstagram size={20} />
                  </a>
                  <a href="#" className="p-3 bg-blue-100 text-blue-400 rounded-xl hover:bg-blue-200">
                    <FaTwitter size={20} />
                  </a>
                  <a href="#" className="p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200">
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </div>

              {/* WhatsApp Direct */}
              <div className="mt-8">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-semibold"
                >
                  <FaWhatsapp />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0300 1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    * Required fields
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-8 rounded-xl font-semibold text-lg disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'How long does shipping take?',
                    a: 'Standard shipping takes 3-7 business days. Express shipping is available for major cities.',
                  },
                  {
                    q: 'What is your return policy?',
                    a: 'We offer a 14-day return policy for unopened and unused products in original packaging.',
                  },
                  {
                    q: 'Do you ship internationally?',
                    a: 'Currently, we only ship within Pakistan. We plan to expand internationally soon.',
                  },
                  {
                    q: 'Are your products authentic?',
                    a: 'Yes, all our products are 100% authentic and sourced directly from authorized distributors.',
                  },
                ].map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="h-96 bg-gray-200 relative">
                {/* This would be a real Google Map in production */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-bold">Our Location</h3>
                    <p className="text-gray-600">DHA Phase 5, Karachi, Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4">Visit Our Store</h3>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Address:</strong> DHA Phase 5, Karachi, Pakistan
                </p>
                <p className="text-gray-600">
                  <strong>Hours:</strong> 9AM - 10PM (Mon-Fri)
                </p>
                <p className="text-gray-600">
                  <strong>Parking:</strong> Free parking available
                </p>
                <p className="text-gray-600">
                  <strong>Facilities:</strong> AC, Fitting rooms, Expert consultation
                </p>
              </div>
              <button className="mt-6 w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-semibold">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;