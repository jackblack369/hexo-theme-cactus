/**
 * Sticky Sort Helper
 * @description Sort a collection of posts so that "sticky" posts are pinned to
 *   the top. A post becomes sticky by adding a `sticky` field to its
 *   front-matter. The value is used as the weight: higher numbers appear first
 *   (e.g. `sticky: 100` outranks `sticky: 10`). Non-sticky posts keep their
 *   normal ordering and follow the sticky ones.
 * @example
 *     <% var posts = sticky_sort(site.posts, 'date', 'desc') %>
 *     <% posts.forEach(function(post){ ... }) %>
 */
hexo.extend.helper.register("sticky_sort", function (posts, field, order) {
  field = field || "date";
  order = order || "desc";

  // Normalize whatever was passed (Warehouse Query or Array) into an array.
  var list = typeof posts.toArray === "function" ? posts.toArray() : posts.slice();

  var weight = function (post) {
    var value = Number(post.sticky);
    return isNaN(value) ? 0 : value;
  };

  var compareField = function (a, b) {
    var av = a[field];
    var bv = b[field];
    if (av < bv) return order === "asc" ? -1 : 1;
    if (av > bv) return order === "asc" ? 1 : -1;
    return 0;
  };

  return list.sort(function (a, b) {
    var diff = weight(b) - weight(a);
    if (diff !== 0) return diff;
    return compareField(a, b);
  });
});
