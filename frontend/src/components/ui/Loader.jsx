const Loader = ({ text }) => (
    <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-dark-50 border-t-accent animate-spin-slow" />
        {text && <p className="text-muted text-sm">{text}</p>}
    </div>
);

export default Loader;
