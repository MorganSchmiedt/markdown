# Parseur Markdown vers HTML pour Node.js 
<a href="README.md"><img src="./img/gb.svg" height="16px"></a>
<a href="README.fr.md"><img src="./img/fr.svg" height="16px"></a>

Ce parseur est compatible avec: les textes en italique, textes en gras et textes barrés, les exposants, les liens, les titres et sous-titres, les images et vidéos, du code mono ou multi lignes, les listes numérotées et non-numérotées, les lignes horizontales, les citations et les notes de bas de page.


## Utilisation

```javascript
const parser = require('@deskeen/markdown')
const html = parser.parse('mon texte markdown').toHtml()

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
  - [Texte en gras-italique](#bold-italic-text)
  - [Texte barré](#texte-barre)
  - [Exposant](#exposant)
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
  - [Pied de page](#pied-de-page)
  - [Caractère d'échappement](#escape-character)
- [Exemples](#exemples)
  - [Ajouter un identifiant aux titres](#ajouter-un-identifiant-aux-titres)
  - [Ouvrir les liens externes dans un nouvel onglet](#ouvrir-les-liens-externes-dans-un-nouvel-onglet)
  - [Ajouter un préfixe aux liens relatifs des images](#ajouter-un-préfixe-aux-liens-relatifs-des-images)
  - [Ajouter une classe CSS au code](#ajouter-une-classe-CSS-au-code)
  - [Afficher joliment les objets JSON](#afficher-joliment-les-objets-json)


## Installation

Ce paquet peut être ajouté à la liste des dépendances de votre projet [Node.js](https://nodejs.org/en/) en exécutant la commande:

```
npm install @deskeen/markdown`
```

Pour importer le parseur à votre coe JavaScript: 

```javascript
const parseur = require('@deskeen/markdown')
```

Pour parser du texte et le transformer en code HTML, utilisez:

```javascript
const codeHtml = parseur.parse('du texte markdown').toHtml()
```

Le parseur a été testé avec les versions 10+ de Node.js mais il se peut qu'il fonctionne aussi sur des versions précédentes.


## Options du parseur

`parse(markdownText[, options]).toHtml()`

Un objet avec les options peut être passé au parseur.

Les options disponibles sont:
- `allowHeader`: Si les titres headers sont autorisés. `true` par défaut.
- `allowLink`: Si les liens sont autorisés. `true` par défaut.
- `allowImage`: Si les images sont autorisées. `true` par défaut.
- `allowImageStyle`: Si du style peut être appliqué aux images. `false` par défaut.
- `allowCode`: Si du code est autorisé. `true` par défaut.
- `allowMultilineCode`: Si du code multi lignes est autorisé. `true` par défaut.
- `allowUnorderedList`: Si les listes non-numérotées sont autorisées. `true` par défaut.
- `allowOrderedList`: Si les listes numérotées sont autorisées. `true` par défaut.
- `allowHorizontalLine`: Si les lignes horizontales sont autorisées. `true` par défaut.
- `allowQuote`: Si les citations sont autorisées. `true` par défaut.
- `allowFootnote`: Si les pieds de page sont autorisés. `true` par défaut.
- `brOnBlankLine`: Si une balise `<br />` est ajouté lorsqu'il y a une ligne vide. `false` par défaut.
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
- `onFootnote`: Fonction appelée lorsqu'un pied de page est parsé.

Le premier argument des Callbacks est toujours l'[élément](#l-objet-element) parsé.

```javascript
function onXXX(element) {
 // Votre code ici
 // e.g.: element.attr.class = ...
}
```


## L'objet Element

Le parseur retourne un objet de type `Element`.

Ses propriétés sont:
- `tagName`: Nom de la balise. *Chaîne de caractères*
- `attr`: Attributes de la balise. *Objet*
- `children`: Liste of enfants. *Tableau*
- `firstChild`: Premier enfant. Peut être null. *Element*
- `lastChild`: Dernier enfant. Peut être null. *Element*
- `textContent`: Texte de l'élément. *Chaîne de caractères*
- `toHtml()`: Retourne le code HTML de sortie. *Chaîne de caractères* 


## Résumé des syntaxes Markdown

| Type                                      | Syntaxe Markdown             |
| ----------------------------------------- | ---------------------------- |  
| [Texte en italique](#texte-en-italique)   | `*Texte en italique*`        |
| [Texte en gras](#texte-en-gras)           | `**Texte en gras**`          |
| [Texte en gras-italique](#texte-en-gras-italique)| `***Texte en gras-italique***`|
| [Texte barré](#texte-barré)               | `~~Texte barré~~`            |
| [Exposant](#exposant)                     | `^Exposant^`                 |
| [Titre](#titre)                           | `# Titre`                    |
| [Lien](#lien)                             | `[Texte affiche](lien)`      |
| [Image](#image) and [Vidéo](#video)       | `![Légende](lien)`           |
| [Liste non-numérotée](#liste-non-numérotée)| `- Item de la liste`        |
| [Liste numérotée](#liste-numérotée)       | `+ Item de liste numérotée`  |
| [Ligne horizontale](#ligne-horizontale)   | `---`                        |
| [Code](#code)                             | `` `Code` ``                 |
| [Citation](#citation)                     | `> Citation`                 |
| [Pied de page](#pied-de-page)             | `Voir la note[^1]`           |
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

Un texte en exposant est entouré par un caractère circonflexe (`^`).

*Exemple*
```
Ceci est un ^texte en exposant^
```

```html
<p>Ceci est un <sup>texte en exposant</sup></p>
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
<p>Cette <img src="https://exemple.com/une_image.png" alt="image" /> fait partie d'une ligne de texte</p>
```

*Exemple d'une image seule sur une ligne*
```
![Image seule sur la ligne](https://exemple.com/une_image.png)
```

```html
<figure>
  <img src="https://exemple.com/some_image.png" alt="" />
  <figcaption>Image seule sur la ligne</figcaption>
</figure>
```

*Exemple d'une image avec du CSS*
```
![Image with CSS](https://exemple.com/une_image.png){height: 100px; width: 100px}
```

```html
<figure style="height: 100px; width: 100px">
  <img src="https://exemple.com/une_image.png" alt="" />
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
  <video>
    <source src="https://exemple.com/une_video.mp4" type="video/mp4" />
  </video>
  <figcaption>ma légende</figcaption>
</figure>
```


## Liste non numérotée

Les éléments d'une liste non numérotée commencent avec un tiret (`-`) suivi par un espace.

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


## Liste numérotée

Les éléments d'une liste numérotée commencent avec un signe plus (`+`) suivi par un espace.

*Exemple*
```
+ Item 1
+ Item 2
+ Item 3
```

```html
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
```


## Ligne horizontale

Une ligne horizontale est affiché avec trois tirets (`---`).

*Exemple*
```
Au dessus de la ligne horizontale
---
En dessous de la ligne horizontale
```

```html
<p>Au dessus de la ligne horizontale</p>
<hr />
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
  <p>Citation ligne 1</p>
  <p>Citation ligne 2</p>
  <p>Citation ligne 3</p>
</blockquote>
```

## Pied de page

Un pied de page est composé de: Un crochet ouvrant (`[`), un accent circonflexe (`^`), un numéro de pied de page, et un crochet fermant (`]`). e.g. `[^1]`

*Exemple*
```
Mon premier pied de page[^1].
Mon second one[^2].
```

```html
<p>Mon premier pied de page<a href="#footnote1"><sup>1</sup></a>.</p>
<p>Mon second one<a href="#footnote2"><sup>2</sup></a>.</p>
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


## Exemples

### Ajouter un identifiant aux titres

```javascript
parseMarkdown('# Titre 1', {
  onHeader: element => {
    // node.attr === { }
    // node.firstChild === 'Titre 1'
    element.attr.id = element.firstChild.replace(/ /g, '-').toLowerCase()
  }
}).toHtml()
```

```html
<h1 id="titre-1">Titre 1</h1>
```


### Ouvrir les liens externes dans un nouvel onglet

```javascript
parseMarkdown('Voir [cette page](https:/exemple.com)!', {
  onLink: element => {
    // element.attr.href === 'http:/exemple.com'

    if (element.attr.href.startsWith('https://MY_SITE.com') === false) {
      element.attr.target = '_blank'
    }
  }
}).toHtml()
```

```html
<p>Voir <a href="https:/exemple.com" target="_blank">cette page</a>!</p>
```

### Ajouter un préfixe aux liens relatifs des images

```javascript
parseMarkdown('![Belle image](belle_image.png)', {
  onImage: element => {
    // element.attr.src === 'belle_image.png'

    if (element.attr.src != null
    && element.attr.src.startsWith('http') === false) {
      element.attr.src = 'https://exemple.com/' + element.attr.src
    }
  }
}).toHtml()
```

```html
<figure>
  <img src="https://exemple.com/belle_image.png" alt="" />
  <figcaption>Belle image</figcaption>
</figure>
```

### Ajouter une classe CSS au code

```javascript
parseMarkdown('Ceci est une balise body en HTML: `<body>`', {
  onCode: element => {
    element.attr.class = 'ma-class'
  }
}).toHtml()
```

```html
<p>Ceci est une balise body en HTML: <code class="ma-class"><body></code></p>
```


### Afficher joliment les objets JSON

```javascript
const markdownText = '```json\n{"une_propriete":"valeur1","une_autre_propriete":"valeur2"}\n```'

parseMarkdown(markdownText, {
  onMultilineCode: (element, language) => {
    if (language === 'json') {
      // l'élément est une balise <pre> qui contient une balise <code>
      const codeElement = element.firstChild
      const codeTexte = codeElement.textContent
      const jsonObjet = JSON.parse(codeTexte)

      codeElement.textContent = JSON.stringify(jsonObjet, null, 2)
    }
  }
}).toHtml()
```

```html
<pre><code>{
  "une_propriete": "valeur1",
  "une_autre_propriete": "valeur2"
}</code></pre>
```