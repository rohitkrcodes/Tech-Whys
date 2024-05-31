import PostPreview from "@/components/PostPreview";
import getPostMetadata from "@/components/getPostMetadata";

export default function Home() {
  const postMetadata = getPostMetadata();
  const postPreviews = postMetadata.map((post)=>(
    <PostPreview key={post.slug} {...post} />
  ));
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {postPreviews}
      </div>
    </main>
  );
}
