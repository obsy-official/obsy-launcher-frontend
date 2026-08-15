import { CheckCircle2, Cpu, Download, Folder, Layers, Shirt, Sliders } from "lucide-react";
import React, { useState } from "react";

interface TabItem {
  id: "instances" | "jvm" | "mods" | "wardrobe";
  label: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const tabs: TabItem[] = [
  {
    id: "instances",
    label: "Сборки и инстансы",
    icon: <Layers className="h-4 w-4" />,
    title: "Полная изоляция каждого инстанса",
    description:
      "Каждая версия игры создается в собственной изолированной директории. Конфигурации, моды, миры и скриншоты никогда не перемешиваются между сборками.",
  },
  {
    id: "jvm",
    label: "Память и JVM",
    icon: <Cpu className="h-4 w-4" />,
    title: "Автоматический подбор Java и Aikar's GC",
    description:
      "Obsy определяет требуемую версию OpenJDK (Java 8/17/21) и автоматически настраивает флаги Aikar's G1GC для снижения пауз Garbage Collector при прогрузке чанков.",
  },
  {
    id: "mods",
    label: "Каталог модов",
    icon: <Download className="h-4 w-4" />,
    title: "Интеграция с Modrinth и CurseForge",
    description:
      "Установка загрузчиков Fabric, Forge, NeoForge и Quilt в один клик с прямой загрузкой модов, ресурс-паков и шейдеров без открытия браузера.",
  },
  {
    id: "wardrobe",
    label: "Скины и профили",
    icon: <Shirt className="h-4 w-4" />,
    title: "Гардероб и мульти-профили",
    description:
      "Безопасная авторизация через официальный Microsoft OAuth2 и локальные оффлайн-профили. Удобная смена скинов и поддержка плащей.",
  },
];

export const LauncherShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabItem["id"]>("instances");
  const current = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Интерфейс и <span className="text-gradient">возможности лаунчера</span>
          </h2>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Продуманная архитектура для быстрой настройки и стабильной игры.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "border border-white/20 bg-white text-black shadow-lg"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Showcase Stage */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left: Info Description */}
            <div className="space-y-4 lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                <span>{current.label}</span>
              </div>
              <h3 className="text-xl font-bold text-white sm:text-2xl">{current.title}</h3>
              <p className="text-sm leading-relaxed text-slate-300">{current.description}</p>

              <div className="space-y-2 pt-2 text-xs text-slate-400">
                {activeTab === "instances" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Поддержка Fabric, Forge, NeoForge, Quilt и Vanilla</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Быстрое открытие папки инстанса через системный проводник</span>
                    </div>
                  </>
                )}
                {activeTab === "jvm" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Флаги -XX:+UseG1GC, -XX:+AlwaysPreTouch и G1NewSizePercent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Низкий resident footprint самого процесса лаунчера (~40 МБ)</span>
                    </div>
                  </>
                )}
                {activeTab === "mods" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Авто-проверка хешей ассетов перед скачиванием</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Параллельные HTTP/2 воркеры для мгновенной загрузки</span>
                    </div>
                  </>
                )}
                {activeTab === "wardrobe" && (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Безопасный OAuth2: токены шифруются локально</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Локальные профили для игры без интернета и на локальных серверах</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Authentic Interactive UI Replica */}
            <div className="rounded-xl border border-white/10 bg-[#0d0d0f] p-5 lg:col-span-7">
              {activeTab === "instances" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <Folder className="h-4 w-4 text-amber-400" /> Установленные инстансы
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px]">
                      .obsy/instances
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-white">
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          FABRIC
                        </span>
                        <div>
                          <div className="font-sans font-semibold">1.21.4 (Sodium + Iris)</div>
                          <div className="text-[11px] text-slate-400">
                            Java 21 • 32 мода • Папка: /instances/fabric-1.21.4
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400">Активен</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 text-slate-300">
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                          NEOFORGE
                        </span>
                        <div>
                          <div className="font-sans font-semibold">1.20.4 (Create World)</div>
                          <div className="text-[11px] text-slate-400">
                            Java 17 • 84 мода • Папка: /instances/neoforge-create
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500">Готов к запуску</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 text-slate-300">
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                          VANILLA
                        </span>
                        <div>
                          <div className="font-sans font-semibold">1.21.4 Release</div>
                          <div className="text-[11px] text-slate-400">
                            Java 21 • Чистая сборка • Папка: /instances/vanilla-latest
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500">Готов к запуску</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "jvm" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <Sliders className="h-4 w-4 text-emerald-400" /> Настройки памяти и JVM
                    </span>
                    <span className="text-emerald-400">Aikar's Flags: Включено</span>
                  </div>

                  <div className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex justify-between font-sans">
                      <span className="text-slate-300">Выделение оперативной памяти:</span>
                      <span className="font-mono font-bold text-white">6144 МБ (6 ГБ)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[60%] rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Мин: 2048 МБ</span>
                      <span>Рекомендуется для 1.21+: 6144 МБ</span>
                      <span>Всего: 16384 МБ</span>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] text-slate-400">
                    <div className="font-semibold text-slate-300">Параметры запуска:</div>
                    <div className="font-mono break-all text-emerald-400/90">
                      -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200
                      -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "mods" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <Download className="h-4 w-4 text-blue-400" /> Каталог Modrinth & CurseForge
                    </span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                      HTTP/2 • 50 потоков
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 text-white">
                      <div>
                        <div className="font-sans font-semibold">Sodium</div>
                        <div className="text-[11px] text-slate-400">
                          Современный движок рендеринга чанков • v0.6.6
                        </div>
                      </div>
                      <span className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-400">
                        УСТАНОВЛЕН
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 text-white">
                      <div>
                        <div className="font-sans font-semibold">Iris Shaders</div>
                        <div className="text-[11px] text-slate-400">
                          Поддержка шейдеров с нулевым оверхедом • v1.8.8
                        </div>
                      </div>
                      <span className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-400">
                        УСТАНОВЛЕН
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 text-white">
                      <div>
                        <div className="font-sans font-semibold">Lithium</div>
                        <div className="text-[11px] text-slate-400">
                          Оптимизация серверной физики и ИИ мобов • v0.14.3
                        </div>
                      </div>
                      <span className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-400">
                        УСТАНОВЛЕН
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "wardrobe" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-slate-400">
                    <span className="flex items-center gap-2 text-white">
                      <Shirt className="h-4 w-4 text-purple-400" /> Профили игроков и скины
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px]">
                      Microsoft OAuth2 / Offline
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/10 p-3 text-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 font-bold text-emerald-300">
                          M
                        </div>
                        <div>
                          <div className="font-sans font-semibold">Player_One</div>
                          <div className="text-[11px] text-slate-400">
                            Лицензия Microsoft • Скин Slim • Плащ: Migrator
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-400">Активен</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3 text-slate-300">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 font-bold text-slate-300">
                          O
                        </div>
                        <div>
                          <div className="font-sans font-semibold">DevLocal</div>
                          <div className="text-[11px] text-slate-400">
                            Локальный оффлайн-профиль для тестов
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500">Оффлайн</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
