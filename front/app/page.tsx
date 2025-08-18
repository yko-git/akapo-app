import ArticleList from "@/components/posts/articleList";
import Main from "@/components/posts/main";

export default function Page() {
  return (
    <>
      <div className="m-4 md:mt-4 md:mx-auto md:mb-20">
        <Main />
        <ArticleList />
      </div>
    </>
  );
}
