"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GameResult {
  today: string | null;
  yesterday: string | null;
}

interface StoreData {
  disawar: GameResult;
  games: Record<string, GameResult>;
  setting: {
    siteName: string;
    contactName: string;
    whatsappNumber: string;
    rate: string;
  };
}

// ─── Game schedule ────────────────────────────────────────────────────────────
const GAME_SCHEDULE: { name: string; time: string }[] = [
  { name: "DISAWAR", time: "04:30 AM" },
  { name: "IPL", time: "12:50 PM" },
  { name: "SIKANDERPUR", time: "01:55 PM" },
  { name: "DELHI BAZAR", time: "02:50 PM" },
  { name: "SHRI GANESH", time: "04:25 PM" },
  { name: "FARIDABAD", time: "05:45 PM" },
  { name: "SURYA", time: "07:20 PM" },
  { name: "GHAZIABAD", time: "09:20 PM" },
  { name: "VARANASI", time: "10:20 PM" },
  { name: "GALI", time: "11:20 PM" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function WaitIcon() {
  return (
    <img
      src="https://i.ibb.co/HffXjQCh/wait.gif"
      alt="waiting"
      width={40}
      height={40}
      className="inline"
    />
  );
}

function ResultCell({ value }: { value: string | null }) {
  if (!value) return <WaitIcon />;
  return <span className="text-2xl font-bold tracking-widest text-black">{value}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SattaPage() {
  const [data, setData] = useState<StoreData | null>(null);
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" }).toUpperCase();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/results");
        const json = await res.json();
        setData(json);
      } catch {
        // silently fail; UI shows wait icons
      }
    };
    fetchData();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30_000);
    return () => clearInterval(interval);
  }, []);

  const whatsapp = data?.setting.whatsappNumber
    ? `https://wa.me/${data.setting.whatsappNumber}`
    : "https://wa.me/+91";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] to-[#3a0000]">
      {/* ── Top nav ── */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 shadow-lg">
        <div className="max-w-[1240px] mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Home", href: "/" },
              { label: "Chart 2025", href: "/chart2025" },
              { label: "Chart 2024", href: "/chart2024" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-gradient-to-b from-red-700 to-black text-center flex items-center justify-center px-2 sm:px-5 py-2 sm:py-3 rounded font-bold uppercase text-white text-sm sm:text-base hover:-translate-y-1 transition-transform duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="bg-gradient-to-b from-[#1a0000] via-[#3a0000] to-[#1a0000] px-2 pt-28 pb-8 text-center">
        <h2 className="text-4xl lg:text-5xl text-yellow-400 font-semibold mt-10 animate-bounce">
          {data?.setting.siteName ?? "B1 SATTA"}
        </h2>
        <p className="text-white pb-12 mt-10 px-4 text-2xl md:text-3xl font-semibold">
          यही आती हे सबसे पहले खबर रूको और देखो
          <br />
          SUPER FAST RESULTS
        </p>
      </div>

      {/* ── Disawar highlight ── */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 p-3 text-center w-full">
        <p className="text-3xl font-extrabold mb-4 uppercase text-black">Disawar</p>
        <div className="flex items-center gap-3 justify-center max-w-[350px] mx-auto">
          <span className="text-xl font-semibold text-black">
            {data?.disawar.yesterday ?? "--"}
          </span>
          <span className="px-2 py-0.5 border bg-green-500 border-white text-white rounded-md text-lg">
            ➜
          </span>
          <span className="text-xl font-semibold">
            {data?.disawar.today ? (
              <span className="text-black font-bold text-2xl">{data.disawar.today}</span>
            ) : (
              <WaitIcon />
            )}
          </span>
        </div>
      </div>

      {/* ── Khaiwal info ── */}
      <section className="bg-white">
        <div className="text-center w-full">
          <div className="bg-gradient-to-b from-[#1a0000] via-[#3a0000] to-[#1a0000] py-3">
            <p className="text-2xl sm:text-3xl md:text-4xl text-yellow-400 font-semibold">
              --सीधे सट्टा कंपनी का No 1 खाईवाल--
            </p>
          </div>
          <div className="flex-1 px-2 pt-4 pb-6 text-base font-semibold leading-6 text-gray-900 bg-gradient-to-b from-[#1a0000] via-[#3a0000] to-[#1a0000]">
            <p className="uppercase mb-2 font-bold text-base lg:text-xl text-yellow-400">
              ♕♕ {data?.setting.contactName || "BHAI KHAIWAL"} ♕♕
            </p>
            <div className="text-start mx-auto max-w-[300px] text-white">
              {GAME_SCHEDULE.map(({ name, time }) => (
                <div key={name} className="flex justify-between items-center font-semibold py-0.5">
                  <span className="flex items-center gap-1 text-nowrap">⏰ {name}</span>
                  <span className="text-yellow-400">---------</span>
                  <span className="text-nowrap">{time}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xl text-yellow-400">💸 Payment Option 💸</p>
            <p className="text-white text-sm">
              PAYTM // BANK TRANSFER // PHONE PAY // GOOGLE PAY ⏺️⏺️
              <br />
              ==========================
            </p>
            <p className="text-white text-sm">
              🤑 Rate list 💸
              <br />
              {data?.setting.rate ?? "जोड़ी रेट 10 | हरूफ रेट 100"}
            </p>
            <p className="uppercase text-yellow-400">
              ♕♕ {data?.setting.contactName || "BHAI KHAIWAL"} ♕♕
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={whatsapp}
              className="text-green-400 underline"
            >
              Game play करने के लिये नीचे लिंक पर क्लिक करे
            </a>
            <div className="mx-auto max-w-[300px] mt-4 hover:scale-110 transition-all duration-300">
              <a target="_blank" rel="noopener noreferrer" href={whatsapp}>
                <img
                  src="https://i.ibb.co/4RJCLbSB/whatsapp.png"
                  alt="whatsapp"
                  className="max-sm:w-[200px] mx-auto"
                  width={300}
                  height={100}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results table ── */}
      <article className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 border-collapse border-gray-400">
            <thead className="text-base text-white bg-gradient-to-r from-red-800 to-black">
              <tr>
                <th className="text-center border border-gray-800 py-3 w-[37%]">GAME NAME</th>
                <th className="py-3 text-center border border-gray-800">YESTERDAY</th>
                <th className="py-3 text-center border border-gray-800">TODAY RESULT</th>
              </tr>
            </thead>
            <tbody>
              {GAME_SCHEDULE.map(({ name, time }, i) => {
                const result = data?.games[name];
                return (
                  <tr key={name}>
                    <td className="py-2 px-2 text-center border border-gray-800 bg-gradient-to-b from-yellow-400 to-amber-500">
                      <p className="text-sm font-bold text-black w-full md:text-lg mt-1 text-center">
                        {name}
                        <span className="block sm:inline sm:ml-1">{time}</span>
                      </p>
                    </td>
                    <td className="text-center bg-white border border-gray-800 px-2 py-2">
                      <span className="text-2xl font-bold tracking-widest text-black">
                        {result?.yesterday ?? "--"}
                      </span>
                    </td>
                    <td className="text-center bg-white border border-gray-800 px-2 py-2">
                      <div className="flex justify-center">
                        <ResultCell value={result?.today ?? null} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>

      {/* ── Monthly chart ── */}
      <div>
        <div className="bg-gradient-to-b from-yellow-500 to-amber-400 p-6 text-center">
          <h2 className="sm:text-4xl text-black lg:text-5xl text-2xl font-bold mb-2 md:mb-6">
            {currentMonth} MONTH CHART
          </h2>
          <p className="text-black text-2xl sm:text-4xl lg:text-5xl font-bold">{currentYear}</p>
        </div>
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-red-800 to-black">
                <th className="px-3 py-2 text-white text-sm sticky left-0 bg-red-900 z-10 border border-gray-700">
                  S.No
                </th>
                {GAME_SCHEDULE.map(({ name }) => (
                  <th key={name} className="border border-gray-700 px-3 py-2 text-white text-xs">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <tr key={day} className={day % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-3 py-2 text-center text-white bg-red-900 text-sm font-medium sticky left-0 z-10 border border-gray-700">
                    {day}
                  </td>
                  {GAME_SCHEDULE.map(({ name }) => (
                    <td
                      key={name}
                      className="border border-gray-300 px-3 py-2 hover:bg-yellow-100 transition-colors text-center text-black text-sm"
                    >
                      --
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── WhatsApp FAB ── */}
      <a
        className="fixed bottom-6 right-6 hover:scale-110 transition-transform"
        target="_blank"
        rel="noopener noreferrer"
        href={whatsapp}
      >
        <img
          src="https://i.ibb.co/x8fsyXVj/WhatsApp-svg.webp"
          alt="whatsapp"
          width={70}
          height={70}
          className="sm:w-[70px] w-14"
        />
      </a>

      {/* ── Disclaimer ── */}
      <p className="max-w-[1140px] text-center mx-auto mt-4 px-3 pb-4 sm:text-base text-xs font-medium text-gray-300">
        !! DISCLAIMER :-{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 font-bold hover:text-pink-300"
          href="https://b1sattaplay.in/"
        >
          http:/B1sattaplay.in
        </a>{" "}
        is a non-commercial website. Viewing This Website Is Your Own Risk, All The Information
        Shown On Website Is Sponsored And We Warn You That Matka Gambling/Satta May Be Banned Or
        Illegal In Your Country. We Are Not Responsible For Any Issues Or Scam. We Respect All
        Country Rules/Laws. If You Not Agree With Our Site Disclaimer, Please Quit Our Site Right
        Now. Thank You.
      </p>
    </div>
  );
}