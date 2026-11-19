const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center justify-center">
        <span className="text-[11px] font-medium tracking-wide text-slate-400">
          Powered by{" "}
          <span className="font-semibold text-slate-500">
            JGroup Technologies
          </span>{" "}
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
