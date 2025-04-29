import arrow from "../../../public/arrow.png";
import sfr from "../../../public/sfr.png";
import TitleSubTitle from "./TitleSubTitle";
import success from "../../../public/success.svg";
import support from "../../../public/support.svg";
import withdraw from "../../../public/withdraw.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
const StepFundRising = () => {
  const step = [
    {
      id: 1,
      icon: success,
      title: "Share your fundraiser",
      desc: "It’ll take only 2 minutes. Just tell us a few details about you and the ones you are raising funds for.",
    },
    {
      id: 2,
      icon: support,
      title: "Start your fundraiser",
      desc: "All you need to do is share the fundraiser with your friends and family. In no time, support will start pouring in.",
      button: "Start Your Fundraiser",
    },
    {
      id: 3,
      icon: withdraw,
      title: "Withdraw Funds",
      desc: "The funds raised can be withdrawn without any hassle directly to your bank account.",
    },
  ];
  return (
    <div>
      <div className="py-20 max-w-7xl mx-auto">
        <div>
          <TitleSubTitle
            subTitle={"START YOUR FUNDRAISER"}
            subTitleStyle={"font-semibold text-center"}
            title={"Start A Fundraiser In Three Simple Steps"}
            titleStyle={"text-center max-w-2xl mx-auto"}
          />
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 items-center">
          {step.map((s, idx) => (
            <div key={idx}>
              <div className="text-center mx-auto group transition-all">
                <div className="flex flex-col items-center">
                  <div className="border-dashed border-2 border-secondary p-6 rounded-full w-[100px] h-[100px] flex justify-center items-center relative">
                    <Image
                      className=""
                      src={s.icon}
                      width={60}
                      height={60}
                      alt="icon"
                    />
                  </div>
                  <h5 className="bg-primary text-white group-hover:bg-secondary group-hover:text-heading delay-300 transition-all  w-7 h-7 flex justify-center items-center rounded-full relative bottom-7 left-10">
                    0{s.id}
                  </h5>
                </div>
                <h3 className="text-heading text-[20px] font-semibold leading-[2.5]">
                  {s.title}
                </h3>
                <p className="text-[13px] text-[#777777] font-[500] max-w-[280px] mx-auto">
                  {s.desc}
                </p>
              </div>
              <div className="mx-auto text-center mt-10 hidden md:flex justify-center">
                {s.button && (
                  <Button className="px-6 py-6 text-[16px]">{s?.button}</Button>
                )}{" "}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10 md:hidden">
          <Button className="px-6 py-6 text-[16px]">
            Start Your Fundraiser
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepFundRising;
