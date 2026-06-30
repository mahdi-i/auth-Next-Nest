function BGAuth() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute -top-40 -left-40 h-120 w-120 rounded-full bg-primary/25 blur-[140px] animate-blob" />

      <div className="absolute top-0 right-40 h-md w-md rounded-full bg-[oklch(0.5_0.12_165)]/20 blur-[130px] animate-blob [animation-delay:2s]" />

      <div className="absolute bottom-18 left-1/4 h-90 w-90 rounded-full bg-primary/20 blur-[120px] animate-blob [animation-delay:4s]" />

      <div className="absolute bottom-60 right-32 h-110 w-110 rounded-full bg-[oklch(0.5_0.12_165)]/20 blur-[140px] animate-blob [animation-delay:6s]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

export default BGAuth;
