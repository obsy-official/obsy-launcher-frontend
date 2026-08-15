import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: "Лицензия",
    question: "Лаунчер действительно бесплатный?",
    answer:
      "Да, Obsy Launcher разрабатывается как открытый проект под лицензией MIT. В исходном коде нет рекламных модулей, сторонних трекеров, баннеров и скрытых сборов.",
  },
  {
    category: "Безопасность",
    question: "Где хранятся токены и настройки?",
    answer:
      "Все конфигурационные файлы и сессионные токены хранятся исключительно локально на вашем компьютере. Данные профилей зашифрованы алгоритмом AES-256 с привязкой к системному защищённому хранилищу ключей (macOS Keychain / Windows Credential Manager).",
  },
  {
    category: "Загрузчик",
    question: "Как достигается высокая скорость скачивания?",
    answer:
      "Асинхронный сетевой движок на Rust выполняет параллельные HTTP/2 запросы до 50 воркеров с локальной проверкой SHA-1 контрольных сумм ассетов и библиотек.",
  },
  {
    category: "Модлоадеры",
    question: "Поддерживаются ли моды и загрузчики (Fabric, Forge, NeoForge, Quilt)?",
    answer:
      "Да. Лаунчер полноценно поддерживает запуск ванильных версий, а также Fabric, Forge, NeoForge и Quilt с автоматической подгрузкой библиотек, нативных файлов и пресетов.",
  },
  {
    category: "Java",
    question: "Нужно ли вручную скачивать Java?",
    answer:
      "Нет. Лаунчер автоматически подбирает и скачивает подходящий дистрибутив Eclipse Temurin (Java 8, 17 или 21) под конкретную версию игры и изолирует его в системной папке.",
  },
  {
    category: "Сборки",
    question: "Как работает изоляция инстансов?",
    answer:
      "Каждая созданная версия изолируется в собственной директории /instances. Миры, моды, скриншоты и конфигурации одной версии не перезаписывают файлы других сборок.",
  },
  {
    category: "Профили",
    question: "Какие типы аккаунтов поддерживаются?",
    answer:
      "Поддерживается безопасный вход через официальный Microsoft OAuth2 (Device Flow), а также локальные оффлайн-профили для одиночной игры и локальных серверов.",
  },
  {
    category: "Оптимизация",
    question: "Как лаунчер оптимизирует производительность игры?",
    answer:
      "Лаунчер автоматически применяет флаги сборщика мусора Aikar's G1GC для устранения микрофризов, интеллектуально выделяет оптимальный объем RAM на основе параметров системы и включает платформенные оптимизации.",
  },
];

export const FaqAccordion: React.FC = () => {
  return (
    <section id="faq" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Частые вопросы</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Вопросы и <span className="text-gradient">ответы</span>
          </h2>
        </div>

        <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={faq.question}
              value={`item-${idx}`}
              className="rounded-2xl border-white/10 bg-white/[0.02] backdrop-blur-md data-[state=open]:border-white/20 data-[state=open]:bg-white/[0.04]"
            >
              <AccordionTrigger className="text-sm sm:text-base">
                <span className="flex items-center gap-3 font-semibold text-slate-100">
                  <span className="rounded border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {faq.category}
                  </span>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="border-t border-white/10 leading-relaxed text-slate-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
