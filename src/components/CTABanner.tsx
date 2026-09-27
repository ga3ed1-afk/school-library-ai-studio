import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="py-8 lg:py-16 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-3xl bg-sky-400 text-white p-8 lg:p-16 min-h-[300px] lg:min-h-[400px] flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0.8)), url('https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=2000')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Decorative Shapes */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-10 left-10 w-48 h-48 pointer-events-none"
          >
            <img 
              src="https://oxfordcity.tn/cdn/shop/files/LOGO_oxford1_32x32.png?v=1746725742" 
              alt="" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl lg:text-5xl font-black mb-6 leading-tight"
            >
              احصل على خصم <span className="text-oxford-red">25%</span> على جميع المنتجات
              <br />
              <span className="text-lg lg:text-2xl opacity-80 font-bold">أنواع المنتجات الأكثر مبيعاً</span>
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link 
                to="/category/الكل" 
                className="inline-flex items-center gap-2 bg-oxford-red hover:bg-white hover:text-oxford-red text-white px-8 py-3 rounded-full font-black text-lg transition-all shadow-xl group"
              >
                تسوق الآن
                <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-12 h-12 bg-white/10 rounded-full blur-xl"
          />
        </div>
      </div>
    </section>
  );
}
