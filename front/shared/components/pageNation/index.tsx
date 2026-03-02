import Link from "next/link";

export const PageNation = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return (
    <div>
      <ul className="flex justify-between border-t border-[#E5E5E5] mt-10 pt-10 max-w-[1400px] mx-auto px-5">
        {page > 1 ? (
          <li>
            <Link
              href={`/?page=${page - 1}&limit=${limit}`}
              className="text-[#6C9FE0] font-bold"
            >
              前へ
            </Link>
          </li>
        ) : (
          <li className="text-slate-300">前へ</li>
        )}
        <li className="text-[#6C9FE0] font-bold">{page}</li>
        <li>
          <Link
            href={`/?page=${page + 1}&limit=${limit}`}
            className="text-[#6C9FE0] font-bold"
          >
            次へ
          </Link>
        </li>
      </ul>
    </div>
  );
};
