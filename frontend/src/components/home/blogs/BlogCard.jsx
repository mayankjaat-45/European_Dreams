import Image from "next/image";
import Link from "next/link";

const formatDate = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export default function BlogCard({ blog }) {
  if (!blog) {
    return null;
  }

  const image =
    blog.featuredImage?.url || blog.featuredImage || blog.image || "";

  const imageAlt =
    blog.featuredImageAlt ||
    blog.imageAlt ||
    blog.title ||
    "European Dreams Study in Italy article";

  const publishedAt = formatDate(blog.publishedAt || blog.createdAt);

  const blogUrl = `/blogs/${blog.slug}`;

  const category =
    typeof blog.category === "object" ? blog.category?.name : blog.category;

  return (
    <article
      className="
      group
      relative
      flex
      h-full
      flex-col
      overflow-hidden
      rounded-3xl
      border
      border-border
      bg-card
      shadow-sm
      transition-all
      duration-500
      hover:-translate-y-1.5
      hover:border-primary/30
      hover:shadow-xl
      hover:shadow-primary/10
      "
    >
      {/* Image */}

      <Link
        href={blogUrl}
        className="
        relative
        block
        aspect-video
        overflow-hidden
        bg-card-hover
        "
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
            flex
            h-full
            w-full
            items-center
            justify-center
            bg-linear-to-br
            from-primary/10
            via-primary/5
            to-secondary/10
            "
          >
            <div
              className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-3xl
              "
            >
              🇮🇹
            </div>
          </div>
        )}

        <div
          className="
          pointer-events-none
          absolute
          inset-0
          bg-linear-to-t
          from-black/35
          via-transparent
          to-transparent
          opacity-60
          "
        />

        {category && (
          <span
            className="
            absolute
            left-4
            top-4
            rounded-full
            border
            border-white/15
            bg-black/45
            px-3
            py-1.5
            text-xs
            font-bold
            text-white
            backdrop-blur-md
            "
          >
            {category}
          </span>
        )}
      </Link>

      {/* Content */}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div
          className="
          flex
          flex-wrap
          items-center
          gap-x-2
          gap-y-1
          text-xs
          font-medium
          text-muted
          "
        >
          {publishedAt && <span>{publishedAt}</span>}

          {publishedAt && blog.readTime && <span>•</span>}

          {blog.readTime && <span>{blog.readTime}</span>}

          {Number(blog.views) > 0 && (
            <>
              <span>•</span>

              <span>{blog.views} views</span>
            </>
          )}
        </div>

        <h2
          className="
          mt-3
          line-clamp-2
          text-xl
          font-extrabold
          leading-7
          text-foreground
          transition-colors
          duration-300
          group-hover:text-primary
          "
        >
          <Link href={blogUrl}>{blog.title}</Link>
        </h2>

        <p
          className="
          mt-3
          line-clamp-3
          text-sm
          leading-6
          text-muted
          "
        >
          {blog.excerpt ||
            blog.metaDescription ||
            "Explore practical Study in Italy guidance from European Dreams."}
        </p>

        <Link
          href={blogUrl}
          className="
          group/link
          mt-auto
          inline-flex
          w-fit
          items-center
          gap-2
          pt-5
          text-sm
          font-bold
          text-primary
          transition-colors
          duration-300
          hover:text-primary-hover
          "
        >
          Read article
          <span
            aria-hidden="true"
            className="
            transition-transform
            duration-300
            group-hover/link:translate-x-1
            "
          >
            →
          </span>
        </Link>
      </div>

      <span
        className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        mx-auto
        h-0.75
        w-0
        rounded-full
        bg-linear-to-r
        from-primary
        to-secondary
        transition-all
        duration-500
        group-hover:w-1/2
        "
      />
    </article>
  );
}
