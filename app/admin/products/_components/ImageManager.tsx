'use client';

import { useState, useRef } from 'react';
import { X, Upload, Star, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { getImageUrl, getPlaceholderImage } from '@/lib/utils/image';

interface ProductImage {
  id?: number;
  path?: string;
  file?: File;
  preview?: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

interface ImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export default function ImageManager({ images, onChange, maxImages = 10 }: ImageManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages: ProductImage[] = filesToAdd.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      alt_text: '',
      is_primary: images.length === 0 && index === 0,
      sort_order: images.length + index,
    }));

    onChange([...images, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    
    // Revoke object URL if it exists
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const newImages = images.filter((_, i) => i !== index);
    
    // If removed image was primary, set first image as primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true;
    }

    // Update sort orders
    newImages.forEach((img, i) => {
      img.sort_order = i;
    });

    onChange(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(newImages);
  };

  const handleUpdateImage = (index: number, field: keyof ProductImage, value: any) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    // Update sort orders
    newImages.forEach((img, i) => {
      img.sort_order = i;
    });

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const getImagePreview = (image: ProductImage): string => {
    if (image.preview) return image.preview;
    if (image.path) return getImageUrl(image.path);
    return getPlaceholderImage();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
          <p className="text-sm text-gray-500">
            Upload up to {maxImages} images. First image or marked primary will be the main image.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddImageClick}
          disabled={images.length >= maxImages}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-4 w-4" />
          Upload Images
        </button>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No images added yet</p>
          <button
            type="button"
            onClick={handleAddImageClick}
            className="mt-4 text-sm font-medium text-[#FF6F00] hover:text-[#E65100]"
          >
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`rounded-xl border bg-white p-4 transition-all ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${image.is_primary ? 'border-[#FF6F00] ring-2 ring-[#FF6F00]/20' : 'border-gray-200'}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Drag Handle */}
                <div className="flex flex-row items-center gap-2 sm:flex-col sm:justify-center sm:gap-0">
                  <GripVertical className="h-5 w-5 cursor-move text-gray-400" />
                  <span className="sm:mt-1 text-xs text-gray-500">#{index + 1}</span>
                </div>

                {/* Image Preview */}
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={getImagePreview(image)}
                    alt={image.alt_text || 'Product image'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage();
                    }}
                  />
                  {image.is_primary && (
                    <div className="absolute right-1 top-1 rounded-full bg-[#FF6F00] p-1">
                      <Star className="h-3 w-3 fill-white text-white" />
                    </div>
                  )}
                </div>

                {/* Image Fields */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      {image.file ? 'File' : 'Image Path'} <span className="text-red-500">*</span>
                    </label>
                    {image.file ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                          {image.file.name}
                        </div>
                        <span className="text-xs text-gray-500">
                          {(image.file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={image.path || ''}
                          onChange={(e) => handleUpdateImage(index, 'path', e.target.value)}
                          placeholder="products/image.jpg"
                          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Relative path from storage (e.g., products/laptop.jpg)
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Alt Text (SEO)
                    </label>
                    <input
                      type="text"
                      value={image.alt_text || ''}
                      onChange={(e) => handleUpdateImage(index, 'alt_text', e.target.value)}
                      placeholder="Descriptive text for accessibility"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    disabled={image.is_primary}
                    className={`rounded-lg p-2 transition-all ${
                      image.is_primary
                        ? 'bg-[#FF6F00] text-white cursor-default'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-[#FF6F00]'
                    }`}
                    title={image.is_primary ? 'Primary image' : 'Set as primary'}
                  >
                    <Star className={`h-4 w-4 ${image.is_primary ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                    title="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && images.length < maxImages && (
        <button
          type="button"
          onClick={handleAddImageClick}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-3 text-sm font-medium text-gray-600 transition-all hover:border-[#FF6F00] hover:bg-orange-50 hover:text-[#FF6F00]"
        >
          Upload More Images ({images.length}/{maxImages})
        </button>
      )}
    </div>
  );
}
