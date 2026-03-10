import { useEffect, useState } from "react";
import Category_navbar from "@/components/category_navbar";
import { Card } from "@/components/ui/card";
const Events = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  useEffect(() => {
    fetch(`/api/gallery`)
      .then((res) => res.json())
      .then((data) => setGalleryItems(data))
      .catch((error) => console.error("Error fetching gallery items:", error));
  }, []);

  useEffect(() => {
    galleryItems.slice(0, 4).forEach(item => {
      const img = new Image();
      img.src = item.img_url;
    });
  }, [galleryItems]);
  
  // const [showAllImages, setShowAllImages] = useState(true);
  return (
    <div className="min-h-screen pt-10">
      {/* Hero Section */}
      <section className="relative pt-[4.75rem] pb-4 md:py-32 bg-gradient-to-br from-[#252D6F] to-[#4676E6]  text-white overflow-hidden">
        {/* Animated floating shapes (Tech vibes & Colorful) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Blue dot, floats up/down */}
          <div className="absolute top-20 left-16 w-10 h-10 bg-[#4676E6]/70 rounded-full animate-bounce-slow blur-md"></div>
          {/* Gold dot, pulsing */}
          <div className="absolute top-36 right-12 w-6 h-6 bg-[#FFD54F]/80 rounded-full animate-pulse blur-md"></div>
          {/* White ring (rotates) */}
          <div className="absolute bottom-16 left-1/4 w-20 h-20 border-4 border-white/30 rounded-full animate-spin-slow"></div>
          {/* Accent purple oval (up/down) */}
          <div className="absolute top-1/2 right-40 w-16 h-8 bg-[#B16FFF]/70 rounded-3xl animate-bounce-x blur-md"></div>
          {/* Small accent dots */}
          <div className="absolute top-16 md:top-8 right-2 w-5 h-5 bg-[#F56060]/80 rounded-full animate-bounce"></div>
          <div className="absolute bottom-8 left-8 w-5 h-5 bg-[#36C2A3]/70 rounded-full animate-bounce"></div>
        </div>

        {/* Centered content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-4 bg-white/10 rounded-full text-sm font-medium backdrop-blur-md border border-white/20 shadow-sm mb-6 tracking-widest animate-fade-in">
            Highlights
          </span>
          <h1 className="text-6xl md:auto  font-extrabold pb-3 mb-8 animate-fade-in-up bg-gradient-to-r from-[#FFD54F] via-white to-[#4676E6] bg-clip-text text-transparent drop-shadow-xl">
            Event Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Relive the{" "}
            <span className="font-semibold text-[#FFD54F]">
              excitement and innovation{" "}
            </span>
            of our previous{" "}
            <span className="font-semibold text-[#d746ffff]">Events</span>{" "}
            through our highlights.
          </p>
          <br />
        </div>
      </section>

      {/* Video Section */}
      {/*  <Card className="overflow-hidden border-primary/20">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <div className="text-center p-8">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-0 h-0 border-l-[15px] border-l-primary-foreground border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
              Video Coming Soon
              </h3>
              <p className="text-muted-foreground">
              Event recap video will be available soon.
              </p>
              </div>
              </div>
              </Card>
              </div>*/}

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-blue-50 via-blue-100 to-gray-200 justify-center items-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-snug mb-6 justify-center text-center mx-auto items-center">
            Past Events
          </h2>
          <Category_navbar galleryItems={galleryItems} />
        </div>
        <div className="max-w-4xl mx-auto mt-20 ">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-snug mb-6 justify-center text-center mx-auto items-center">
            Upcoming Events
          </h2>
          {/* <Upcoming_Events /> */}
          <Card className="p-8 w-[80vw] max-w-2xl border-primary/20 flex justify-center items-center content-center mx-auto">
    <p className="text-gray-500 text-md md:text-xl font-medium">
      Events will be announced soon! 🚀
    </p>
  </Card>
        </div>
      </section>
    </div>
  );
};

export default Events;
