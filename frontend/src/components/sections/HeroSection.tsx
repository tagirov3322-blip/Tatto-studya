"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { BGPattern } from "@/components/ui/bg-pattern"

const tattooImages = [
  { url: "/1.jpg", title: "Работа 1" },
  { url: "/2.jpg", title: "Работа 2" },
  { url: "/3.jpg", title: "Работа 3" },
  { url: "/4.jpg", title: "Работа 4" },
  { url: "/5.jpg", title: "Работа 5" },
  { url: "/6.jpg", title: "Работа 6" },
  { url: "/7.jpg", title: "Работа 7" },
  { url: "/8.jpg", title: "Работа 8" },
  { url: "/9.jpg", title: "Работа 9" },
  { url: "/10.jpg", title: "Работа 10" },
  { url: "/11.jpg", title: "Работа 11" },
  { url: "/12.jpg", title: "Работа 12" },
  { url: "/13.jpg", title: "Работа 13" },
  { url: "/14.jpg", title: "Работа 14" },
  { url: "/15.jpg", title: "Работа 15" },
]

export function HeroSection() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const smooth = [0.22, 1, 0.36, 1] as [number, number, number, number];

    animate(
      "[data-hero-bar]",
      { scaleX: [0, 1] },
      { duration: 0.6, ease: smooth }
    )

    animate(
      "[data-hero-line]",
      { opacity: [0, 1], y: [16, 0] },
      { duration: 0.7, delay: stagger(0.05), ease: smooth }
    )

    animate(
      "[data-hero-buttons]",
      { opacity: [0, 1], y: [12, 0] },
      { duration: 0.7, delay: 0.15, ease: smooth }
    )

    // Картинки стартуют почти сразу
    animate(
      "img",
      { opacity: [0, 1], scale: [0.9, 1] },
      { duration: 0.8, delay: stagger(0.06, { startDelay: 0.1 }), ease: smooth }
    )
  }, [animate])

  return (
    <section
      id="hero"
      className="relative flex w-full min-h-screen justify-center items-center overflow-hidden"
      style={{ background: "linear-gradient(to top, rgba(22,101,52,0.25) 0%, rgba(0,0,0,1) 60%)" }}
      ref={scope}
    >
      <BGPattern variant="grid" mask="fade-center" fill="rgba(34,197,94,0.12)" size={32} />

      {/* Центральный контент */}
      <div className="z-50 text-center space-y-5 items-center flex flex-col px-4">
        <div data-hero-bar className="w-20 h-1 bg-green-500 rounded-full origin-left" style={{ opacity: 0 }} />

        <div data-hero-line style={{ opacity: 0 }}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-white font-bold tracking-tighter uppercase flex">
            {"Клякса".split("").map((char, i) => (
              <motion.span
                key={i}
                className={`inline-block cursor-default select-none ${i === 0 ? "-ml-3 md:-ml-5" : ""} ${char === "к" && i === 3 ? "text-green-400" : ""}`}
                whileHover={{ scale: 1.3, y: -8 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        <div data-hero-buttons className="flex gap-5 mt-2" style={{ opacity: 0 }}>
          <motion.a
            href="#tattoo-price"
            className="group relative text-sm bg-green-600 text-white rounded-full py-3.5 px-9 cursor-pointer font-semibold uppercase tracking-wider overflow-hidden"
            whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(34,197,94,0.4)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="relative z-10">Записаться</span>
            <motion.span
              className="absolute inset-0 bg-green-400 rounded-full"
              initial={{ scale: 0, opacity: 0.3 }}
              whileHover={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.a>
          <motion.a
            href="#portfolio"
            className="group relative text-sm border-2 border-green-500/30 text-green-400 rounded-full py-3.5 px-9 cursor-pointer font-semibold uppercase tracking-wider overflow-hidden"
            whileHover={{ scale: 1.04, borderColor: "rgba(34,197,94,0.7)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <span className="relative z-10">Наши работы</span>
            <motion.span
              className="absolute inset-0 bg-green-500/10 rounded-full"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.a>
        </div>
      </div>

      {/* Параллакс-картинки — начинают невидимыми, появляются после текста */}
      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[14%] left-[11%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[0].url} alt={tattooImages[0].title}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[16%] left-[32%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[1].url} alt={tattooImages[1].title}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[8%] left-[48%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[2].url} alt={tattooImages[2].title}
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[14%] left-[88%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[3].url} alt={tattooImages[3].title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[4].url} alt={tattooImages[4].title}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[65%] left-[75%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[5].url} alt={tattooImages[5].title}
            className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[6].url} alt={tattooImages[6].title}
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[7].url} alt={tattooImages[7].title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>

        {/* Новые фотографии */}
        <FloatingElement depth={1.5} className="top-[35%] left-[90%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[8].url} alt={tattooImages[8].title}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[50%] left-[18%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[9].url} alt={tattooImages[9].title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={0.8} className="top-[50%] left-[72%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[10].url} alt={tattooImages[10].title}
            className="w-20 h-28 md:w-28 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={3} className="top-[85%] left-[30%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[11].url} alt={tattooImages[11].title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={1.2} className="top-[28%] left-[72%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[12].url} alt={tattooImages[12].title}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={2.5} className="top-[85%] left-[88%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[13].url} alt={tattooImages[13].title}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
        <FloatingElement depth={1.8} className="top-[8%] left-[68%]">
          <motion.img initial={{ opacity: 0 }} src={tattooImages[14].url} alt={tattooImages[14].title}
            className="w-18 h-24 md:w-24 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg border border-green-500/20" />
        </FloatingElement>
      </Floating>
    </section>
  )
}
