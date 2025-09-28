import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Code,
  Palette,
  Download,
  Sparkles,
  Clock,
  Shield,
  Globe,
  Play,
  Star,
} from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/create');
    onNavigate('create');
  };

  const handleViewProjects = () => {
    navigate('/dashboard');
    onNavigate('dashboard');
  };

  const features = [
    {
      icon: Code,
      title: 'Pure HTML, CSS & JS',
      description: 'Generate clean, semantic HTML with modern CSS and vanilla JavaScript. No frameworks, just pure web standards.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Real-time Generation',
      description: 'Watch your project come to life in real-time as AI writes each file. See the magic happen instantly.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Palette,
      title: 'Beautiful Design',
      description: 'Get production-ready designs with modern aesthetics, responsive layouts, and smooth animations.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'All generated code follows best practices, includes proper validation, and is ready for deployment.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Clock,
      title: 'Iterative Improvements',
      description: 'AI continuously improves your code through multiple iterations, enhancing performance and quality.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Download,
      title: 'Instant Download',
      description: 'Download your complete project as a ZIP file, ready to deploy or customize further.',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer',
      content: 'This AI code generator saved me hours of work. The code quality is impressive and the real-time generation is fascinating to watch.',
      rating: 5,
    },
    {
      name: 'Mike Rodriguez',
      role: 'Web Designer',
      content: 'I love how it generates beautiful, responsive designs without any frameworks. Perfect for quick prototypes and landing pages.',
      rating: 5,
    },
    {
      name: 'Alex Johnson',
      role: 'Startup Founder',
      content: 'As a non-technical founder, this tool helped me create professional web pages for my business. Highly recommended!',
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative px-4 py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Claude AI</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Generate{' '}
              <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Production-Ready
              </span>
              <br />
              Web Projects
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Create beautiful, responsive websites with pure HTML, CSS, and JavaScript.
              Watch AI generate your project in real-time.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewProjects}
              className="btn-outline text-lg px-8 py-4 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>View Demo</span>
            </motion.button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Pure Web Standards</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Real-time Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Production Ready</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-bounce-soft" />
          <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse-soft" />
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-bounce-soft" />
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to Build Amazing Websites
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform provides all the tools and features you need to create
              professional websites without writing a single line of code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="card group hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What Developers Are Saying
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of developers who are already using our AI code generator
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="card"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Create Your Next Project?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Start building beautiful websites with AI in just a few clicks.
              No coding experience required.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="btn-primary text-xl px-10 py-5 flex items-center space-x-3 mx-auto"
            >
              <Zap className="w-6 h-6" />
              <span>Start Creating Now</span>
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;