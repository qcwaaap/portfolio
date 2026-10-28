# Portfolio — scrapbook

Next.js 16 · React 19 · GSAP · Lenis. Языки: `/en`, `/zh`. Тёмная/светлая тема, звук, собака.

## Запуск
```
npm install
npm run dev        # разработка
npm run typecheck  # проверка типов
npm run build && npm run start
```
Перед деплоем задай `NEXT_PUBLIC_SITE_URL=https://твой-домен` — от него зависят canonical, hreflang, sitemap и OG-превью.

## Структура
- `src/app/[locale]/` — страница, `<html lang>`, метаданные, OG-картинка
- `src/i18n/` — словари (`dictionaries/en.ts`, `zh.ts`), `proxy.ts` перенаправляет `/` на язык браузера
- `src/components/` — секции (hero, work, about, contact) и украшения (loader, dog, cursor)
- `src/content/` — данные, которые правишь руками

## Что настроить под себя
- `src/content/projects.ts`  ссылки и скриншоты проектов (картинки кладём в `public/images/projects/`, путь вписываем в `image`; пустые `links` показывают «скоро»). Тексты — в `src/i18n/dictionaries/`
- `src/content/photos.ts`    все фото сайта — путь из public/images
- `src/content/skills.ts`    навыки
- `src/content/contact.ts`   контакты (пустые ссылки видны только в dev)

## Звук (src/lib/sound/engine.ts)

## Cadence (src/components/cadence/)
колесо на чёрном листе с тахометром.
  - скролл раскручивает колесо (секция закреплена на время прокрутки)
  - мышь слегка наклоняет и сдвигает лист
  - колесо можно раскрутить рукой — дальше крутится по инерции
  - RPM, стрелка тахометра и «кардиограмма» реагируют на скорость

## Собака (src/components/dog/RoamingDog.tsx)
выходит раз в 25–60 с (первый раз через ~10 с после загрузки), гуляет по
низу экрана, смотрит на курсор, её можно погладить.