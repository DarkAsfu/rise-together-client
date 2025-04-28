"use client";
import { useState, useEffect } from "react";
import { ArrowRight, MenuIcon, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "../hooks/use-media-query";
import { DrawerContent, HeaderDrawer } from "@/components/core/drawer/vaul-header";

const featuredCampaigns = [
  {
    id: 1,
    classname: "bg-gradient-to-l from-green-400 to-emerald-500",
    img: "/images/education-campaign.jpg",
    title: "Education for All"
  },
  {
    id: 2,
    classname: "bg-gradient-to-r from-blue-300 to-blue-800",
    img: "/images/healthcare-campaign.jpg",
    title: "Healthcare Initiative"
  },
  {
    id: 3,
    classname: "bg-gradient-to-tl from-purple-500 to-indigo-400",
    img: "/images/community-campaign.jpg",
    title: "Community Development"
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [headerOpen, setHeaderOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 ${
        isScrolled ? "bg-white" : "bg-transparent border-b"
      } transition-colors duration-300 relative`}
    >
      <header
        className={`max-w-[94em] mx-auto grid grid-cols-2 md:grid-cols-3 items-center px-2 py-4 rounded-md ${
          isScrolled ? "backdrop-blur-md" : ""
        }`}
      >
        <HeaderDrawer
          open={headerOpen}
          setOpen={setHeaderOpen}
          drawerBtn={() => (
            <button className="bg-primary max-w-max justify-self-start text-white p-2 rounded-md dark:bg-white dark:text-black">
              <MenuIcon />
            </button>
          )}
        >
          <DrawerContent>
            {!isDesktop && (
              <div className="flex justify-center w-full absolute bottom-1 left-0">
                <div className="w-16 h-[0.30rem] flex-shrink-0 rounded-full bg-gray-600 my-4" />
              </div>
            )}
            <div className="max-w-[94em] xl:mx-auto gap-4 px-2">
              <div className="flex justify-between items-center align-middle border-b">
                <button
                  className="flex justify-start p-2 mb-2 rounded-md dark:bg-white dark:text-black bg-primary text-white"
                  onClick={() => setHeaderOpen(false)}
                >
                  <X />
                </button>
                <Link href="/">
                  <h2 className="text-2xl font-bold text-primary">Rise Together</h2>
                </Link>
              </div>
              <div className="flex justify-between pt-2">
                <nav className="flex gap-8 w-[100%] md:w-[30%] lg:w-[20%]">
                  <ul className="text-[16px] space-y-3 font-semibold uppercase pr-8">
                    <li>
                      <Link
                        href="/"
                        className="relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/campaigns"
                        className="relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                        Campaigns
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/start-campaign"
                        className="relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                        Start a Campaign
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/how-it-works"
                        className="relative flex items-center gap-2 max-w-max after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 dark:after:bg-white after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
                      >
                        How it Works
                      </Link>
                    </li>
                    <li>
                      <Link href="/donate">
                        <Button>Donate Now</Button>
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-4 w-[60%] md:w-[70%] lg:w-[80%] pr-5">
                  {featuredCampaigns.map((campaign) => (
                    <figure
                      key={campaign.id}
                      className="inline-block group w-full xl:h-52 relative rounded-md overflow-hidden cursor-pointer"
                    >
                      <div className="w-full h-full relative">
                        <Image
                          src={campaign.img}
                          alt={campaign.title}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                          <h3 className="text-white font-medium text-sm">{campaign.title}</h3>
                        </div>
                      </div>
                    </figure>
                  ))}
                </div> */}
              </div>
            </div>
          </DrawerContent>
        </HeaderDrawer>
        
        <Link href="/" className="text-primary text-2xl font-bold justify-self-end md:justify-self-center">
          Rise Together
        </Link>
        
        <div className="flex items-center justify-self-end gap-3">
          <Link href="/signup" className="hidden md:block text-white px-10 py-2 rounded-full bg-primary hover:bg-transparent border-1 hover:text-primary font-semibold transition-all">
            Sign Up
          </Link>
          <Link href="/" className="hidden md:block group relative cursor-pointer p-2 w-40 border bg-white rounded-full overflow-hidden text-black text-center font-semibold">
            <span className="translate-x-1 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-300 inline-block">
              Donate Now
            </span>
            <div className="flex gap-2 text-white z-10 items-center absolute top-0 h-full w-full justify-center translate-x-12 opacity-0 group-hover:-translate-x-1 group-hover:opacity-100 transition-all duration-300">
              <span>Donate Now</span>
              <ArrowRight size={18} />
            </div>
            <div className="absolute top-[40%] left-[12%] h-2 w-2 group-hover:h-full group-hover:w-full rounded-lg bg-primary scale-[1] dark:group-hover:bg-[#e7cb6e] group-hover:bg-primary group-hover:scale-[1.8] transition-all duration-300 group-hover:top-[0%] group-hover:left-[0%]"></div>
          </Link>
        </div>
      </header>
    </div>
  );
}