const CloudBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      {/* Floating clouds */}
      <div className="cloud-float absolute top-20 left-10 w-32 h-16 bg-white/40 rounded-full blur-xl" />
      <div className="cloud-float-delayed absolute top-40 right-20 w-48 h-20 bg-white/30 rounded-full blur-xl" />
      <div className="cloud-float absolute top-60 left-1/3 w-40 h-16 bg-white/35 rounded-full blur-xl" />
      <div className="cloud-float-delayed absolute top-80 right-1/4 w-56 h-24 bg-white/25 rounded-full blur-xl" />
      <div className="cloud-float absolute bottom-40 left-1/4 w-44 h-18 bg-white/30 rounded-full blur-xl" />
      <div className="cloud-float-delayed absolute bottom-60 right-1/3 w-36 h-14 bg-white/40 rounded-full blur-xl" />
    </div>
  );
};

export default CloudBackground;
