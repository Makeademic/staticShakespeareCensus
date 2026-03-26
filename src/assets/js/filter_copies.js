async function getCopiesJSON() {
    return fetch("{{ '/copies_metadata.json' | url }}").then(res => res.json());
}

function isCopyConforming(query, copyData) {
  for (const [queryKey, value] of query) {
    if (queryKey.endsWith("Count")) {
      let lowerbound, upperbound;
      [lowerbound, upperbound] = value.split("-").map(Number);
      if (upperbound === undefined && !isNaN(lowerbound)) {
        // `value` does not contain a "-" and is thus a
        // single number as opposed to a range.
        upperbound = lowerbound;
      }
      const countValue = Number(copyData[queryKey]);
      if (!(lowerbound <= countValue && countValue <= upperbound)) {
        return false;
      }
    } else if (copyData[queryKey] instanceof Array) {
        const selectedValues = value.split(",");
        if (!selectedValues.some(x => new Set(copyData[queryKey]).has(x))) {
            return false;
        }

    } else if (queryKey === "search") {
        // copyData["summary"] might be null so that's why we use
        // AND's short-circuit evaluation to check for null before accessing
        // the toLowerCase property. It might also be an array of strings instead.
        let isConformingToTypedSearch = (word) => ["title", "author", "summary"]
            .map(fieldN => copyData[fieldN] && String(copyData[fieldN]).toLowerCase().indexOf(word.toLowerCase()) !== -1)
            .some(Boolean);
        if (!value.split(" ").every(isConformingToTypedSearch)) {
            return false;
        }
    // In case the copy data value is a boolean, `value` must be deserialized into a boolean, as done after the &&
    } else if (copyData[queryKey] !== value && copyData[queryKey] !== (value === "true")) {
      return false;
    }
  }
  return true;
}

async function getFilteredCopies() {
    const searchParams = new URLSearchParams(location.search);
    return getCopiesJSON().then(copiesJSON => copiesJSON.filter(copy => isCopyConforming(searchParams, copy)));
}

async function populatePostGrid(filteredCopies) {
    const postGrid = $("post-grid");
    postGrid.innerHTML = "";
    const postsPerPage = {{ site.paginate }};
    const pageNo = Number((location.pathname.match(/page\/([0-9]+)/) || ["page/1", "1"])[1]);
    const offset = (pageNo - 1) * postsPerPage;
    const slicedCopies = filteredCopies.slice(offset, offset+postsPerPage);
    // Warning: The function syncPaginationButtons relies on the innerText of the "showing-n-results" doc element.
    // If you change the value of innerText, make sure to reflect that "API" change in syncPaginationButtons too!
    if (filteredCopies.length === 0) {
        $("showing-n-results").innerText = "No results found.";
    } else if (offset < filteredCopies.length) {
      $("showing-n-results").innerText = `Showing ${offset + 1} to ${Math.min(offset + postsPerPage, filteredCopies.length)} of ${filteredCopies.length} results found.`;
    } else {
      $("showing-n-results").innerText = `Showing 0 to 0 of ${filteredCopies.length} results found.`;
      const amountOfPages = Math.ceil(filteredCopies.length/postsPerPage);
      if (amountOfPages === 1) {
          $("showing-n-results").innerText += ` There is only 1 page for this search, not ${pageNo}.`;
      } else {
          $("showing-n-results").innerText += ` There are only ${amountOfPages} pages for this search, not ${pageNo}.`;
      }
    }
    syncPaginationButtons();
    for (const post of slicedCopies) {
      postGrid.innerHTML += card(post, post.url);
    }
}

const pageRegExp = new RegExp("{{ '/page/' | url }}[0-9]+");
if (location.pathname === "{{'/' | url }}" || pageRegExp.test(location.pathname)) {
    getFilteredCopies().then(filteredCopies => populatePostGrid(filteredCopies));
}
