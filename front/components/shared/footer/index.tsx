import { jost } from "@/components/shared/font";

export function Footer() {
  return (
    <>
      <div className="bg-white">
        <footer className="mx-auto max-w-screen-2xl">
          <div
            className={`${jost.className} font-bold py-8 text-center text-sm text-[#6C9FE0]`}
          >
            &copy; 2024 - akapo.
          </div>
        </footer>
      </div>
    </>
  );
}
