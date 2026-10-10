import React, { useState } from 'react';

/**
 * Built-in registry of authentic commercial packshot product images for retail products.
 * Uses 100% offline local static assets under /products/ with fallback to clean retail tags.
 */
export const LOCAL_PRODUCT_IMAGES: Record<string, string> = {
  'RIC-SIN-001': '/products/RIC-SIN-001.jpg',
  'RIC-DIN-002': '/products/RIC-DIN-002.jpg',
  'CAN-CAL-003': '/products/CAN-CAL-003.webp',
  'CAN-ORI-004': '/products/CAN-ORI-004.jpg',
  'CAN-CHL-005': '/products/CAN-CHL-005.jpg',
  'COF-KOP-006': '/products/COF-KOP-006.jpg',
  'COF-NES-007': '/products/COF-NES-007.jpg',
  'BEV-MIL-008': '/products/BEV-MIL-008.jpg',
  'MLK-BEA-009': '/products/MLK-BEA-009.jpg',
  'CND-ARG-010': '/products/CND-ARG-010.jpg',
  'CND-SAR-011': '/products/CND-SAR-011.jpg',
  'CND-CDO-012': '/products/CND-CDO-012.jpg',
  'BEV-COK-013': '/products/BEV-COK-013.jpg',
  'BEV-ROY-014': '/products/BEV-ROY-014.jpg',
  'ALC-SAN-015': '/products/ALC-SAN-015.jpg',
  'SNK-PIA-016': '/products/SNK-PIA-016.jpg',
  'SNK-MNG-017': '/products/SNK-MNG-017.jpg',
  'SNK-SKY-018': '/products/SNK-SKY-018.jpg',
  'BAK-GAR-019': '/products/BAK-GAR-019.jpg',
  'CND-DAT-020': '/products/CND-DAT-020.jpg',
  'CND-MAG-021': '/products/CND-MAG-021.jpg',
  'NON-SAF-022': '/products/NON-SAF-022.jpg',
  'NON-SRF-023': '/products/NON-SRF-023.jpg',
  'NON-PAL-024': '/products/NON-PAL-024.jpg',
};

interface ProductImageProps {
  sku: string;
  category?: string;
  imageUrl?: string;
  name?: string;
  className?: string;
}

export const ProductThumbnail: React.FC<ProductImageProps> = ({
  sku,
  category = '',
  imageUrl,
  name = '',
  className = 'w-full h-28',
}) => {
  const [hasError, setHasError] = useState(false);
  const src = imageUrl || LOCAL_PRODUCT_IMAGES[sku] || `/products/${sku}.jpg`;

  if (hasError || !src) {
    return (
      <div
        className={`${className} rounded-lg bg-cloud-100 border border-cloud-300 flex flex-col items-center justify-center p-2 text-center text-ink-500 overflow-hidden relative`}
      >
        <span className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">
          {category || 'Item'}
        </span>
        <span className="text-xs font-semibold text-ink line-clamp-1 mt-0.5">
          {name || sku}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-lg bg-white border border-cloud-300/80 flex items-center justify-center p-1.5 overflow-hidden relative group hover:border-forest/50 transition-colors shadow-2xs`}
    >
      <img
        src={src}
        alt={name || sku}
        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export function getProductThumbnail(
  sku: string,
  category: string,
  imageUrl?: string,
  name?: string
): React.ReactNode {
  return (
    <ProductThumbnail
      sku={sku}
      category={category}
      imageUrl={imageUrl}
      name={name}
      className="w-full h-28"
    />
  );
}
