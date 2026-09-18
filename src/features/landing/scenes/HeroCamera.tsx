"use client";

import Image from "next/image";
import { useRef } from "react";
import { heroScene } from "@/content/hero";
import {
  buildFrameUrls,
  createFrameLoader,
  drawFrame,
  resizeCanvas,
} from "@/features/landing/lib/frame-sequence";
import {
  cardRect,
  computeBaseScale,
  computeFrameRect,
  computeZoomForHeight,
  fullBleedRect,
  insetFromRect,
  lerp,
  lerpRect,
  projectRect,
  type Rect,
  rectCenter,
} from "@/features/landing/lib/hero-geometry";
import type { SequenceVariant } from "@/shared/lib/assets";
import { getDebugHero, getDebugMotion } from "@/shared/lib/motion/debug";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { lockScroll, unlockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

export type HeroImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
};

type HeroCameraProps = {
  wordmark: string;
  scrollLabel: string;
  cornerLabels: { topLeft: string; bottomRight: string };
  overlayText: string;
  background: string;
  frames: { desktop: SequenceVariant; mobile: SequenceVariant };
  camera: HeroImage;
  landscape: HeroImage;
  landscapeMobile: HeroImage;
};

const INTRO_MAX = 1.8;

function findPhaseLabel(progress: number): string {
  const labels = heroScene.progressLabels;
  let current = labels[0].label;

  for (const entry of labels) {
    if (progress >= entry.from) {
      current = entry.label;
    }
  }

  return current;
}

export function HeroCamera({
  wordmark,
  scrollLabel,
  cornerLabels,
  overlayText,
  background,
  frames,
  camera,
  landscape,
  landscapeMobile,
}: HeroCameraProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const query = <T extends HTMLElement>(name: string) =>
        root.querySelector<T>(`[data-hero="${name}"]`);

      const stage = query<HTMLDivElement>("stage");
      const canvas = query<HTMLCanvasElement>("canvas");
      const cameraLayer = query<HTMLDivElement>("camera");
      const fallback = query<HTMLDivElement>("fallback");
      const wordmarkEl = query<HTMLHeadingElement>("wordmark");
      const landscapeEl = query<HTMLDivElement>("landscape");
      const landscapeImage = query<HTMLDivElement>("landscape-image");
      const overlay = query<HTMLParagraphElement>("overlay");
      const overlayFrame = query<HTMLDivElement>("overlay-frame");
      const scrollHint = query<HTMLParagraphElement>("scroll-hint");
      const progressBar = query<HTMLSpanElement>("progress-bar");
      const phaseLabel = query<HTMLParagraphElement>("phase");
      const cornerEls = gsap.utils.toArray<HTMLElement>(
        '[data-hero="corner"]',
        root,
      );

      if (
        !stage ||
        !canvas ||
        !cameraLayer ||
        !wordmarkEl ||
        !landscapeEl ||
        !landscapeImage ||
        !overlay
      ) {
        return;
      }

      const debug = getDebugHero();
      const markers = debug || getDebugMotion();

      const revealLayers = () => {
        for (const element of gsap.utils.toArray<HTMLElement>(
          "[data-reveal]",
          root,
        )) {
          element.setAttribute("data-revealed", "");
        }
      };

      const setupScene = (variant: "desktop" | "mobile") => {
        revealLayers();

        const config = heroScene[variant];
        const frameVariant = frames[variant];
        const image = {
          width: frameVariant.width,
          height: frameVariant.height,
        };
        const loader = createFrameLoader(buildFrameUrls(frameVariant));
        const lastFrame = loader.count - 1;
        const cameraCenter = rectCenter(heroScene.cameraBox);
        const viewfinderCenter = rectCenter(heroScene.viewfinderRect);
        const phases = heroScene.phases;

        const state = {
          frame: 0,
          zoom: 1,
          focusX: cameraCenter.x,
          focusY: cameraCenter.y,
          reveal: 0,
          card: 0,
        };

        let viewport = { width: stage.clientWidth, height: stage.clientHeight };
        let ctx = resizeCanvas(canvas, viewport);
        let baseScale = 1;
        let zoomTarget = 1;
        let frameRect: Rect = { x: 0, y: 0, width: 0, height: 0 };
        let lastDrawKey = "";
        let lastClip = "";
        let lastPhase = "";
        let fallbackHidden = false;

        const measure = () => {
          viewport = { width: stage.clientWidth, height: stage.clientHeight };
          ctx = resizeCanvas(canvas, viewport);
          baseScale = computeBaseScale(
            viewport,
            image,
            heroScene.cameraBox,
            config.fit,
          );
          zoomTarget = Math.min(
            computeZoomForHeight(
              viewport.height * heroScene.viewfinderTargetHeight,
              heroScene.viewfinderRect,
              image,
              baseScale,
            ),
            heroScene.zoomMax,
          );
          lastDrawKey = "";
          lastClip = "";
        };

        const render = () => {
          frameRect = computeFrameRect(
            viewport,
            image,
            baseScale * state.zoom,
            {
              x: state.focusX,
              y: state.focusY,
            },
          );

          const index = Math.round(state.frame);
          const drawKey = `${index}|${state.zoom.toFixed(3)}|${state.focusX.toFixed(4)}|${state.focusY.toFixed(4)}`;

          if (ctx && drawKey !== lastDrawKey) {
            const frameImage = loader.frameAt(index);

            if (frameImage) {
              drawFrame(ctx, frameImage, frameRect, viewport);
              lastDrawKey = drawKey;

              if (!fallbackHidden && fallback) {
                fallbackHidden = true;
                gsap.set(fallback, { autoAlpha: 0 });
              }

              if (debug) {
                ctx.save();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#e5412d";
                const ocularBox = projectRect(
                  heroScene.viewfinderRect,
                  frameRect,
                );
                ctx.strokeRect(
                  ocularBox.x,
                  ocularBox.y,
                  ocularBox.width,
                  ocularBox.height,
                );
                ctx.strokeStyle = "#f2b233";
                const bodyBox = projectRect(heroScene.cameraBox, frameRect);
                ctx.strokeRect(
                  bodyBox.x,
                  bodyBox.y,
                  bodyBox.width,
                  bodyBox.height,
                );
                ctx.restore();
              }
            }
          }

          const ocular = projectRect(heroScene.viewfinderRect, frameRect);
          const ocularRadius =
            Math.min(ocular.width, ocular.height) *
            heroScene.viewfinderRadiusRatio;
          const full = fullBleedRect(viewport);

          let clipRect = lerpRect(ocular, full, state.reveal);
          let radius = lerp(ocularRadius, 0, state.reveal);

          if (state.card > 0) {
            clipRect = lerpRect(
              clipRect,
              cardRect(viewport, config.cardWidth, config.cardAspect),
              state.card,
            );
            radius = lerp(radius, config.cardRadius, state.card);
          }

          const clip = insetFromRect(clipRect, viewport, radius);

          if (clip !== lastClip) {
            landscapeEl.style.clipPath = clip;
            lastClip = clip;

            if (overlayFrame) {
              overlayFrame.style.left = `${clipRect.x}px`;
              overlayFrame.style.top = `${clipRect.y}px`;
              overlayFrame.style.width = `${clipRect.width}px`;
              overlayFrame.style.height = `${clipRect.height}px`;
            }
          }
        };

        measure();
        loader.start(() => {
          render();
        });

        gsap.set(landscapeEl, { autoAlpha: 0 });
        gsap.set(landscapeImage, { scale: 1.4 });
        gsap.set(cameraLayer, { autoAlpha: 1 });

        const split = SplitText.create(wordmarkEl, {
          type: "chars",
          mask: "chars",
          aria: "auto",
        });
        const overlaySplit = SplitText.create(overlay, {
          type: "lines",
          mask: "lines",
          aria: "auto",
        });

        gsap.set(overlaySplit.lines, { yPercent: 110 });

        const intro = gsap.timeline({ paused: true });

        intro
          .from(split.chars, {
            yPercent: 110,
            duration: dur.reveal,
            ease: ease.reveal,
            stagger: stagger.chars,
          })
          .from(
            cameraLayer,
            { scale: 0.92, autoAlpha: 0, duration: dur.reveal, ease: ease.out },
            0.3,
          )
          .from(
            [...cornerEls, scrollHint].filter(Boolean),
            {
              autoAlpha: 0,
              duration: dur.base,
              ease: ease.out,
              stagger: stagger.items,
            },
            0.6,
          );

        const setPhase = (progress: number) => {
          if (!phaseLabel) {
            return;
          }

          const next = findPhaseLabel(progress);

          if (next !== lastPhase) {
            phaseLabel.textContent = next;
            lastPhase = next;
          }
        };

        const timeline = gsap.timeline({
          defaults: { ease: ease.scrub },
          onUpdate: () => render(),
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: config.scrollLength,
            pin: true,
            anticipatePin: 1,
            scrub: scrub.scene,
            invalidateOnRefresh: true,
            markers,
            onUpdate: (self) => setPhase(self.progress),
            onRefresh: (self) => {
              measure();
              render();
              setPhase(self.progress);
            },
          },
        });

        const giro = phases.acercamiento - phases.giro;
        const acercamiento = phases.visor - phases.acercamiento;
        const visor = phases.sangre - phases.visor;
        const apertura = phases.tarjeta - phases.sangre;
        const tarjeta = 1 - phases.tarjeta;

        timeline
          .addLabel("f1-giro", phases.giro)
          .to(state, { frame: lastFrame, duration: giro }, phases.giro)
          .to(
            wordmarkEl,
            { xPercent: -14, opacity: 0.15, duration: giro },
            phases.giro,
          )
          .addLabel("f2-acercamiento", phases.acercamiento)
          .to(
            state,
            {
              zoom: () => zoomTarget,
              focusX: viewfinderCenter.x,
              focusY: viewfinderCenter.y,
              duration: acercamiento,
            },
            phases.acercamiento,
          )
          .to(
            [wordmarkEl, ...cornerEls],
            { autoAlpha: 0, duration: acercamiento * 0.8 },
            phases.acercamiento,
          )
          // F3: la ventana sigue pegada al ocular; solo entra la imagen interior.
          .addLabel("f3-visor", phases.visor)
          .to(landscapeEl, { autoAlpha: 1, duration: 0.02 }, phases.visor)
          .to(
            state,
            {
              zoom: () => zoomTarget * heroScene.exitZoomFactor,
              duration: visor,
            },
            phases.visor,
          )
          .to(landscapeImage, { scale: 1.12, duration: visor }, phases.visor)
          // F4: la ventana se abre a sangre y la cámara desaparece detrás.
          .addLabel("f4-sangre", phases.sangre)
          .to(state, { reveal: 1, duration: apertura }, phases.sangre)
          .to(landscapeImage, { scale: 1, duration: apertura }, phases.sangre)
          .to(
            cameraLayer,
            { autoAlpha: 0, duration: apertura * 0.4 },
            phases.sangre + apertura * 0.2,
          )
          .to(
            overlaySplit.lines,
            {
              yPercent: 0,
              duration: apertura * 0.5,
              stagger: stagger.lines,
              ease: ease.out,
            },
            phases.sangre + apertura * 0.5,
          )
          .addLabel("f5-tarjeta", phases.tarjeta)
          .to(state, { card: 1, duration: tarjeta }, phases.tarjeta)
          .to(
            landscapeImage,
            { scale: 1.06, duration: tarjeta },
            phases.tarjeta,
          );

        if (progressBar) {
          timeline.fromTo(
            progressBar,
            { scaleX: 0 },
            { scaleX: 1, duration: 1, ease: ease.scrub },
            0,
          );
        }

        // El hint se controla aparte: dentro del scrub, el `from` de la intro
        // lo dejaba visible cuando ambas animaciones coincidían.
        if (scrollHint) {
          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            onEnter: () =>
              gsap.to(scrollHint, {
                autoAlpha: 0,
                duration: dur.base,
                ease: ease.out,
                overwrite: "auto",
              }),
            onLeaveBack: () =>
              gsap.to(scrollHint, {
                autoAlpha: 1,
                duration: dur.base,
                ease: ease.out,
                overwrite: "auto",
              }),
          });
        }

        let locked = false;
        let guard: gsap.core.Tween | undefined;

        const release = () => {
          if (!locked) {
            return;
          }

          locked = false;
          unlockScroll();
        };

        const playIntro = (withLock: boolean) => {
          if (withLock) {
            locked = true;
            lockScroll();
            guard = gsap.delayedCall(INTRO_MAX, release);
          }

          intro.eventCallback("onComplete", release);
          intro.play();
        };

        // Si se recarga con la escena ya avanzada, la intro no debe repintar
        // los elementos que el scrub ya dejó fuera.
        const atSceneStart = () =>
          (timeline.scrollTrigger?.progress ?? 0) <= 0.001;

        if (!atSceneStart()) {
          intro.kill();
        } else if (
          window.scrollY <= 2 &&
          Math.abs(stage.getBoundingClientRect().top) < 4
        ) {
          // La intro solo bloquea el scroll si la escena ya está arriba al cargar.
          playIntro(true);
        } else {
          ScrollTrigger.create({
            trigger: stage,
            start: "top 65%",
            once: true,
            onEnter: () => {
              if (atSceneStart()) {
                playIntro(false);
              }
            },
          });
        }

        let removeDebug: (() => void) | undefined;

        if (debug) {
          const clicks: { x: number; y: number }[] = [];

          const onClick = (event: MouseEvent) => {
            const bounds = canvas.getBoundingClientRect();
            const x =
              (event.clientX - bounds.left - frameRect.x) / frameRect.width;
            const y =
              (event.clientY - bounds.top - frameRect.y) / frameRect.height;

            clicks.push({ x, y });
            console.info(
              `[hero] esquina ${clicks.length}: x=${x.toFixed(3)} y=${y.toFixed(3)}`,
            );

            if (clicks.length >= 2) {
              const xs = clicks.map((point) => point.x);
              const ys = clicks.map((point) => point.y);
              const minX = Math.min(...xs);
              const minY = Math.min(...ys);

              console.info(
                "[hero] viewfinderRect:",
                JSON.stringify({
                  x: Number(minX.toFixed(3)),
                  y: Number(minY.toFixed(3)),
                  width: Number((Math.max(...xs) - minX).toFixed(3)),
                  height: Number((Math.max(...ys) - minY).toFixed(3)),
                }),
              );
            }
          };

          canvas.addEventListener("click", onClick);
          removeDebug = () => canvas.removeEventListener("click", onClick);
        }

        return () => {
          removeDebug?.();
          guard?.kill();
          release();
          intro.kill();
          split.revert();
          overlaySplit.revert();
          loader.dispose();
        };
      };

      const setupStatic = () => {
        revealLayers();
        gsap.set(cameraLayer, { autoAlpha: 1 });
        gsap.set(landscapeImage, { scale: 1 });
        gsap.set(landscapeEl, { clipPath: "none" });
        gsap.from(landscapeEl, {
          autoAlpha: 0,
          duration: dur.base,
          ease: ease.out,
          scrollTrigger: { trigger: landscapeEl, start: "top 85%", once: true },
        });
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => setupScene("desktop"));
      mm.add(MOTION_MOBILE, () => setupScene("mobile"));
      mm.add(MOTION_REDUCED, () => setupStatic());

      return () => {
        mm.revert();
        ScrollTrigger.refresh();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate"
      style={{ backgroundColor: background }}
    >
      {/* El paisaje vive dentro del escenario: al pinear, todo comparte el
          tamaño del viewport y el clip-path se mide contra él. */}
      <div
        data-hero="stage"
        className="relative h-[100svh] overflow-hidden motion-reduce:h-auto motion-reduce:overflow-visible"
      >
        <div className="absolute inset-x-0 top-0 z-25 flex h-[100svh] items-center justify-center mix-blend-multiply motion-reduce:h-[80svh]">
          <h1
            id="hero-title"
            data-hero="wordmark"
            data-reveal
            className="text-mega whitespace-nowrap px-4 text-center font-display text-ink"
          >
            {wordmark}
          </h1>
        </div>

        <div
          data-hero="camera"
          className="absolute inset-0 z-20 motion-reduce:relative motion-reduce:h-[80svh]"
        >
          <div data-hero="fallback" className="absolute inset-0">
            <Image
              src={camera.src}
              alt={camera.alt}
              fill
              sizes="100vw"
              priority
              placeholder={camera.blurDataURL ? "blur" : "empty"}
              blurDataURL={camera.blurDataURL}
              className="object-cover"
            />
          </div>
          <canvas
            data-hero="canvas"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div
          data-hero="landscape"
          id="viewfinder"
          className="absolute inset-0 z-30 overflow-hidden motion-reduce:relative motion-reduce:mx-auto motion-reduce:mt-[var(--space-16)] motion-reduce:mb-[var(--space-24)] motion-reduce:aspect-[9/16] motion-reduce:w-[92%] motion-reduce:rounded-[16px] lg:motion-reduce:aspect-video lg:motion-reduce:w-[88%] lg:motion-reduce:rounded-3xl"
        >
          <div data-hero="landscape-image" className="absolute inset-0">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet={landscape.src}
                width={landscape.width}
                height={landscape.height}
              />
              <img
                src={landscapeMobile.src}
                alt={landscape.alt}
                width={landscapeMobile.width}
                height={landscapeMobile.height}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
          </div>

          {/* El marco sigue a la ventana recortada para que el pie no se
              corte mientras el clip-path se abre o se cierra en tarjeta. */}
          <div
            data-hero="overlay-frame"
            className="absolute top-0 left-0 flex h-full w-full items-end p-[var(--margin-page)] pb-[var(--space-12)]"
          >
            <p
              data-hero="overlay"
              className="text-h2 w-[min(18ch,72vw)] shrink-0 font-display text-paper"
            >
              {overlayText}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[100svh] motion-reduce:h-[80svh]">
          <p
            data-hero="corner"
            data-reveal
            className="font-mono-label absolute top-6 left-[var(--margin-page)] text-ink-2"
          >
            {cornerLabels.topLeft}
          </p>
          <p
            data-hero="corner"
            data-reveal
            className="font-mono-label absolute right-[var(--margin-page)] bottom-16 text-ink-2"
          >
            {cornerLabels.bottomRight}
          </p>
          <p
            data-hero="scroll-hint"
            data-reveal
            className="font-mono-label absolute bottom-16 left-1/2 -translate-x-1/2 text-ink-2 motion-reduce:hidden"
          >
            {scrollLabel}
          </p>

          <div className="absolute inset-x-0 bottom-0 motion-reduce:hidden">
            <p
              data-hero="phase"
              data-reveal
              className="font-mono-label px-[var(--margin-page)] pb-6 text-ink-2"
            >
              {heroScene.progressLabels[0].label}
            </p>
            <div data-reveal className="h-[2px] bg-ink/10">
              <span
                data-hero="progress-bar"
                className="block h-full w-full origin-left scale-x-0 bg-shutter"
              />
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <style>{`
          [data-hero="landscape"] {
            position: relative !important;
            visibility: visible !important;
            opacity: 1 !important;
            clip-path: none !important;
            width: 88% !important;
            margin: var(--space-16) auto var(--space-24) !important;
            aspect-ratio: 16 / 9;
            border-radius: 24px;
          }
          [data-hero="canvas"] { display: none; }
        `}</style>
      </noscript>
    </section>
  );
}
