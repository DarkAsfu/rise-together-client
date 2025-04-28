import Image from "next/image";
import TitleSubTitle from "./TitleSubTitle";
import about from "../../../public/signin.png";
import { ChevronsRight } from "lucide-react";
const About = () => {
  return (
    <div className="max-w-7xl mx-auto pt-16 grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-10 px-2 xl:px-0">
      <div className="order-2 md:order-1">
        <TitleSubTitle
          subTitle={"About Us"}
          titleStyle={""}
          subTitleStyle={"font-semibold"}
          title={"Help is Our Main Goal"}
        />
        <p className="text-[#777777] text-[16px] mt-6">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of
          using Lorem Ipsum is that it.
        </p>

        <p className="text-[#777777] text-[16px] mt-2">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </p>
        <a
          className="mt-10 flex max-w-max gap-2 cursor-pointer px-4 py-3 dark:hover:bg-black bg-primary border hover:border-1 hover:bg-white hover:text-black text-white dark:hover:text-white transition-all  dark:border-white dark:bg-white dark:text-black rounded-full font-semibold"
          href="#"
        >
          Learn More
          <ChevronsRight />
        </a>
      </div>
      <div className="order-1 md:order-2">
        <Image
          src={about}
          alt="about"
          width={500}
          height={200}
          className="rounded-md justify-self-center md:justify-self-end"
        />
      </div>
    </div>
  );
};

export default About;
