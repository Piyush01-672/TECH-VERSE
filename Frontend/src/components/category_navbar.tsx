import React, { useState, useEffect } from "react";
import ImageCarousel from "./Image_Carousel";
import {X} from "lucide-react";

interface GalleryItem {
  _id: string;
  name: string;
  img_url: string;
  description?: string;
  category: string;
}

const CategoryNavbar = ({ galleryItems }: { galleryItems: GalleryItem[] }) => {
  const categories: string[] = Array.from(new Set(galleryItems.map(item => item.category)));  

  const [selectedCategory, setSelectedCategory] = useState("");

  const [showModal, setShowModal] = useState(false);

const visibleCategories = categories.slice(0, 3);


  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredImages = galleryItems.filter(item => item.category === selectedCategory);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-blue-900 text-white border-blue-900 font-bold shadow"
                : "bg-white text-blue-900 border-blue-300 hover:bg-blue-100"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <button
          className="px-5 py-2 rounded-full border bg-white text-blue-900 border-blue-300 hover:bg-blue-100"
          onClick={() => setShowModal(true)}
        >
          View More →
        </button>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
            <button
              className="absolute top-2 right-3 text-2xl font-bold text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <X />
            </button>
            <h3 className="text-lg font-semibold mb-4">Select Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === cat
                      ? "bg-blue-900 text-white border-blue-900 font-bold shadow"
                      : "bg-white text-blue-900 border-blue-300 hover:bg-blue-100"
                  }`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl">
        <ImageCarousel galleryItems={filteredImages} />
      </div>
    </div>
  );
};

export default CategoryNavbar;
