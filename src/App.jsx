import React, { useState, useEffect } from 'react';
import { Plus, X, Calendar, Tag, Skull, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import Auth from './Auth';

export default function DarkPhilosophyBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Life', tags: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const categories = ['All', 'Philosophy', 'Technology', 'Life'];

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load posts from Supabase
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

  const handleCreatePost = async () => {
    if (newPost.title && newPost.content) {
      try {
        const post = {
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          date: new Date().toISOString().split('T')[0],
          tags: newPost.tags.split(',').map(t => t.trim()).filter(t => t)
        };

        const { data, error } = await supabase
          .from('posts')
          .insert([post])
          .select();

        if (error) throw error;

        setPosts([data[0], ...posts]);
        setNewPost({ title: '', content: '', category: 'Life', tags: '' });
        setIsCreating(false);
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory);

  // Show auth screen if checking or not logged in
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-300 text-xl">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-300 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      {/* Subtle noise texture */}
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
        {/* Admin indicator and logout */}
        {user && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
            <span className="text-zinc-500 text-sm">Admin: {user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-950 text-red-100 border border-red-800 hover:bg-red-900 transition-all flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Header */}
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

        {/* Category Filter */}
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

        {/* Create Post Button - Only show if authenticated */}
        {user && (
          <div className="text-center mb-12">
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-8 py-3 bg-red-950 text-red-100 font-semibold hover:bg-red-900 transition-all duration-300 border border-red-800 flex items-center gap-2 mx-auto"
            >
              {isCreating ? <X size={20} /> : <Plus size={20} />}
              {isCreating ? 'Abort' : 'New Fragment'}
            </button>
          </div>
        )}

        {/* Create Post Form - Only show if authenticated */}
        {user && isCreating && (
          <div className="mb-12 p-8 border border-red-900/50 bg-zinc-950 shadow-2xl">
            <input
              type="text"
              placeholder="Title..."
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="w-full mb-4 p-4 bg-black border border-zinc-800 text-red-50 placeholder-zinc-700 focus:outline-none focus:border-red-900 text-lg"
            />
            <textarea
              placeholder="Share your thoughts..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              rows="8"
              className="w-full mb-4 p-4 bg-black border border-zinc-800 text-red-50 placeholder-zinc-700 focus:outline-none focus:border-red-900 text-lg leading-relaxed"
            />
            <div className="flex gap-4 mb-4">
              <select
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                className="flex-1 p-4 bg-black border border-zinc-800 text-red-50 focus:outline-none focus:border-red-900"
              >
                <option>Philosophy</option>
                <option>Technology</option>
                <option>Life</option>
              </select>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                className="flex-1 p-4 bg-black border border-zinc-800 text-red-50 placeholder-zinc-700 focus:outline-none focus:border-red-900"
              />
            </div>
            <button
              onClick={handleCreatePost}
              className="w-full py-4 bg-red-950 text-red-100 font-semibold hover:bg-red-900 transition-all duration-300 text-lg border border-red-800"
            >
              Publish
            </button>
          </div>
        )}

        {/* Posts */}
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
            <p className="text-lg mt-2">Start sharing your ideas</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center text-zinc-700 border-t border-zinc-900 pt-8">
          <div className="w-24 h-px bg-red-900/30 mx-auto mb-4"></div>
          <p className="text-xs tracking-widest uppercase">MMXXVI</p>
          <p className="text-xs mt-2 text-zinc-800 italic">In pursuit of wisdom</p>
        </footer>
      </div>
    </div>
  );
}