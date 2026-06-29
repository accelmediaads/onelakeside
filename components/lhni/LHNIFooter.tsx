import Image from "next/image";

const socialLinks = [
  {
    href: "https://www.facebook.com/luxuryhomesnorthidaho",
    label: "Facebook",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/luxury_homes_north_idaho",
    label: "Instagram",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/greg-rowley-63502361/",
    label: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@luxuryhomesnorthidaho",
    label: "YouTube",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function LHNIFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Branding */}
          <div className="space-y-6">
            <Image
              src="/logos/lhni-logo-white.png"
              alt="Luxury Homes North Idaho"
              width={180}
              height={180}
              className="h-20 w-auto"
            />
            <div className="space-y-1">
              <p className="text-sm text-[#f5f5f5] font-semibold">
                Greg Rowley
              </p>
              <p className="text-xs text-[#c9a96e] uppercase tracking-wider">
                Luxury Property Specialist
              </p>
            </div>
            <p className="text-sm text-[#8a8a8a] leading-relaxed">
              Coldwell Banker Schneidmiller Realty
              <br />
              101 N. 2nd Street
              <br />
              Coeur d&apos;Alene, ID 83814
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c9a96e]">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-[#8a8a8a]">
              <a
                href="tel:2086596527"
                className="block hover:text-[#c9a96e] transition-colors"
              >
                208-659-6527
              </a>
              <a
                href="mailto:growley@cbidaho.com"
                className="block hover:text-[#c9a96e] transition-colors"
              >
                growley@cbidaho.com
              </a>
              <a
                href="https://luxuryhomesnorthidaho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#c9a96e] transition-colors"
              >
                luxuryhomesnorthidaho.com
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8a8a8a] hover:text-[#c9a96e] transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c9a96e]">
              Legal
            </h3>
            <div className="space-y-3 text-xs text-[#666] leading-relaxed">
              <p>Idaho Real Estate License #SP39746</p>
              <p>
                Each office is independently owned and operated. Coldwell Banker
                and the Coldwell Banker logo are registered service marks owned
                by Coldwell Banker Real Estate LLC.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {/* Equal Housing Opportunity */}
                <svg
                  className="w-8 h-8 text-[#666]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 8v2h20V8L12 2zm-8 9v9h4v-6h8v6h4v-9H4z" />
                </svg>
                <span className="text-[#666]">Equal Housing Opportunity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col items-center gap-4">
          <p className="text-xs text-[#444] text-center">
            &copy; {new Date().getFullYear()} Luxury Homes North Idaho. All
            rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] uppercase tracking-[1.5px] text-[#ffffff4d]">
              Content &amp; Marketing by
            </span>
            <a
              href="https://accelmedia.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/logos/accel-media-logo.png"
                alt="Accel Media"
                width={80}
                height={22}
                className="h-[22px] w-auto opacity-50 hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
