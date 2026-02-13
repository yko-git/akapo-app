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
      "features/posts/create/api/index.ts",
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
      "features/posts/patch/api/index.ts",
    ],
    output: "docs/screens/patch-post.md",
  },

  {
    id: "login",
    name: "ログイン",
    files: [
      "app/login/page.tsx",
      "features/auth/login/LoginPage.tsx",
      "features/auth/login/components/LoginForm.tsx",
      "features/auth/login/hooks/useLoginForm.tsx",
      "features/auth/login/api/createLogin.ts",
      "features/auth/login/api/index.ts",
    ],
    output: "docs/screens/login.md",
  },

  {
    id: "register",
    name: "新規ユーザー作成",
    files: [
      "app/signup/page.tsx",
      "features/auth/register/CreateUserPage.tsx",
      "features/auth/register/components/CreateUser.tsx",
      "features/auth/register/hooks/useUserForm.tsx",
      "features/auth/register/api/createUser.ts",
      "features/auth/register/api/index.ts",
    ],
    output: "docs/screens/register.md",
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
