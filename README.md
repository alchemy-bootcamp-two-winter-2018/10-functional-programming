Lab 10: Functional Programming
===

## Content
1. Submission Instructions
1. Resources
1. Configuration
1. User Stories and Feature Tasks

----

## Submission Instructions
Follow the submission instructions outlined in our [submit-process repo](https://github.com/alchemy-bootcamp-two-winter-2018/submit-process).

## Resources  

[MDN: map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

[MDN: filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

[MDN: reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

## Configuration
_Your repository must include:_

```
10-functional-programming
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── README.md
├── node_modules
├── package-lock.json
├── package.json
├── public
│   ├── data
│   │   └── hackerIpsum.json
│   ├── admin.html
│   ├── index.html
│   ├── new.html
│   ├── scripts
│   │   ├── article.js
│   │   └── articleView.js
│   ├── styles
│   │   ├── base.css
│   │   ├── fonts
│   │   │   ├── icomoon.eot
│   │   │   ├── icomoon.svg
│   │   │   ├── icomoon.ttf
│   │   │   └── icomoon.woff
│   │   ├── icons.css
│   │   ├── layout.css
│   │   └── modules.css
│   └── vendor
│       └── styles
│           ├── default.css
│           ├── normalize.css
│           └── railscasts.css
└── server.js
```

## User Stories and Feature Tasks

*As a user, I want an admin page so I can easily view the stats of my blog app.*

- For both index.html and admin.html, we'll want access to the `Article.all` data... but we'll have different view functions to set up for each of those pages. Complete the `Article.fetchAll()` method so that it calls a `next` parameter: a function to invoke when its work is done.  

*As a developer, I want to utilize IIFEs so that all of my function calls are executed on page load.*

- Let's make sure each one of our scripts are properly enclosed. Wrap the contents of article.js and articleView.js in an IIFE, like we did in class. Then pass in the new "app" object as an argument to the IIFEs and be sure to remember to export the `Article` and `articleView` objects. Keep in mind that this will change how we refer to those two objects throughout the app.
- Ensure both the index page and the admin page call `Article.fetchAll()` in a way that properly triggers the appropriate page setup methods.

*As a developer, I want to utilize functional programming so that my code makes sense and follows modern practices.*

-  Use the array methods `.filter()`, `.map()`, `.reduce()`, and `.forEach()` to transform the data into what you need it to be. Chain these methods together as needed.

### Stretch Goal

*As a user, I want additional stats so that I can track the progress of my app.*

- What additional statistical analysis would be of interest to you with this data set? Code it up!