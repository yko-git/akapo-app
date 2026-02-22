import FilterNav from "./components/FilterNav";
import PostList from "./components/PostList";

export default function PostListPage() {
  return (
    <>
      <div className="m-4 md:mt-4 md:mx-auto md:mb-20">
        <div className="text-center mb-5">
          <FilterNav />
        </div>
        <PostList />
      </div>
    </>
  );
}
