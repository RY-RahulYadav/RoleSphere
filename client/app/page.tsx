'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, LayoutDashboard, Lock, Code, Users, FileEdit, Eye, Menu, X } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isHovering, setIsHovering] = useState<string | false>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <>
    <div className="bg-white">
      
    <div className="">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-gray-100 w-[90vw] mx-auto" style={{"width":"90vw"}}>
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg animate-float">
              RS
            </div>
            <h1 className="ml-2 text-2xl font-bold text-brand-gradient">
              RoleSphere
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link href="/login" className="text-gray-700 hover:text-brand-primary font-medium">
              Login
            </Link> */}
            <Link href="/login" className="bg-brand-gradient hover:opacity-90 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-md hover:shadow-lg">
              Get Started <ArrowRight size={16} className="ml-1" />
            </Link>
            
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in">
            <div className=" mx-auto px-4 py-4 flex flex-col space-y-3">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-brand-primary font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/login" 
                className="bg-brand-gradient text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
<div className='bg-gradient-to-b from-slate-50 to-white'>
       <section className="relative overflow-hidden pt-28 pb-20 w-[90vw] mx-auto" style={{"width":"90vw"}}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-light opacity-10"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 rounded-full bg-brand-secondary opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-brand-primary opacity-10"></div>
        </div>

        <div className="mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="lg:w-1/2">
            <div className="animate-fade-in">
              <span className="inline-block bg-primary-light dark:bg-primary-light/30 text-brand-primary font-semibold px-4 py-1.5 rounded-full mb-6">
                Role-Based Access Control System
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                Personalized <span className="text-brand-gradient">Dashboards</span> for Every Role
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
                From admins to viewers, everyone gets exactly what they need — and nothing they shouldn't.
              </p>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Access the right tools, at the right time.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/login" className="bg-brand-gradient hover:opacity-90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl">
                  🚀 Try Demo
                </Link>
                <a href="https://github.com/RY-RahulYadav/RoleSphere" target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-300 flex items-center shadow-md hover:shadow-lg">
                  📂 View on GitHub
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-16 lg:mt-0 animate-float flex justify-center">
            <div className="relative w-full">
              {/* Browser Window */}
              <div className="relative shadow-2xl rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-t-2xl flex items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
                    <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                    <span>RoleSphere Dashboard</span>
                  </div>
                </div>
                
                {/* Dashboard Preview */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Sidebar */}
                    <div className="md:w-1/4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                      <div className="h-8 w-full bg-brand-gradient rounded-md mb-6"></div>
                      <div className="space-y-4">
                        <div className="h-8 w-full bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center px-3">
                          <div className="w-4 h-4 rounded-full bg-brand-primary mr-3"></div>
                          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                        <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center px-3">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                        <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center px-3">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                        <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center px-3">
                          <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="md:w-3/4">
                      <div className="h-10 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm flex items-center px-4 mb-4">
                        <div className="h-4 w-3/4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="ml-auto h-6 w-6 rounded-full bg-brand-gradient"></div>
                      </div>
                      
                      {/* Dashboard Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-50 dark:border-gray-700">
                          <div className="flex items-center mb-3">
                            <div className="h-6 w-6 rounded bg-primary-light dark:bg-primary-light/30 mr-3"></div>
                            <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                          </div>
                          <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <div className="text-2xl font-bold text-brand-primary">28</div>
                          </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-50 dark:border-gray-700">
                          <div className="flex items-center mb-3">
                            <div className="h-6 w-6 rounded bg-purple-100 dark:bg-purple-900/30 mr-3"></div>
                            <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-700 rounded"></div>
                          </div>
                          <div className="h-16 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <div className="text-2xl font-bold text-brand-secondary">14</div>
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-50 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                              <div className="h-5 w-1/3 bg-gray-100 dark:bg-gray-700 rounded"></div>
                              <div className="flex space-x-2">
                                <div className="h-4 w-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                                <div className="h-4 w-8 bg-brand-gradient rounded"></div>
                              </div>
                            </div>
                            <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end p-4 space-x-4">
                              <div className="w-1/6 h-40% bg-brand-gradient rounded-t"></div>
                              <div className="w-1/6 h-60% bg-brand-gradient rounded-t"></div>
                              <div className="w-1/6 h-80% bg-brand-gradient rounded-t"></div>
                              <div className="w-1/6 h-50% bg-brand-gradient rounded-t"></div>
                              <div className="w-1/6 h-70% bg-brand-gradient rounded-t"></div>
                              <div className="w-1/6 h-90% bg-brand-gradient rounded-t"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-2xl opacity-70 animate-pulse-slow"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-2xl opacity-70 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>
</div> 
      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 w-[90vw] mx-auto" style={{"width":"90vw"}}>
        <div className=" mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary-light dark:bg-primary-light/30 text-brand-primary rounded-full mb-4">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for <span className="text-brand-gradient">Role-Based</span> Management
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our platform provides comprehensive tools to manage access, content, and user experiences tailored to each role in your organization.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 card-hover">
              <div className="h-14 w-14 rounded-xl bg-brand-gradient flex items-center justify-center mb-6 shadow-md">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Role-Based Access Control</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Grant the right permissions to the right people. Admins manage users, editors control content, and viewers browse — all with tailored access.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 card-hover">
              <div className="h-14 w-14 rounded-xl bg-brand-gradient flex items-center justify-center mb-6 shadow-md">
                <LayoutDashboard size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Unified Admin Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300">
                One dashboard, many faces. Different UI and data based on who's logged in, providing a personalized experience for every user role.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 card-hover">
              <div className="h-14 w-14 rounded-xl bg-brand-gradient flex items-center justify-center mb-6 shadow-md">
                <Lock size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Secure API Protection</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Role checks on both the front end and back end ensure no one steps beyond their limits, keeping your data secure at all times.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 card-hover">
              <div className="h-14 w-14 rounded-xl bg-brand-gradient flex items-center justify-center mb-6 shadow-md">
                <Code size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Built with Modern Tech</h3>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium text-brand-primary dark:text-brand-secondary">Frontend:</span> Next.js for seamless, dynamic pages with client-side route guards.<br/>
                <span className="font-medium text-brand-primary dark:text-brand-secondary">Backend:</span> Express.js with role-based middleware for strong authorization.<br/>
                <span className="font-medium text-brand-primary dark:text-brand-secondary">Database:</span> MongoDB storing role-aware user data.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 card-hover">
              <div className="h-14 w-14 rounded-xl bg-brand-gradient flex items-center justify-center mb-6 shadow-md">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">User Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive tools to manage user accounts, permissions, and roles. Add, remove, or modify user access with just a few clicks.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 card-hover">
              <div className="h-14 w-14 rounded-xl bg-brand-gradient flex items-center justify-center mb-6 shadow-md">
                <Eye size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activity Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track user activities and system events with detailed logs. Monitor who does what and when, ensuring accountability across your platform.
              </p>
            </div>
          </div>
        </div>
      </section>

    

 



      {/* Footer */}
      
    </div></div>
    <footer className="bg-gray-900 text-gray-400 w-full ">
        <div className="w-[90vw] mx-auto px-4" style={{"width":"90vw"}}>
         
          <div className="border-t border-gray-800 py-10 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} RoleSphere. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

