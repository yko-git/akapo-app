import { jost } from "@/components/shared/font";

export function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <>
      <div className="bg-white">
        <footer className="mx-auto max-w-screen-2xl">
          <div
            className={`${jost.className} font-bold py-8 text-center text-sm text-[#6C9FE0]`}
          >
            &copy; {year} - akapo.
          </div>
        </footer>
      </div>
    </>
  );
}
