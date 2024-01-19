import {
  createOptimizedPicture,
} from '../../scripts/aem.js';

const getMetadata = (name, doc) => {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = [...doc.head.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map((m) => m.content)
    .join(', ');
  return meta || '';
};

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {Document} The document
 */
async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const resp = await fetch(path);
    if (resp.ok) {
      const parser = new DOMParser();
      return parser.parseFromString(await resp.text(), 'text/html');
    }
  }
  return null;
}

/**
 * @param {HTMLElement} $block The header block element
 */
export default async function decorate($block) {
  const link = $block.querySelector('a');
  const path = link ? link.getAttribute('href') : $block.textContent.trim();
  const doc = await loadFragment(path);
  if (!doc) {
    return;
  }

  // find metadata
  const title = getMetadata('og:title', doc);
  const desc = getMetadata('og:description', doc);
  const date = getMetadata('date', doc);
  const time = getMetadata('time', doc);
  const instructor = getMetadata('instructor', doc);
  const location = getMetadata('location', doc);
  const cost = getMetadata('cost', doc);
  const type = getMetadata('type', doc);
  const picture = getMetadata('og:image', doc);

  const $pre = document.createElement('h3');
  $pre.textContent = type;

  const $date = document.createElement('p');
  $date.textContent = date;

  const $time = document.createElement('p');
  $time.textContent = time;

  const $instructor = document.createElement('p');
  $instructor.textContent = instructor;

  const $location = document.createElement('p');
  $location.textContent = location;

  const $cost = document.createElement('p');
  $cost.textContent = cost;

  const $h2 = document.createElement('h2');
  $h2.textContent = title;

  const $p = document.createElement('p');
  $p.textContent = desc;

  const $link = document.createElement('div');
  $link.className = "button";
  $link.append(link);
  link.textContent = 'Register Here';

  const $text = document.createElement('div');
  $text.classList.add('text');
  $text.append($pre, $date, $time, $instructor, $location, $cost, $h2, $p, $link);

  const $image = document.createElement('div');
  $image.classList.add('image');
  // find image
  const $hero = createOptimizedPicture(picture);
  if ($hero) {
    $image.append($hero);
  }

  $block.replaceChildren($image, $text);
}
