import FALLBACK_IMAGE from "../assets/Logo.png";

export default function ProductImage({ src, alt, ...props }) {
  return (
    <img
      src={src || FALLBACK_IMAGE}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = FALLBACK_IMAGE;
      }}
      {...props}
    />
  );
}