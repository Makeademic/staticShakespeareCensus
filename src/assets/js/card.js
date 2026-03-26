function oxfordJoin(coll) {
    return coll.length < 2 ? coll.join(", ") : coll.slice(0, -1).join(", ") + ", and " + coll[coll.length-1];
}

async function getSVG(fieldName, fieldValue) {
   return fetch("{{ '/assets/svg/' | url }}" + fieldName + "/" + fieldValue + ".svg").then(res => res.ok ? res.text() : "");
}

function card(post, postUrl) {
  const fragmentStatus = post.isFragment ? "Fragment" : "Non-Fragment"
  const titleHover = post.title.toLowerCase();
  return `
  <div class="postcard">
      <div class="rounded shadow-lg h-full bg-gray-50 hover:shadow-xl">
          <a href="${post.url}">
          <img
          class="w-full m-0 rounded-t lazy max-h-72 object-cover object-top card-thumbnail"
          src="${post.image}"
          width="500"
          height="500"
          alt=" ${post.title} ${post.NSC}">
          </a>
          <div class="px-6 py-5">
              <div class="font-semibold text-lg mb-2">
                  <a class="text-gray-900 hover:text-gray-700" ${titleHover} href="${post.url}">${post.NSC} | ${post.title}</a>
              </div>
              <div class="my-5 flex flex-wrap justify-between">
                  <p id="location-table-cell-${post.fileSlug}" class="text-gray-700 mb-1 max-w-2/5"><strong>Location:</strong> ${post.location}</p>
                  <p id="year-table-cell-${post.fileSlug}" class="text-gray-700 mb-1 max-w-3/5 break-words text-right"><strong>Year:</strong> ${post.year.join(", ") || "N/A"}</p>
                  <div class="flexitems-break"></div>
                  <a href="${post.STC_Wing_URL}"><p id="STC-table-cell-${post.fileSlug}" class="text-gray-700 mb-1 max-w-2/5"><strong>STC / Wing:</strong> ${post.STC_Wing}</p>
                  <p id="fragment-table-cell-${post.fileSlug}" class="text-gray-700 mb-1 max-w-3/5 break-words text-right"><strong>Fragment:</strong> ${post.fragment}</p>
              </div>
              <a href="${post.data.Digital_Facsimile_URL}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" aria-hidden="true">
                                  <!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                                    <path d="M48 32C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H48zm0 32h106c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H38c-3.3 0-6-2.7-6-6V80c0-8.8 7.2-16 16-16zm426 96H38c-3.3 0-6-2.7-6-6v-36c0-3.3 2.7-6 6-6h138l30.2-45.3c1.1-1.7 3-2.7 5-2.7H464c8.8 0 16 7.2 16 16v74c0 3.3-2.7 6-6 6zM256 424c-66.2 0-120-53.8-120-120s53.8-120 120-120 120 53.8 120 120-53.8 120-120 120zm0-208c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm-48 104c-8.8 0-16-7.2-16-16 0-35.3 28.7-64 64-64 8.8 0 16 7.2 16 16s-7.2 16-16 16c-17.6 0-32 14.4-32 32 0 8.8-7.2 16-16 16z"></path>
                                </svg>
                        </a>
          </div>
      </div>
  </div>
  `;
}
