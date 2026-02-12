export type ScreenConfig = {
  id: string;
  name: string;
  files: string[];
  output: string;
};

export const screens: ScreenConfig[] = [
  {
    id: "create-post",
    name: "投稿作成",
    files: [
      "app/posts/new/page.tsx",
      "features/posts/create/CreatePostPage.tsx",
      "features/posts/create/components/CreatePost.tsx",
      "features/posts/shared/hooks/usePostForm.tsx",
      "features/posts/create/api/createPost.ts",
    ],
    output: "docs/screens/create-post.md",
  },
  {
    id: "patch-post",
    name: "投稿編集",
    files: [
      "app/posts/new/[id]/page.tsx",
      "features/posts/patch/PatchPostPage.tsx",
      "features/posts/patch/components/PatchPost.tsx",
      "features/posts/shared/hooks/usePostForm.tsx",
      "features/posts/patch/api/patchPost.ts",
      "features/posts/patch/api/fetchPost.ts",
      "features/posts/patch/api/uploadImage.ts",
    ],
    output: "docs/screens/patch-post.md",
  },

  {
    id: "login",
    name: "ログイン",
    files: ["components/posts/loginUser/index.tsx", "app/login/page.tsx"],
    output: "docs/screens/login.md",
  },

  {
    id: "post-detail",
    name: "投稿詳細",
    files: ["components/posts/article/index.tsx", "app/posts/[id]/page.tsx"],
    output: "docs/screens/post-detail.md",
  },

  {
    id: "mypage",
    name: "マイページ",
    files: ["components/posts/userPage/index.tsx", "app/mypage/page.tsx"],
    output: "docs/screens/mypage.md",
  },
];
