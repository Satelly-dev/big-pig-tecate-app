export default function Wallet() {
  return (
    <section className="flex gap-x-5">
      <article className="p-2">
        <div>
          <p className="text-sm text-slate-800">Profit</p>

          <p className="text-2xl font-medium text-gray-900">$240.94</p>
        </div>

        <div className="mt-1 flex gap-1 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            ></path>
          </svg>

          <p className="flex gap-2 text-xs">
            <span className="font-medium"> 67.81% </span>

            <span className="text-gray-500"> Desde la semana pasada </span>
          </p>
        </div>
      </article>
      <article className="bg-white p-2">
        <div>
          <p className="text-sm text-slate-800">Retirado</p>

          <p className="text-2xl font-medium text-gray-900">$240.94</p>
        </div>
      </article>
    </section>
  );
}
