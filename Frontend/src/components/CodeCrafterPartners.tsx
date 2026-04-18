import React from "react";
import { Shield, Star } from "lucide-react";

// Dummy data for Sponsors (3 items)
const sponsors = [
  { id: 1, name: "Techcadd", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776080853/Techcad_prwyx1.png" },
  { id: 2, name: "Ansh Infotech", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776080853/AIT_vab0dc.jpg" },
  { id: 3, name: "Future Finders", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776081514/FF_zzgx3k.jpg" },
  { id: 4, name: "Solitaire Infosys", logo: "https://tse2.mm.bing.net/th/id/OIP.IJP0XT53Cz5N5ECy-0l9mQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 5, name: "IBM", logo: "https://quad9.net/uploads/2880px_IBM_logo_svg_a3627e043e.png" },
  { id: 6, name: "GDG", logo: "https://th.bing.com/th/id/OIP.aglLZhcy2jBqdlE_odpEcQHaEK?w=298&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
  { id: 7, name: "Ziion Technologies", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776326948/Ziion-technology_flp6os.png" },
  { id: 8, name: "Digimantra", logo: "https://media.glassdoor.com/sqll/1788139/digimantra-labs-squareLogo-1659441375575.png" },
  { id: 9, name: "Netpro", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776500981/netpro_n68vhv.jpg" },
  { id: 10, name: "IDP", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776426514/33c2ec6f-b9f7-4825-9182-bfc3586a83a2.png" },

];

const communities = [
  { id: 1, name: "Event Dev X", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082227/222_-_Event_Dev_X_roeyry.png" },
  { id: 2, name: "CU updates", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082227/file_00000000635872099897ae8fef92ab99_1_-_Ankul_KUMAR_rqjzcz.png" },
  { id: 3, name: "Byteverse", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082226/IMG-20250429-WA0004_-_Madhav_Arora_cjgosz.jpg" },
  { id: 4, name: "Bug2Build", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082225/IMG-20251104-WA0020_-_Kastab_Garai_oo4rmm.jpg" },
  { id: 5, name: "SheBuilds", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082224/IMG-20260126-WA0001_-_Jyotika_llujzk.jpg" },
  { id: 6, name: "TechTribe", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082223/logo_techtribe_-_Ram_Pravesh_xzsyeg.jpg" },
  { id: 7, name: "The Kailshians", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082222/3258fc54-4462-4296-99c5-a22825e5dcb2_-_Keshav_bhatt_f0mhdz.jpg" },
  { id: 8, name: "Ascent Circle", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082221/ascent_circle_logo_-_Harsh_Vats_andb5t.png" },
  { id: 9, name: "Dream Coders", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082220/IMG_20260313_003212_695-photoaidcom-cropped.webp_-_Dream_Coders_rffsnf.png" },
  { id: 10, name: "Ajinava Edge", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082219/ajinava_edge_logo_for_community_partners_1_1_1_1_1_1_-_Raj_Sen_vctwv4.png" },
  { id: 11, name: "Devantra Innovations", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082219/2_-_Rahul_CEC231296_nzkcmk.jpg" },
  { id: 12, name: "BugBaar", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082218/IMG-20241114-WA0009_-_Kumbhaj_Shukla_yuamqj.jpg" },
  { id: 13, name: "GDGoC PUSSGRC", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082218/GDSC_Logo_1_-_Manish_Kumar_khfoed.png" },
  { id: 14, name: "AlphaAryX ", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082218/Screenshot_20251105_165141_-_Aryan_Patel_jeuhn7.jpg" },
  { id: 15, name: "Digital Defense Squad", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776082218/IMG-20260308-WA0015_-_Atul_Singh_Chandel_mxdwqf.jpg" },
  { id: 15, name: "Student Innovator Society", role: "Partner", logo: "https://res.cloudinary.com/diijn4esl/image/upload/q_auto/f_auto/v1776326614/comm_hprtno.jpg" },

  
];

const CodeCrafterPartners = () => {
  // Duplicate array 4 times for smooth scrolling
  const repeatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];
  // Duplicate array 4 times to ensure it fills ultra-wide screens and loops seamlessly at 50%
  const repeatedCommunities = [...communities, ...communities, ...communities, ...communities];

  return (
    <div className="relative w-full py-8">

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-24">
        
        {/* Sponsors Section (3 Items) */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-['Black_Ops_One'] uppercase text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              EVENT <span className="text-[#00F0FF]">SPONSORS</span>
            </h2>
            <div className="mt-4 w-24 h-1 bg-[#00F0FF] mx-auto shadow-[0_0_10px_#00F0FF]"></div>
            <p className="mt-4 text-[#00F0FF]/60 font-['Orbitron'] tracking-widest text-xs sm:text-sm">POWERING THE MATRICES</p>
          </div>

          <div className="relative w-full overflow-hidden flex" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex w-max shrink-0 animate-[sponsorMarquee_45s_linear_infinite] hover:[animation-play-state:paused]">
              {repeatedSponsors.map((sponsor, index) => (
                <div
                  key={`${sponsor.id}-${index}`}
                  className="w-[200px] sm:w-[240px] px-4 shrink-0"
                >
                  <div className="flex flex-col items-center justify-center gap-4 h-full">
                    {/* Sponsor Image */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-lg overflow-hidden flex items-center justify-center p-3 shadow-md">
                      {sponsor.logo ? (
                        <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-contain" />
                      ) : (
                        <Star size={48} className="text-gray-400" />
                      )}
                    </div>

                    <div className="text-center w-full">
                      <h3 className="text-sm sm:text-base font-semibold text-white">{sponsor.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communities Section (15 Items - Marquee) */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-['Black_Ops_One'] uppercase text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(26,91,255,0.4)]">
              COMMUNITY <span className="text-[#1A5BFF]">PARTNERS</span>
            </h2>
            <div className="mt-4 w-24 h-1 bg-[#1A5BFF] mx-auto shadow-[0_0_10px_#1A5BFF]"></div>
            <p className="mt-4 text-[#1A5BFF]/60 font-['Orbitron'] tracking-widest text-xs sm:text-sm">THE NETWORK FACTION</p>
          </div>

          <div className="relative w-full overflow-hidden flex" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex w-max shrink-0 animate-[communityMarquee_60s_linear_infinite] hover:[animation-play-state:paused]">
              {repeatedCommunities.map((community, index) => (
                <div
                  key={`${community.id}-${index}`}
                  className="w-[200px] sm:w-[240px] px-3 shrink-0 group perspective-1000 h-full"
                >
                  <div className="relative bg-[#0a0f1a] border border-[#1A5BFF]/20 p-4 transition-all duration-500 hover:border-[#1A5BFF]/60 hover:shadow-[0_0_20px_rgba(26,91,255,0.2)] hover:-translate-y-2 h-full flex flex-col items-center"
                    style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}
                  >
                    {/* Circle Placeholder for Community Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#03050A] mb-4 overflow-hidden border border-[#1A5BFF]/10 group-hover:border-[#1A5BFF]/40 transition-colors flex items-center justify-center">
                      {community.logo ? (
                        <img src={community.logo} alt={community.name} className="w-full h-full object-cover" />
                      ) : (
                        <Shield size={32} className="text-[#1A5BFF]/30 group-hover:text-[#1A5BFF]/60 transition-colors" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A5BFF]/10 to-transparent w-full h-[200%] animate-[scanLine_2s_linear_infinite] pointer-events-none"></div>
                    </div>

                    <div className="text-center relative z-10 px-1 w-full flex-1 flex flex-col justify-center gap-1">
                      <h3 className="text-sm sm:text-base font-['Black_Ops_One'] text-gray-200 tracking-wider group-hover:text-[#1A5BFF] transition-colors leading-snug">{community.name}</h3>
                      <p className="text-[9px] sm:text-[10px] font-mono text-[#1A5BFF]/80 uppercase tracking-widest">{community.role}</p>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[#1A5BFF]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[#1A5BFF]/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes sponsorMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes communityMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default CodeCrafterPartners;
