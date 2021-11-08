const cssPromises = {};

function loadResource(src) {

  if (src.endsWith('.js')) {
    return import(src);
  }

  if (src.endsWith('.css')) {

    if (!cssPromises[src]) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = src;
      cssPromises[src] = new Promise((resolve) => {
        link.addEventListener('load', () => resolve());
      });
      document.head.prepend(link);
    };
    return cssPromises[src];
  };
  return fetch(src).then((res) => res.json());
};

const appContainer = document.getElementById('app');
const searchParams = new URLSearchParams(location.search);
const film = searchParams.get('film');


export function rendalPage(moduleName, apiUrl, css) {
  Promise.all([moduleName, apiUrl, css].map((src) => loadResource(src))).then(
    ([pageModule, data]) => {
      appContainer.innerHTML = '';
      appContainer.append(pageModule.render(data));
    }
  );
}
function page(film) {
  if (film) {
    rendalPage(
      './film-info.js',
      `https://swapi.dev/api/films/${film}`,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css'
    );
  } else {
    rendalPage(
      './general-info.js',
      `https://swapi.dev/api/films`,
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css'
    );
  };
};

window.addEventListener('popstate', () => {
  page(film);
});

page(film);


