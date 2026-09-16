export default function JsonLd({ data }) {
  if (!data) return null;

  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/<\/script>/gi, "<\\/script>");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
