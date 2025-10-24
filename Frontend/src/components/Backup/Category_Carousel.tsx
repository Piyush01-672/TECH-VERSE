import React,{useCallback} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {ChevronLeft, ChevronRight } from 'lucide-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { Button } from './ui/button'
import ClassNames from 'embla-carousel-class-names'

interface GalleryItem {
  _id: string;
  name: string;
  img_url: string;
  description?: string;
  date?: string;
  category: string;
}
export default function EmblaCarousel({ galleryItems }: { galleryItems: GalleryItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop:true},[Autoplay({delay:2000}),WheelGesturesPlugin(), ClassNames({snapped: 'is-snapped'})])
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const categories = Array.from(
    new Set(galleryItems.map((item) => item.category))
  );
  const groupedItems = categories.map((category) => ({
    category,
    items: galleryItems.filter((item) => item.category === category),
  }));

  return (
    <div className="embla">
      <div className="embla__viewport rounded-xl border" ref={emblaRef}>
      <div className="embla__container ">
      {groupedItems.map((group) => (
  <div
    className="embla__slide relative flex items-center justify-center "
    key={group.category}
  >
    <img
      className="embla__slide__img h-full w-full object-cover brightness-75 rounded-xl"
      src={group.items[0]?.img_url}
      alt={group.items[0]?.name}
    />

    <h2 className="absolute text-5xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg text-center 
      translate-y-[30%] sm:translate-y-[40%]">
      {group.category}
    </h2>
  <Button className="absolute top-2/3 bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white " size="sm" onClick={() => window.location.href=`/gallery?category=${group.category}`}>Know More </Button>
  </div>
))}

      </div>
    </div>
    <div className="flex justify-center gap-4 mt-4 ">
    <button className="embla__prev border rounded-full bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white w-10 h-10 flex items-center justify-center" onClick={scrollPrev}>
        <ChevronLeft />
      </button>
      <button className="embla__next border rounded-full bg-gradient-to-br from-[#252D6F] to-[#4676E6] text-white w-10 h-10 flex items-center justify-center" onClick={scrollNext}>
        <ChevronRight />
      </button>
    </div>
    </div>
    )
}
