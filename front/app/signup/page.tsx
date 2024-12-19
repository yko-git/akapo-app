import CreateUser from "@/components/posts/createUser";

export default function SignUp() {
  return (
    <>
      <div className="m-4 wrapper">
        <h1 className="font-bold my-2">新しいユーザーを作成</h1>
        <CreateUser />
      </div>
    </>
  );
}
