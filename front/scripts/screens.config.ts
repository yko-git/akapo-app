export type ScreenConfig = {
  id: string;
  name: string;
  route: string;
  screenshotRoute?: string;
  files: string[];
  output: string;
};

export const screens: ScreenConfig[] = [
  {
    id: "register",
    name: "新規ユーザー作成",
    route: "/signup",
    files: [
      "app/signup/page.tsx",
      "features/auth/register/CreateUserPage.tsx",
      "features/auth/register/components/CreateUser.tsx",
      "features/auth/register/hooks/useUserForm.ts",
      "features/auth/register/api/createUser.ts",
      "features/auth/register/api/index.ts",
    ],
    output: "features/auth/docs/register.md",
  },

  {
    id: "login",
    name: "ログイン",
    route: "/login",
    files: [
      "app/login/page.tsx",
      "features/auth/login/LoginPage.tsx",
      "features/auth/login/components/LoginForm.tsx",
      "features/auth/login/hooks/useLoginForm.tsx",
      "features/auth/login/api/createLogin.ts",
      "features/auth/login/api/index.ts",
    ],
    output: "features/auth/docs/login.md",
  },

  {
    id: "create-post",
    name: "投稿作成",
    route: "/posts/new",
    files: [
      "app/posts/new/page.tsx",
      "features/posts/create/CreatePostPage.tsx",
      "features/posts/create/components/CreatePost.tsx",
      "features/posts/shared/hooks/usePostForm.ts",
      "features/posts/create/api/createPost.ts",
      "features/posts/create/api/index.ts",
    ],
    output: "features/posts/docs/create-post.md",
  },
  {
    id: "patch-post",
    name: "投稿編集",
    route: "/posts/new/[id]",
    screenshotRoute: "/posts/new/1",
    files: [
      "app/posts/new/[id]/page.tsx",
      "features/posts/patch/PatchPostPage.tsx",
      "features/posts/patch/components/PatchPost.tsx",
      "features/posts/shared/hooks/usePostForm.ts",
      "features/posts/patch/api/patchPost.ts",
      "features/posts/shared/api/fetchPost.ts",
      "features/posts/patch/api/uploadImage.ts",
      "features/posts/patch/api/index.ts",
    ],
    output: "features/posts/docs/patch-post.md",
  },
  {
    id: "post-detail",
    name: "投稿詳細",
    route: "/posts/[id]",
    screenshotRoute: "/posts/1",
    files: [
      "app/posts/[id]/page.tsx",
      "features/posts/detail/PostDetailPage.tsx",
      "features/posts/detail/components/PostDetail.tsx",
      "features/posts/shared/hooks/useRequireAuth.ts",
      "features/posts/shared/api/fetchPost.ts",
      "features/posts/shared/api/fetchComments.ts",
    ],
    output: "features/posts/docs/post-detail.md",
  },

  {
    id: "post-list",
    name: "投稿一覧",
    route: "/",
    files: [
      "app/page.tsx",
      "features/posts/list/PostListPage.tsx",
      "features/posts/list/components/PostList.tsx",
      "features/posts/list/api/fetchPosts.ts",
      "features/posts/shared/api/fetchComments.ts",
      "features/posts/shared/hooks/useRequireAuth.ts",
    ],
    output: "features/posts/docs/post-list.md",
  },

  {
    id: "user-page",
    name: "ユーザーページ",
    route: "/mypage",
    files: [
      "app/mypage/page.tsx",
      "features/users/mypage/UsersPage.tsx",
      "features/users/mypage/components/User.tsx",
      "features/users/mypage/api/fetchUserData.ts",
      "features/users/mypage/api/fetchUserPosts.ts",
    ],
    output: "features/users/docs/user-page.md",
  },

  {
    id: "user-post-list",
    name: "ユーザー投稿一覧",
    route: "/mypage",
    files: [
      "app/mypage/page.tsx",
      "features/posts/user-list/UserPostListPage.tsx",
      "features/posts/user-list/components/UserPostList.tsx",
      "features/posts/user-list/api/deletePosts.ts",
    ],
    output: "features/posts/docs/user-post-list.md",
  },

  {
    id: "about",
    name: "About",
    route: "/about",
    files: ["app/about/page.tsx", "features/about/AboutPage.tsx"],
    output: "features/about/docs/about.md",
  },

  {
    id: "profile",
    name: "Profile",
    route: "/profile",
    files: ["app/profile/page.tsx", "features/profile/ProfilePage.tsx"],
    output: "features/profile/docs/profile.md",
  },
];
