import { Helmet } from "react-helmet-async";

type SEOProps = { title: string; description: string; image?: string; type?: "website" | "article" };

export default function SEO({ title, description, image, type = "website" }: SEOProps) {
  const absoluteImage = image?.startsWith("http") ? image : image ? new URL(image, window.location.origin).href : undefined;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      <meta name="twitter:card" content={absoluteImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
