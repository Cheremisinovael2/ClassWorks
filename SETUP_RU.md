# Настройка ClassWorks

Главная React-страница находится в `site/`. Исходники React-колеса — в `wheel-of-fortune/`. Папка `random-number-generator/` содержит готовый генератор из текущего ClassWorks; его прежний Webpack-проект остаётся в отдельном репозитории random-number-generator. Код кнопки в `random-number-generator/index.js` сделан читаемым и исправлен: удалён ошибочный браузерный вызов HtmlWebpackPlugin. Генератор использует обычный JavaScript, а главная страница и колесо — React. Дизайн страниц сохранён.

## 1. Сохраните текущую работу
Закройте сервер в терминале сочетанием Ctrl+C. Скопируйте свои папки `C:\3rd-year\ClassWorks` и `C:\3rd-year\site` в резервные папки. Архив подготовлен по версиям на GitHub: незагруженные локальные изменения в него не входят.

## 2. Подставьте подготовленные файлы
Распакуйте архив в отдельную папку. В своей `C:\3rd-year\ClassWorks` оставьте существующую `.git`. После создания резервной копии уберите старые `src`, `public`, `index.html`, `vite.config.js`, `package.json`, `package-lock.json`, `.oxlintrc.json` из корня. Они теперь находятся внутри `site` (корневой package.json заменяется новым).
Скопируйте содержимое подготовленной папки ClassWorks в свою ClassWorks, включая `.github` и `.gitignore`. Разрешите замену совпадающих файлов. Не копируйте `.git` из другой папки. Старую внешнюю папку site пока сохраните как резервную копию.

## 3. Установите зависимости и запустите
Откройте именно `C:\3rd-year\ClassWorks` в VS Code. В терминале PowerShell выполните:

```powershell
cd C:\3rd-year\ClassWorks
node --version
npm ci --prefix site
npm ci --prefix wheel-of-fortune
npm run dev
```

Используйте Node.js 22.12+ или более новую совместимую версию. Откройте адрес, который напечатает Vite, с путём `/ClassWorks/` (обычно http://localhost:5173/ClassWorks/). Проверьте обе карточки. Запускайте через Vite, а не двойным щелчком по index.html.

`npm run dev` сначала собирает колесо и копирует обе работы в `site/public/`, затем запускает главную страницу. После изменения кода колеса остановите этот сервер и снова выполните `npm run dev`. Для работы над самим колесом с автоматическим обновлением используйте `npm --prefix wheel-of-fortune run dev`.

## 4. Проверьте общую сборку

```powershell
npm run build
npm run preview
```

Откройте адрес preview с `/ClassWorks/`. Общая сборка находится в `site/dist/`. Домашние работы открываются по `/ClassWorks/random-number-generator/` и `/ClassWorks/wheel-of-fortune/`. Папка site — расположение исходников, поэтому в адресе опубликованного сайта `/site/` не появляется.

## 5. Отправьте в правильный репозиторий

```powershell
git remote -v
git branch --show-current
git status
```

origin должен указывать на https://github.com/Cheremisinovael2/ClassWorks.git. Если это другой адрес, остановитесь и проверьте, что открыли нужную папку. Workflow рассчитан на ветку master. Если работаете в другой ветке, замените master в `.github/workflows/deploy.yml` на её имя.

Просмотрите изменения, затем:

```powershell
git add .
git commit -m "Organize ClassWorks site and homework deployment"
git push
```

Не выполняйте git init: в ClassWorks уже есть собственная `.git`. Вложенной `.git` внутри site и домашних работ быть не должно. node_modules, dist и автоматически подготовленные копии работ игнорируются.

## 6. Включите GitHub Pages
В репозитории ClassWorks откройте Settings → Pages → Build and deployment → Source → GitHub Actions. Если первая сборка завершилась до выбора источника и завершилась ошибкой, откройте Actions → Deploy ClassWorks → Run workflow. После успешного выполнения адрес будет https://cheremisinovael2.github.io/ClassWorks/.

Отдельный репозиторий random-number-generator не удаляйте: это другой проект, и его файлы не требуется объединять с `.git` ClassWorks.
