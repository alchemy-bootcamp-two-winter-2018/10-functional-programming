'use strict';
// What do you need (import or require) from prior modules?
(function (module) {

    // TODONE: Wrap the contents of this file, except for the preceding 'use strict' declararion, in an IIFE.
    // Give the IIFE a parameter called 'module'.
    // At the very end of the code, but still inside the IIFE, attach the 'Article' object to 'module'.
    // Where the IIFE is invoked, pass in the global 'app' object via `(window.app || window.app = {})`.
    function Article(rawDataObj) {
    
        Object.keys(rawDataObj).forEach(key => this[key] = rawDataObj[key]);
        
        // derived data
        this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);
        this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
        this.body = marked(this.body);
        
        // compile template
        this.template = Handlebars.compile($('#article-template').text());
    }
    
    Article.all = [];
    
    Article.prototype.toHtml = function() {
        return this.template(this);
    };
    
    Article.loadAll = rawData => {
        rawData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));
        
        // TODONE: Refactor this .forEach() code, by using a .map() call instead, 
        // since what we are trying to accomplish is the transformation of one collection 
        // into another. Remember that we can set variables equal to the result of functions. 
        // So if we set a variable equal to the result of a .map(), it will be our transformed array.
        // There is **no** need to push to anything!
        Article.all = rawData.map(articleObject => new Article(articleObject));
    };
    
    Article.fetchAll = callback => {
        $.get('/articles')
            .then(results => {
                Article.loadAll(results);
                console.log(results);
                callback();
            });
    };
    
    // TODO: Chain together a .map() and a .reduce() call to get a rough count of all words in all articles. 
    // Yes, you have to do it this way.
    
    Article.numWordsAll = () => {
        return Article.all
            .map(a => a.body.match(/[\w\d]+/gi).length)
            .reduce((acc, num) => acc + num);

    };
    // TODO: Chain together a .map() and a .reduce() call to produce an array of unique author names. 
    // You will probably need to use the optional accumulator argument in your reduce call.
    Article.allAuthors = () => {
        return Array.from(
            new Set(Article.all.map((a) => a.author))
        );
    };

    Article.numWordsByAuthor = () => {
        return Article.allAuthors().map(author => {
            return {
                name: author,
                wordCount:Article.all
                    .filter(article => article.author === author)
                    .map(a => a.body.match(/[\w\d]+/gi).length)
                    .reduce((acc, num) => acc + num),
            };
            // TODO: Transform each author string into an object with properties for:
            //    1. the author's name, 
            //    2. the total number of words across all articles written by the specified author.
            
            // HINT: This .map() should be set up to return an object literal with two properties.
            // Inside the map, the first property should be pretty straightforward, but you will 
            // need to chain some combination of .filter(), .map(), and .reduce() to get the value 
            // for the second property!
            
        });
    };
    
    Article.truncateTable = callback => {
        $.ajax({
            url: '/articles',
            method: 'DELETE',
        })
        // REVIEW: Check out this clean syntax for just passing our callback function
        // as the promise result handler!
        // The reason we can do this has to do with the way Promise.prototype.then() works. 
        // It's a little outside the scope of 301 material, but feel free to research!
            .then(callback);
    };
    
    Article.prototype.insertRecord = function(callback) {
        // REVIEW: Why can't we use an arrow function here for .insertRecord()?
        $.post('/articles', {author: this.author, authorUrl: this.authorUrl, body: this.body, category: this.category, publishedOn: this.publishedOn, title: this.title})
            .then(callback);
    };
    
    Article.prototype.deleteRecord = function(callback) {
        $.ajax({
            url: `/articles/${this.article_id}`,
            method: 'DELETE'
        })
            .then(callback);
    };
    
    Article.prototype.updateRecord = function(callback) {
        $.ajax({
            url: `/articles/${this.article_id}`,
            method: 'PUT',
            data: {
                author: this.author,
                authorUrl: this.authorUrl,
                body: this.body,
                category: this.category,
                publishedOn: this.publishedOn,
                title: this.title,
                author_id: this.author_id
            }
        })
            .then(callback);
    };
    
    module.Article = Article;
    
})(window.app || (window.app = {}));
