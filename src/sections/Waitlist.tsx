"use client";
import ArrowRight from "@/assets/arrow-right.svg";
import Star from "@/assets/star.png";
import Spring from "@/assets/spring.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import fetch from "node-fetch";
type refProp = {
  refProp: React.RefObject<HTMLDivElement>;
};
export const Waitlist: React.FC<refProp> = ({ refProp }) => {
  const [email, setEmail] = useState<string>("none");
  const [isSuccessful, setIsSuccessful] = useState<Boolean>(false);
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (validateEmail(email)) {
      setError("");
      sub();
    } else {
      setError("Please enter a valid email address");
    }
  };
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const sub = () => {
    if (email != "none") {
      const url = `https://a.klaviyo.com/client/subscriptions/?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_API}`;
      const options = {
        method: "POST",
        headers: { revision: "2024-07-15", "content-type": "application/json" },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: { email: email },
                },
              },
            },
            relationships: {
              list: {
                data: { type: "list", id: process.env.NEXT_PUBLIC_LIST },
              },
            },
          },
        }),
      };
      fetch(url, options)
        .then((res) => {
          if (res.status == 202) {
            setIsSuccessful(true);
          }
          console.log(res.status);
        })
        .catch((err) => {
          setIsSuccessful(false);
          console.error("error:" + err);
        });
    }
  };
  return (
    <section
      ref={refProp}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div ref={sectionRef} className="container">
        <div className="section-heading relative">
          <h2 className="section-title">Join the Waitlist Today</h2>
          <p className="section-description mt-5">
            Be among the first to experience effortless outfits every day. Join
            now and get early access to a smarter way to dress.
          </p>

          <motion.img
            src={Star.src}
            alt="star image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{ translateY }}
          />
          <motion.img
            src={Spring.src}
            alt="spring image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{ translateY }}
          />
        </div>

        <div className="flex gap-2 mt-10 justify-center">
          {isSuccessful ? (
            <div className="flex w-full font-bold max-w-sm justify-center items-center space-x-2">
              Thank you, you&apos;re in!
              <Check color="green" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-x-2">
              <div className="inline-flex w-full gap-6">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email == "none" ? "" : email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={error ? "border-red-500" : ""}
                />
                <Button type="submit">Join Waitlist</Button>
              </div>
              <div>{error && <p className="text-red-500">{error}</p>}</div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
