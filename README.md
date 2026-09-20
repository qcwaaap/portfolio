# Portfolio — scrapbook

Готово: экран загрузки → hero (коллаж, заголовок штрихами, курсор, плавный скролл, параллакс).

    npm install
    npm run dev

Где что лежит
- `src/components/loader/`   экран загрузки
- `src/components/hero/`     hero: коллаж, заголовок, доодлы
- `src/components/collage/`  Item (предмет на «столе» + параллакс) и Photo (фото на скотче)
- `src/components/cursor/`   кастомный курсор (OPEN / VIEW / PET через data-cursor="…")
- `src/components/smooth/`   плавный скролл (Lenis)
- `src/content/photos.ts`    фотографии: впиши пути к своим файлам из public/images
- `src/lib/`                 sketch.ts (рисованная геометрия), handFont.ts (шрифт из штрихов)
