import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 border-y border-green-500/20 bg-[radial-gradient(35%_80%_at_25%_0%,rgba(34,197,94,0.08),transparent)] px-6 py-10 rounded-xl">
      <PlusIcon
        className="absolute top-[-12.5px] left-[-11.5px] z-1 size-6 text-green-500/50"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute top-[-12.5px] right-[-11.5px] z-1 size-6 text-green-500/50"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute bottom-[-12.5px] left-[-11.5px] z-1 size-6 text-green-500/50"
        strokeWidth={1}
      />
      <PlusIcon
        className="absolute right-[-11.5px] bottom-[-12.5px] z-1 size-6 text-green-500/50"
        strokeWidth={1}
      />

      <div className="-inset-y-6 pointer-events-none absolute left-0 w-px border-l border-green-500/20" />
      <div className="-inset-y-6 pointer-events-none absolute right-0 w-px border-r border-green-500/20" />

      <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-green-500/10" />

      <div className="space-y-1">
        <h2 className="text-center font-bold text-2xl text-white">
          Готов начать свой путь в тату-индустрии?
        </h2>
        <p className="text-center text-neutral-400">
          Запишись на бесплатную консультацию прямо сейчас.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300">
          Задать вопрос
        </Button>
        <Button className="bg-green-600 text-white hover:bg-green-700">
          Записаться <ArrowRightIcon className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
