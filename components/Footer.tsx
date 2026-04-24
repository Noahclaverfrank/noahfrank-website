const TEXT = '#EDEAE3';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D0B0A', color: TEXT }} className="border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">

          <div>
            <p className="text-2xl font-semibold tracking-tight leading-none mb-1" style={{ color: TEXT }}>
              Noah Frank
            </p>
            <p className="text-sm mt-1" style={{ color: TEXT }}>
              Product &amp; Design
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span style={{ color: TEXT }}>Zürich, Switzerland</span>
            <a
              href="mailto:noahfrank361@gmail.com"
              className="hover:opacity-60 transition-opacity duration-200"
              style={{ color: TEXT, textDecoration: 'none' }}
            >
              noahfrank361@gmail.com
            </a>
            <a
              href="https://ch.linkedin.com/in/noah-f-a512b7153"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity duration-200"
              style={{ color: TEXT, textDecoration: 'none' }}
            >
              LinkedIn ↗
            </a>
          </div>

        </div>

        <p className="text-xs mt-14" style={{ color: TEXT }}>
          © {new Date().getFullYear()} Noah Frank
        </p>
      </div>
    </footer>
  );
}
