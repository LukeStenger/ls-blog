import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Skull } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function PublicBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Philosophy', 'Technology', 'Life'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-300 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        
        * {
          font-family: 'Crimson Text', serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        .post-card {
          animation: fadeIn 0.8s ease-out;
        }
        
        ::selection {
          background: #dc2626;
          color: #000;
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative">
        <header className="text-center mb-16 pt-8 border-b border-red-900/30 pb-12">
          <div className="mb-6">
            <Skull className="w-12 h-12 mx-auto text-red-900 mb-4" strokeWidth={1} style={{ animation: 'pulse 3s ease-in-out infinite' }} />
            <div className="w-48 h-px bg-gradient-to-r from-transparent via-red-900 to-transparent mx-auto"></div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-red-50 tracking-tight">
            Thoughts & Reflections
          </h1>
          <p className="text-lg text-red-200/70 italic mb-2">Essays on Life and Ideas</p>
          <p className="text-sm text-red-300/50 tracking-widest uppercase">Philosophy • Technology • Life</p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-red-950 border-red-700 text-red-100'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-red-900 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="post-card p-8 border-l-4 border-red-900 bg-zinc-950 hover:bg-zinc-900 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="px-3 py-1 bg-red-950/50 border border-red-900/50 text-red-300 font-semibold uppercase tracking-wider text-xs">
                  {post.category}
                </span>
                <span className="flex items-center gap-2 text-zinc-600 italic">
                  <Calendar size={14} />
                  {post.date}
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-red-50 leading-tight">
                {post.title}
              </h2>
              
              <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
                {post.content}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                {post.tags && post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 px-3 py-1 bg-black border border-zinc-800 text-zinc-500 text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-zinc-600">
            <p className="text-2xl italic">No posts yet in this category</p>
            <p className="text-lg mt-2">Check back soon</p>
          </div>
        )}

        <footer className="mt-20 text-center text-zinc-700 border-t border-zinc-900 pt-8">
          <div className="w-24 h-px bg-red-900/30 mx-auto mb-4"></div>
          <p className="text-xs tracking-widest uppercase">MMXXVI</p>
          <p className="text-xs mt-2 text-zinc-800 italic">In pursuit of wisdom</p>
        </footer>
      </div>
    </div>
  );
}