import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface GalleryItem {
  _id: string;
  name: string;
  img_url: string;
  description?: string;
  date?: string;
  category: string;
}

const GallerySlider = ({ galleryItems }: { galleryItems: GalleryItem[] }) => {
  const scrollRefs = useRef({});

  const scroll = (category, direction) => {
    const current = scrollRefs.current[category];
    if (current) {
      const totalScroll = 574;
      const scrollAmount = direction === "left" ? -totalScroll : totalScroll;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const categories = Array.from(
    new Set(galleryItems.map((item) => item.category))
  );
  const groupedItems = categories.map((category) => ({
    category,
    items: galleryItems.filter((item) => item.category === category),
  }));

  return (
    <>
      {groupedItems.map((group) => (
        <section key={group.category} className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg mb-4 animate-pulse">
                {group.category}
              </h2>
              <p className="text-lg text-muted-foreground">
                A showcase of innovation, teamwork, and big wins.{" "}
              </p>
            </div>
          </div>
          <div className="container mx-auto px-4 relative group">
            <button
              onClick={() => scroll(group.category, "left")}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ArrowLeft size={20} />
            </button>
            <div
              ref={(el) => {
                scrollRefs.current[group.category] = el;
              }}
              className="flex gap-2 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            >
              {group.items.map((item, index) => (
                <div
                  key={item._id}
                  className="snap-center min-w-[80vw] sm:min-w-[380px] md:min-w-[480px] lg:min-w-[550px] flex-shrink-0"
                >
                  <Card
                    className="group/card relative overflow-hidden cursor-pointer animate-scale-in border-primary/20"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                      <img
                        src={item.img_url}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center group-hover/card:opacity-80 opacity-100 transition-opacity">
                        <div className="text-center text-white p-6">
                          {/* <h3 className="text-2xl font-bold mb-2">
                            {item.name}
                          </h3>
                            <Badge variant="secondary" className="mb-2">
                              {item.category}
                            </Badge> */}
                          <p className="text-sm text-white/80">{item.date}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/20 group-hover/card:opacity-0 opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-sm p-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-200">
                      <p className="text-center">
                        {item.description ||
                          "Event description will appear here on hover"}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll(group.category, "right")}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </section>
      ))}
    </>
  );
};

export default GallerySlider;
