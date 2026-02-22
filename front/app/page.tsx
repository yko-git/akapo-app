// app/page.tsx
import { Suspense } from "react";
import PostListPage from "@/features/posts/list/PostListPage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PostListPage />
    </Suspense>
  );
}
