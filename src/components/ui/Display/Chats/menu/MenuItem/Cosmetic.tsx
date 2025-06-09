import { useEffect, useState, useRef } from 'react';
import { saveImageToDB, getImageFromDB, openDB } from '~/Utility/IndexDB';

export function Cosmetic() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [tempBgImage, setTempBgImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadImage = async () => {
      const blob = await getImageFromDB();
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setBgImage(imageUrl);
        setTempBgImage(imageUrl);
      }
    };
    loadImage();
  }, []);

  const handleSave = async () => {
    if (tempBgImage) {
      const response = await fetch(tempBgImage);
      const blob = await response.blob();
      await saveImageToDB(blob);
    } else {
      const db = await openDB();
      const transaction = db.transaction('images', 'readwrite');
      const store = transaction.objectStore('images');
      store.delete('bgImage');
    }
    setBgImage(tempBgImage);
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setTempBgImage(imageUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setTempBgImage(imageUrl);
    }
  };

  const handleDeleteImage = async () => {
    setTempBgImage(null);
    setBgImage(null);
    const db = await openDB();
    const transaction = db.transaction('images', 'readwrite');
    const store = transaction.objectStore('images');
    store.delete('bgImage');
  };

  return (
    <div className="mt-4 p-4 bg-gray-700 rounded-md">
      <h3 className="text-lg font-semibold">Customization</h3>

      <div className="mt-3">
        <p className="text-gray-300">Change Background</p>
        <div
          className={`w-full h-32 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer relative ${
            dragging ? 'border-blue-500 bg-gray-600' : 'border-gray-500'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {tempBgImage ? (
            <>
              <img
                src={tempBgImage}
                alt="Background Preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                &times;
              </button>
            </>
          ) : (
            <p className="text-gray-300">Click or Drag & Drop an image here</p>
          )}
        </div>
        <button
          onClick={handleDeleteImage}
          className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Remove Image
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleSave}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition"
      >
        Save Changes
      </button>
    </div>
  );
}
