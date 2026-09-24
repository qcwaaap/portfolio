# Portfolio — scrapbook
  npm install
  npm run build
  npm run start

## Что настроить под себя
- `src/content/projects.ts`  тексты, теги, ссылки, скриншоты проектов
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