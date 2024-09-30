"use client";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { Fragment } from "react";
const testimonials = [
  {
    text: "I can't wait to try this app! Having daily weather-based outfit suggestions will save me so much time each morning.",
    imageSrc: avatar1.src,
    name: "Jamie Rivera",
    username: "@jamietechguru00",
  },
  {
    text: "Looking forward to finally having a tool that takes the guesswork out of dressing for the weather. This app is going to be a game-changer!",
    imageSrc: avatar2.src,
    name: "Josh Smith",
    username: "@jjsmith",
  },
  {
    text: "I’m so excited to use the virtual try-on feature! Being able to see how different outfits will look on me before stepping outside is going to be incredible.",
    imageSrc: avatar3.src,
    name: "Morgan Lee",
    username: "@morganleewhiz",
  },
  {
    text: "Can't wait to see how accurate the daily outfit recommendations will be. No more second-guessing what to wear when the weather changes!",
    imageSrc: avatar4.src,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "I’m really looking forward to planning my outfits around the weather with ease. This app will definitely make my mornings smoother!",
    imageSrc: avatar5.src,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "Excited about the customization options this app will offer. I can’t wait to personalize my outfits and get tailored suggestions!",
    imageSrc: avatar6.src,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "I’m eagerly waiting to try out the daily outfit suggestions. I love the idea of having my wardrobe adapt to the weather automatically.",
    imageSrc: avatar7.src,
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "Anticipating how this app will simplify my life by providing perfect outfits for any weather. It’s exactly what I’ve been looking for!",
    imageSrc: avatar8.src,
    name: "Sam Dawson",
    username: "@dawsontechtips",
  },
  {
    text: "Looking forward to a user-friendly app that helps me decide what to wear every day, no matter the weather. Can't wait to give it a try!",
    imageSrc: avatar9.src,
    name: "Casey Harper",
    username: "@casey09",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);
type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
};
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => (
  <div className={props.className}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{
        duration: props.duration || 10,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className={"flex flex-col gap-6 pb-6"}
    >
      {[...new Array(3)].fill(0).map((index, key) => (
        <Fragment key={key}>
          {props.testimonials.map(({ text, imageSrc, name, username }) => (
            <div key={imageSrc} className="card">
              <div className="">{text}</div>
              <div className="flex items-center gap-2 mt-5">
                <Image
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight">{name}</div>
                  <div className="leading-5 tracking-tight">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </Fragment>
      ))}
    </motion.div>
  </div>
);
export const Testimonials: React.FC<refProp> = ({ refProp }) => {
  return (
    <section ref={refProp} className="bg-white">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title mt-5">Is this really a problem?</h2>
          <p className="section-description mt-5">
            Some called this idea stupid. But we found a crowd experiencing the
            same problem.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden ">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={19}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={17}
            className="hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
};
