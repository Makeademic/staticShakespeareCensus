

module.exports = (config) => {
  

  config.setDataDeepMerge(true);

  config.addPassthroughCopy('src/assets/img/**/*');
  config.addPassthroughCopy({ 'src/posts/img/**/*': 'assets/img/' });

  config.addPassthroughCopy('src/assets/svg/');

  config.addWatchTarget("src/assets/js/");

  config.addLayoutAlias('default', 'layouts/default.njk');
  config.addLayoutAlias('post', 'layouts/post.njk');

  config.addFilter('readableDate', require('./lib/filters/readableDate'));
  //config.addFilter('minifyJs', require('./lib/filters/minifyJs'));

  //config.addTransform('minifyHtml', require('./lib/transforms/minifyHTML'));

  config.addCollection('posts', require('./lib/collections/posts'));
  config.addCollection('tagList', require('./lib/collections/tagList'));
  config.addCollection('pagedPosts', require('./lib/collections/pagedPosts'));
  config.addCollection('pagedPostsByTag', require('./lib/collections/pagedPostsByTag'));

  // The difference between `uniq` and `unique` is that the former assumes the input collection
  // is already sorted, which lets it drop the duplicates in a more efficient way.
  config.addNunjucksFilter("uniq", sortedColl => sortedColl.filter(function(item, pos, ar) {
        if (pos === 0) { return true; }
        return item != ar[pos - 1];
      }));
  config.addNunjucksFilter("unique", coll => [...new Set(coll)]);
  config.addNunjucksFilter("flatten", coll => coll.flat());
  config.addNunjucksFilter("mapToDbField", (coll, dbField) => coll.map(x => x.data[dbField]));
  config.addNunjucksFilter("oxfordJoin", coll => coll.length < 2 ? coll.join(", ") : coll.slice(0, -1).join(", ") + ", and " + coll[coll.length-1]);
  config.addNunjucksFilter("isArray", coll => Array.isArray(coll));

  config.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  config.setQuietMode(true);

  // Serve GitHub Pages site from a custom domain
  //config.addPassthroughCopy("CNAME");

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    pathPrefix: "/",
    templateFormats: ['md', 'njk', 'html'],
    dataTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};