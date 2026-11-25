const Footer = () => {
  return (
    <footer className="border-t bg-background px-6 py-3">
      <div className="flex items-center justify-center">
        <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold text-foreground/70">
            JGroup Technologies
          </span>{" "}
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}

export default Footer
