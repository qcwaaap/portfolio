# Portfolio — scrapbook

Готово: лоадер → hero → selected work → about + skills → contact + footer + собака-пасхалка.

    npm install
    npm run dev

Собака (src/components/dog/RoamingDog.tsx): сама выходит раз в 25–60 с (первый раз через ~10 с после загрузки).
Чтобы увидеть сразу — в консоли браузера: window.dispatchEvent(new Event('dog:spawn'))
