'use client';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
      <div className="w-16 h-16 border-4 border-white/40 rounded-full animate-spin border-t-white"></div>
    </div>
  );
};

export default Loading;