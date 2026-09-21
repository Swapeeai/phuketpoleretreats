"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.pause();
      return;
    }

    const tryPlay = () => {
      video.play().then(() => setPlaying(true)).catch(() => {
        /* poster remains as LCP */
      });
    };

    tryPlay();
    video.addEventListener("playing", () => setPlaying(true));
    video.addEventListener("canplay", tryPlay);
    return () => {
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <Image
        src="/videos/hero-poster.jpg"
        alt="Pole dance in motion at the Phuket Pole Art Retreat, Ayara Kamala"
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-500 ${playing ? "opacity-0" : "opacity-100"}`}
      />
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
