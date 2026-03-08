const EventHighlights = () => {
  return (
    <div className="flex lg:justify-end">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 sm:p-10 border border-white/20 shadow-2xl max-w-md w-full hover:scale-[1.02] transition-all duration-300">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">
          Event Highlights
        </h3>

        <ul className="space-y-5">
          {[
            "24-hour intense coding challenge",
            "100k+ INR in prizes",
            "Networking with industry experts",
            "Workshops and mentorship",
            "Opportunity to showcase your skills"
          ].map((highlight, idx) => (
            <li key={idx} className="flex items-center text-white/90 font-medium text-[15.5px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD54F] shadow-md mr-4 flex-shrink-0 animate-pulse"></span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventHighlights;
