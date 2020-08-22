# Parseur Markdown vers HTML pour Node.js 
<a href="README.md"><img src="./img/gb.svg" height="16px"></a>
<a href="README.fr.md"><img src="./img/fr.svg" height="16px"></a>

Ce parseur Markdown-vers-HTML utilise une syntaxe personnalisée et allégée du language Markdown.

Il permet de créer: des textes en italique, textes en gras et textes barrés, des exposants, des liens, des titres et sous-titres, des images, des vidéos, du code mono et multi lignes, des listes numérotées et non-numérotées, des listes imbriquées, des lignes horizontales, des citations et des références.


## Utilisation

```javascript
const parser = require('@deskeen/markdown')
const html = parser.parse('mon texte markdown').innerHTML

// html === '<p>mon texte markdown</p>'
```

## En savoir plus

- [Installation](#installation)
- [Options du parseur](#options-du-parseur)
- [L'objet Element](#l'objet-element)
- [Résumé des syntaxes Markdown](#résumé-des-syntaxes-markdown)
- [Syntaxes Markdown](#syntaxes-markdown)
  - [Texte en italique](#texte-en-italique)  
  - [Texte en gras](#texte-en-gras)
  - [Texte en gras-italique](#texte-en-gras-italique)
  - [Texte barré](#texte-barre)
  - [Exposant](#exposant)
  - [Paragraphe](#paragraphe)
  - [Titre](#titre)
  - [Lien](#lien)
  - [Image](#image)
  - [Vidéo](#vidéo)
  - [Liste non-numérotée](#liste-non-numérotée)
  - [Liste numérotée](#liste-numérotée)
  - [Ligne horizontale](#ligne-horizontale)
  - [Code](#code)
  - [Code multi lignes](code-multi-lignes)
  - [Citation](#citation)
  - [Référence](#reference)
  - [Caractère d'échappement](#escape-character)
- [Compatibilité avec d'autres Markdown populaires](#compatibilité-avec-d-autres-Markdown-populaires)
- [Syntaxes incompatibles](#syntaxes-incompatibles)
- [Exemples](#exemples)
  - [Ajouter un identifiant aux titres](#ajouter-un-identifiant-aux-titres)
  - [Ouvrir les liens externes dans un nouvel onglet](#ouvrir-les-liens-externes-dans-un-nouvel-onglet)
  - [Ajouter un préfixe aux liens relatifs des images](#ajouter-un-préfixe-aux-liens-relatifs-des-images)
  - [Ajouter une classe CSS au code](#ajouter-une-classe-CSS-au-code)
  - [Afficher joliment les objets JSON](#afficher-joliment-les-objets-json)
- [Autres ressources](#autres-ressources)
- [Contact](#contact)
- [Licence](#licence)


## Installation

Ce paquet peut être ajouté à la liste des dépendances de votre projet [Node.js](https://nodejs.org/en/) en exécutant la commande:

```
npm install @deskeen/markdown
```

Pour importer le parseur à votre coe JavaScript: 

```javascript
const parseur = require('@deskeen/markdown')
```

Pour parser du texte et le transformer en HTML, utilisez:

```javascript
const codeHtml = parseur.parse('du texte markdown').innerHTML
```

Le parseur a été testé avec les versions 10+ de Node.js mais il se peut qu'il fonctionne aussi sur des versions précédentes.


## Options du parseur

`parse(markdownText[, options])`

Un objet avec les options peut être passé au parseur.

Les options disponibles sont:
- `allowHeader`: Si les titres headers sont autorisés. `true` par défaut.
- `allowLink`: Si les liens sont autorisés. `true` par défaut.
- `allowImage`: Si les images sont autorisées. `true` par défaut.
- `allowImageStyle`: Si du style peut être appliqué aux images. `false` par défaut.
- `allowCode`: Si du code est autorisé. `true` par défaut.
- `allowMultilineCode`: Si du code multi lignes est autorisé. `true` par défaut.
- `allowUnorderedList`: Si les listes non-numérotées sont autorisées. `true` par défaut.
- `allowOrderedNestedList`: Si les listes numérotées imbriquées sont autorisées. `true` par défaut.
- `allowOrderedList`: Si les listes numérotées sont autorisées. `true` par défaut.
- `allowOrderedList`: Si les listes numérotées imbriquées sont autorisées. `true` par défaut.
- `allowHorizontalLine`: Si les lignes horizontales sont autorisées. `true` par défaut.
- `allowQuote`: Si les citations sont autorisées. `true` par défaut.
- `allowReference`: Si les références sont autorisées. `true` par défaut.
- `maxHeader`: Niveau maximal des titres. Nombre de 1 à 6 inclus. e.g. 2 signifie que les balises autorisées sont `<h1>` et `<h2>`. 6 par défaut.

Des fonctions Callback peuvent aussi être ajoutées aux options du parseur. Ces fonctions permettent de modifier l'[élément](#l-objet-element) de sortie (e.g. ajouter des attributs personnalisés)

Les Callbacks disponibles sont:
- `onHeader`: Fonction appelée lorsqu'un titre est parsé.
- `onLink`: Fonction appelée lorsqu'un lien est parsé.
- `onImage`: Fonction appelée lorsqu'une image est parsée.
- `onVidéo`: Fonction appelée lorsqu'une video est parsée.
- `onCode`: Fonction appelée lorsque du code est parsé.
- `onMultilineCode`: Fonction appelée lorsque du code multi lignes est parsé. Le deuxième argument est le nom (optionnel) du langage.
- `onUnorderedList`: Fonction appelée lorsqu'une liste non numérotée est parsée.
- `onOrderedList`: Fonction appelée lorsqu'une liste numérotée est parsée.
- `onHorizontalLine`: Fonction appelée lorsqu'une ligne horizontale est parsée.
- `onQuote`: Fonction appelée lorsqu'une citation est parsée.
- `onReference`: Fonction appelée lorsqu'une référence est parsée. Le deuxième argument contient la référence.

Le premier argument des Callbacks est toujours l'[élément](#l-objet-element) parsé.

```javascript
function onXXX(element) {
 // Votre code ici
 // e.g.: element.className = 'css-class'
}
```


## L'objet Element

Le parseur retourne un objet de type `Element` qui est similaire à un objet DOM Element dans le navigateur.

Les propriétés disponibles sont:
- `tagName`: Nom de la balise. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/tagName)
- `id`: Attribut id de l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/id)
- `className`: Attribut Class de l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/tagName)
- `attributes`: Attributs de l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/attributes)
- `children`: Liste des enfants. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/ParentNode/children)
- `firstChild`: Premier enfant. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Node/firstChild)
- `lastChild`: Dernier enfant. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Node/lastChild)
- `parentNode`: Parent de l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/ParentNode)
- `textContent`: Texte de l'élément et de ses descendants. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Node/textContent)
- `hasAttribute(attrName)`: Retourne si l'élément à un attribut spécifique. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/hasAttribute)
- `setAttribute(attrName, attrValue)`: Ajoute un attribut à l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/setAttribute)
- `getAttribute(attrName)`: Retourne un attribute de l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/getAttribute)
- `removeAttribute(attrName)`: Enlève un attribute de l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/removeAttribute)
- `innerHTML`: Retourne la représentation HTML des éléments contenus dans l'élément. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML)
- `outerHTML`: Retourne la représentation HTML de l'élément et de ses descendants. [MDN Docs](https://developer.mozilla.org/fr/docs/Web/API/Element/outerHTML)

De nouveaux éléments peuvent être créés en utilisant la classe `Element`:

```javascript
const parser = require('@deskeen/markdown')
const Element = parser.Element
const myDivElement = new Element('div')
```


## Résumé des syntaxes Markdown

| Type                                      | Syntaxe Markdown             |
| ----------------------------------------- | ---------------------------- |  
| [Texte en italique](#texte-en-italique)   | `*Texte en italique*`        |
| [Texte en gras](#texte-en-gras)           | `**Texte en gras**`          |
| [Texte en gras-italique](#texte-en-gras-italique)| `***Texte en gras-italique***`|
| [Texte barré](#texte-barré)               | `~~Texte barré~~`            |
| [Exposant](#exposant)                     | `^Exposant`                  |
| [Titre](#titre)                           | `# Titre`                    |
| [Lien](#lien)                             | `[Texte affiche](lien)`      |
| [Image](#image) and [Vidéo](#video)       | `![Légende](lien)`           |
| [Liste non-numérotée](#liste-non-numérotée)| `- Item de la liste`        |
| [Liste non-numérotée imbriquée](#liste-non-numérotée)| 2 espaces         |
| [Liste numérotée](#liste-numérotée)       | `+ Item de liste numérotée`  |
| [Liste numérotée imbriquée](#liste-numérotée)| 3 espaces                 |
| [Ligne horizontale](#ligne-horizontale)   | `---`                        |
| [Code](#code)                             | `` `Code` ``                 |
| [Code multilignes](#code)                 | ```` ```\nCode text\n``` ````|
| [Citation](#citation)                     | `> Citation`                 |
| [Référence](#reference)                   | `Référence[^1]`              |
| [Caractère d'échappement](#caractere-d-échappement)| `\# Titre non parsé`|


## Syntaxes Markdown

### Texte en italique

Un texte en italique est entouré d'une étoile (`*`).

*Exemple*
```
Ceci est un *texte en italique*
```

```html
<p>Ceci est un <em>texte en italique</em></p>
```


### Texte en gras

Un texte en gras est entouré de deux étoiles (`**`).

*Exemple*
```
Ceci est un **texte en gras**
```

```html
<p>Ceci est un <strong>texte en gras</strong></p>
```


### Texte en gras-italique

Un texte en gras-italique est entouré de trois étoiles (`***`).

*Exemple*
```
Ceci est un ***texte en gras-italique***
```

```html
<p>Ceci est un <strong><em>texte en gras-italique</em></strong></p>
```

### Texte barré

Un texte barré est entouré de deux caractères tilde (`~~`).

*Exemple*
```
Ceci est un ~~texte barré~~
```

```html
<p>Ceci est un <s>texte barré</s></p>
```


### Exposant

Un texte en exposant commence par un caractère circonflexe (`^`) et termine avec un espace ou un saut de ligne. Un texte en exposant qui contient des espaces peut être entouré de parenthèses.

*Exemple*
```
Ceci est un ^texte en exposant
```

```html
<p>Ceci est un <sup>texte</sup> en exposant</p>
```

*Exemple avec parenthèses*
```
Ceci est un ^(texte en exposant)
```

```html
<p>Ceci est un <sup>texte en exposant</sup></p>
```


## Paragraphe

Un seul saut de ligne ajoute le text au dernier paragraphe. Deux sauts de ligne à la suite créé un nouveau paragraphe.

*Exemple avec un seul saut de ligne*
```
Première ligne de texte
Seconde ligne de texte
```

```html
<p>Première ligne de texte<br>Seconde ligne de texte</p>
```

*Example with two newlines*
```
Première ligne de texte

Seconde ligne de texte
```

```html
<p>Première ligne de texte</p>
<p>Seconde ligne de texte</p>
```


### Titre

Un titre commence par un à six caractères dièse (`#`), suivi d'un espace.

*Exemple*
```
# Titre niveau 1
## Titre niveau 2
### Titre niveau 3
#### Titre niveau 4
##### Titre niveau 5
###### Titre niveau 6
```

```html
<h1>Titre niveau 1</h1>
<h2>Titre niveau 2</h2>
<h3>Titre niveau 3</h3>
<h4>Titre niveau 4</h4>
<h5>Titre niveau 5</h5>
<h6>Titre niveau 6</h6>
```


### Lien

Un lien est composé de deux parties. Le texte, entouré de crochets (`[]`) suivi du lien, entouré de parenthèses (`( )`). i.e. `[Link](url)`

*Exemple*
```
Ceci est un [lien](https://exemple.com)
```

```html
<p>Ceci est un <a href="https://exemple.com">lien</a></p>
```


### Image

Une image commence par un point d'exclamation (`!`) suivi de la légende de l'imagine entouré de de crochets (`[]`), suivi de l'adresse (URL) entouré de parenthèses (`( )`). i.e. `![légende](lien_de_l_image)`

Des instructions CSS peuvent être ajoutés à la suite, entourées d'accolades (`{ }`). Les instructions sont séparés par un point-virgule (`;`). Le paramètre du parseur `allowImageStyle` doit être activé pour que cela fonctionne.

Les images mises sur une ligne séparée et les images contenues dans une ligne de texte génèrent un code HTML différent.

*Exemple d'une image sur une ligne de texte*
```
Cette ![image](https://exemple.com/une_image.png) fait partie d'une ligne de texte
```

```html
<p>Cette <img src="https://exemple.com/une_image.png" alt="image"> fait partie d'une ligne de texte</p>
```

*Exemple d'une image seule sur une ligne*
```
![Image seule sur la ligne](https://exemple.com/une_image.png)
```

```html
<figure>
  <img src="https://exemple.com/some_image.png" alt="">
  <figcaption>Image seule sur la ligne</figcaption>
</figure>
```

*Exemple d'une image avec du CSS*
```
![Image with CSS](https://exemple.com/une_image.png){height: 100px; width: 100px}
```

```html
<figure style="height: 100px; width: 100px">
  <img src="https://exemple.com/une_image.png" alt="">
  <figcaption>Image with CSS</figcaption>
</figure>
```


## Vidéo

Les vidéos fonctionnent de la même manière que les images, i.e. `![légende][adresse_de_la_video]`.

*Exemple*

```
![ma légende][https://exemple.com/une_video.mp4]
```

```html
<figure>
  <video controls="">
    <source src="https://exemple.com/une_video.mp4" type="video/mp4">
  </video>
  <figcaption>ma légende</figcaption>
</figure>
```


## Liste non numérotée

Les éléments d'une liste non numérotée commencent avec un tiret (`-`) suivi par un espace.

Des sauts de lignes peuvent être insérées à l'intérieur d'un élément de la liste en commençant la ligne avec deux espaces.

Une liste peut être imbriquée dans une autre liste en commençant avec au moins deux espaces, suivi d'un tiret, et d'un autre espace. Seulement une liste de même type peut être imbriquée.

*Exemple*
```
- Item 1
- Item 2
- Item 3
```

```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

*Exemple avec un saut de ligne à l'intérieur d'un élément*
```
1. Item 1
   Suite Item 1
2. Item 2
```

```html
<ol>
  <li>Item 1<br>Suite Item 1</li>
  <li>Item 2</li>
</ol>
```

*Exemple avec une liste imbriquée*
```
- Item 1
  - Item 1.1
  - Item 1.2
- Item 2
```

```html
<ul>
  <li>
    Item 1
    <ul>
      <li>Item 1.1</li>
      <li>Item 1.2</li>
    </ul>
  </li>
  <li>Item 2</li>
</ul>
```


## Liste numérotée

Les éléments d'une liste numérotée commencent avec un nombre suivi par un point (`.`) et un espace.

Des sauts de lignes peuvent être insérées à l'intérieur d'un élément de la liste en commençant la ligne avec trois espaces.

Une liste peut être imbriquée dans une autre liste en commençant avec au moins trois espaces, suivi d'un nombre, et d'un espace. Seulement une liste de même type peut être imbriquée.

*Exemple*
```
1. Item 1
2. Item 2
3. Item 3
```

```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```

*Exemple avec un saut de ligne à l'intérieur d'un élément*
```
1. Item 1
   Suite Item 1
2. Item 2
```

```html
<ol>
  <li>Item 1<br>Suite Item 1</li>
  <li>Item 2</li>
</ol>
```

Les nombres des éléments des listes numérotées ne sont pas pris en compte. La liste est exportée de la même façon si les nombres se suivent ou pas.

*Exemple avec des nombres qui ne se suivent pas*
```
5. Item 1
1. Item 2
8. Item 3
3. Item 4
```

```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
  <li>Item 4</li>
</ol>
```


*Exemple avec une liste imbriquée*
```
1. Item 1
   1. Item 1.1
   2. Item 1.2
2. Item 2
```

```html
<ol>
  <li>
    Item 1
    <ol>
      <li>Item 1.1</li>
      <li>Item 1.2</li>
    </ol>
  </li>
  <li>Item 2</li>
</ol>
```


## Ligne horizontale

Une ligne horizontale débute avec une ligne vide, suivi de trois tirets (`---`), suivi d'une autre ligne vide.

*Exemple*
```
Au dessus de la ligne horizontale

---

En dessous de la ligne horizontale
```

```html
<p>Au dessus de la ligne horizontale</p>
<hr>
<p>En dessous de la ligne horizontale</p>
```


## Code

Le code est entouré du accent aigu (`\``).

*Exemple*
```
Ceci est du `code technique`
```

```html
<p>Ceci est du <code>code technique</code></p>
```


## Code multi lignes

Du code multi lignes est entouré par trois accents aigus (`\``), mis sur des lignes séparées.

Le langage du code peut être ajouté à côté des trois accents aigus d'ouverture. Il n'est pas affiché dans le code HTML de sorti mais il est passé en deuxième argument du Callback `onMultilineCode`. Voir l'exemple plus bas. 

*Exemple*
```
\`\`\`
Du code ligne 1
Du code ligne 2
Du code ligne 3
\`\`\`
```

```html
<pre><code>Du code ligne 1
Du code ligne 2
Du code ligne 3</code></pre>
```

*Exemple avec un nom de language*
```
\`\`\`javascript
console.log('Hello World!')
\`\`\`
```

```html
<pre><code>console.log('Hello World!')</code></pre>
```


## Citation

Une citation débute avec un signe supérieur (`>`).

*Exemple*
```
> Citation ligne 1
> Citation ligne 2
> Citation ligne 3
```

```html
<blockquote>
  <p>
    Citation ligne 1
    <br>
    Citation ligne 2
    <br>
    Citation ligne 3
  </p>
</blockquote>
```

## référence

Une référence est composée de: Un crochet ouvrant (`[`), un accent circonflexe (`^`), un numéro de référence, et un crochet fermant (`]`). e.g. `[^1]`

*Exemple*
```
Ma première référence[^1].
Ma seconde[^2].
```

```html
<p>Ma première référence<a href="#reference1"><sup>1</sup></a>.</p>
<p>Ma seconde<a href="#reference2"><sup>2</sup></a>.</p>
```

## Caractère d'échappement

Le caractère d'échappement est le caractères antislash (`\`).

Il peut être utilisé pour indiquer au parseur de ne pas interpréter les caractères utilisés dans les syntaxes Markdown, i.e. `*`, `[`, `` ` ``, `!`, `#`, `~`, `^` et `\`.

*Exemple*
```
Ce \*texte en gras\* n'est pas converti en HTML.
```

```html
<p>Ce *texte en gras* n'est pas converti en HTML.</p>
```

*Exemple 2*
```
Cet antislash \ n'est pas enlevé car il n'est pas suivi d'un caractère spécial.
```

```html
<p>Cet antislash \ n'est pas enlevé car il n'est pas suivi d'un caractère spécial.</p>
```


### Compatibilité avec d'autres Markdown populaires

Une marque (☑) signifie que la syntaxe devrait fonctionner sur la plateforme.

| Type         | Syntaxe   |   GitHub  |   Reddit   |  GitLab  |
| ------------ |:----------|:----------|:-----------|:---------|
| Italique     | `*`       | ☑         | ☑         | ☑       |
| Gras         | `**`      | ☑         | ☑         | ☑       |
| Gras-italique| `***`     | ☑         | ☑         | ☑       |   
| Barré        | `~~`      | ☑         | ☑         | ☑       |
| Saut de ligne| `\n`      | ☑         | ☑         | ☑       |
| Paragraphe   | `\n\n`    | ☑         | ☑         | ☑       |
| Titre        | `#`       | ☑         | ☑         | ☑       |
| Lien         | `[]()`    | ☑         | ☑         | ☑       |
| Image        | `![]()`   | ☑         | ☑         | ☑       |
| Liste        | `-`       | ☑         | ☑         | ☑       |
| Liste imb.   | 2 espaces | ☑         | ☑         | ☑       |
| List \\n     | 2 spaces  | ☑         | ☑         | ☑       |
| Liste num.   | `1.`      | ☑         | ☑         | ☑       |
| Liste num. imb.|3 espaces| ☑         | ☑         | ☑       |
| List num. \\n| 3 spaces  | ☑         | ☑         | ☑       |
| Ligne Horiz. | `\n---\n` | ☑         | ☑         | ☑       |
| Code         | `` ` ``   | ☑         | ☑         | ☑       |
| Multi. Code|```` ``` ````| ☑         | ☑         | ☑       |
| Citation     | `>`       | ☑         | ☑         | ☑       |
| Echappement  | `\`       | ☑         | ☑         | ☑       |
| Exposant     | `^`       | ⚠ `<sup>` | ☑        | ⚠ `<sup>`|
| Indice       | N/A       | ⚠ `<sub>` | N/A      | ⚠ `<sub>`|
| Référence    | `[^1]`    | ⚠ N/A     | ⚠ N/A    | ⚠ Diff.  |
| HTML         | N/A       | ⚠ Avail.  | N/A      | ⚠ Avail. |

Source: [GitHub Markdown](https://guides.github.com/features/mastering-markdown/), [Reddit Markdown](https://www.reddit.com/wiki/markdown), [GitLab Markdown](https://docs.gitlab.com/ee/user/markdown.html)


## Syntaxes incompatibles

Les syntaxes suivantes ne sont **PAS** supportées:

- Les textes en italiques et en gras avec un, deux et trois underscores.
- Les titres avec des tirets ou des signes égal en dessous.
- Les listes non-numérotées avec un signe plus ou une étoile.
- Plus d'une liste imbriquée.
- Les lignes horizontales avec des étoiles ou des underscores.
- Les titres d'images et les titres de liens.
- Les liens entre inférieur et supérieur.
- Le code HTML.


## Exemples

### Ajouter un identifiant aux titres

```javascript
parseMarkdown('# Title 1', {
  onHeader: element => {
    // node.textContent === 'Title 1'

    element.id = element.textContent.replace(/ /g, '-').toLowerCase()
  }
}).innerHTML
```

```html
<h1 id="title-1">Title 1</h1>
```


### Ouvrir les liens externes dans un nouvel onglet

```javascript
parseMarkdown('See [this page](https:/example.com)!', {
  onLink: element => {
    // element.getAttribute('href') === 'http:/example.com'
    const href = element.getAttribute('href')

    if (href.startsWith('https://MY_SITE.com') === false) {
      element.setAttribute('target', '_blank')
    }
  }
}).innerHTML
```

```html
<p>See <a href="https:/example.com" target="_blank">this page</a>!</p>
```

### Ajouter un préfixe aux liens relatifs des images

```javascript
parseMarkdown('![Beautiful image](beautiful_image.png)', {
  onImage: element => {
    // element.getAttribute('src') === 'beautiful_image.png'

    if (element.hasAttribute('src')) {
      const src = element.getAttribute('src')

      if (src.startsWith('http') === false) {
        element.setAttribute('src', 'https://example.com/' + src)
      }
    }
  }
}).innerHTML
```

```html
<figure>
  <img src="https://example.com/beautiful_image.png" alt="" />
  <figcaption>Beautiful image</figcaption>
</figure>
```

### Ajouter une classe CSS au code

```javascript
parseMarkdown('This is body html tag: `<body>`', {
  onCode: element => {
    element.className = 'some-class'
  }
}).innerHTML
```

```html
<p>This is body html tag: <code class="some-class"><body></code></p>
```


### Afficher joliment les objets JSON

```javascript
const markdownText = '```json\n{"some_property":"foo","some_other_property":"bar"}\n```'

parseMarkdown(markdownText, {
  onMultilineCode: (element, language) => {
    if (language === 'json') {
      // element is a <pre> tag that includes the <code> tag
      const codeElement = element.firstChild
      const codeText = codeElement.textContent
      const jsonObject = JSON.parse(codeText)

      codeElement.textContent = JSON.stringify(jsonObject, null, 2)
    }
  }
}).innerHTML
```

```html
<pre><code>{
  "some_property": "foo",
  "some_other_property": "bar"
}</code></pre>
```


## Autres ressources

- Original Markdown: https://daringfireball.net/projects/markdown/
- CommonMark: https://commonmark.org/


## FAQ

### Que faire si j'ai un problème?

Vous pouvez [reporter un problème](https://github.com/deskeen/markdown/issues/new) et demander de l'aide.


### Que puis-je faire pour aider?

Vous pouvez:
- Jeter un coup d'oeil aux problèmes et voir si vous pouvez aider quelqu'un.
- Jeter un coup d'oeil au code et voir si vous pouvez l'améliorer.
- Traduire cette page dans votre langue.
- Mettre une étoile à ce dépôt.


## Contact

Vous pouvez me contacter à l'adresse {mon_prenom}@{mon_nom}.fr


## Licence

Licence MIT - Copyright (c) Morgan Schmiedt