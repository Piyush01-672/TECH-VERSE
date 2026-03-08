import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa6";

const socialLinks = [
  {
    label: "Instagram",
    icon: <FaInstagram size={20} />,
    link: "https://www.instagram.com/tech.versectu/",
    color: "bg-pink-500",
  },
  {
    label: "WhatsApp",
    icon: <FaWhatsapp size={20} />,
    link: "https://chat.whatsapp.com/IiClyLPXlooJZWlJ66CnlN?mode=wwt",
    color: "bg-green-500",
  },
  {
    label: "Mail Us",
    icon: <Mail size={20} />,
    link: "mailto:techverse@ctuniversity.in",
    color: "bg-gray-800",
  },
  {
    label: "LinkedIn",
    icon: <FaLinkedin size={20} />,
    link: "https://www.linkedin.com/company/techverse-club-ct-university/",
    color: "bg-blue-600",
  },
];

export function FloatingSocials() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6"
      style={{
        right: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "12px",
        zIndex: 9999,
      }}
    >
      {socialLinks.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          title={item.label}
          className={`flex items-center justify-center text-white shadow-lg rounded-full p-3 transition-all duration-300 transform
            ${item.color}
            ${open ? `opacity-100 translate-y-0` : `opacity-0 translate-y-4 pointer-events-none`}
          `}
          style={{
            transitionDelay: `${index * 80}ms`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(255,255,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "";
          }}
        >
          {item.icon}
        </a>
      ))}

      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl transition-all duration-300
                   hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
      >
        <Send size={22} />
      </button>
    </div>
  );
}
