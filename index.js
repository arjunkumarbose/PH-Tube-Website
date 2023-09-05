let selectedCategoryId = 1000; // Default selected category ID

const loadAllCategory = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/videos/categories"
  );
  const data = await response.json();
  const tabContainer = document.getElementById("tab-container");
  const sliceData = data.data.slice(0, 4);

  sliceData.forEach((category) => {
    const div = document.createElement("div");
    div.innerHTML = `<h5 data-category-id="${category.category_id}" onclick="loadVideosByCategoryId(${category.category_id})" class="tab btn rounded-md bg-[#25252526]">${category.category}</h5>`;
    tabContainer.appendChild(div);
  });
};

const loadVideosByCategoryId = async (id) => {
  handleLoader("block");
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  document.getElementById("not-found-container").style.display = "none";

  selectedCategoryId = id;

  const response = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  const data = await response.json();

  handleLoader("none");

  if (data.data.length > 0) {
    data.data.forEach((video) => {
      const div = document.createElement("div");

      // Time difference
      const postedDateInSeconds = video.others.posted_date;
      const hours = Math.floor(postedDateInSeconds / 3600);
      const minutes = Math.floor((postedDateInSeconds % 3600) / 60);
      const timeDifferenceText = (hours > 0 || minutes > 0) ? `${hours} hours ${minutes} minutes ago` : '';

      div.innerHTML = `
        <div class="card ">
          <div class="relative">
            <img
              class="object-cover w-full h-48 rounded-t-xl"
              src="${video.thumbnail}"
            />
            ${
              timeDifferenceText
                ? `<div class="absolute bottom-3 right-2 opacity-75 bg-gray-800 text-white p-2 text-xs">${timeDifferenceText}</div>`
                : ''
            }
          </div>
  
          <div class="flex-1 container mx-auto justify-center">
          <a href="#" class="block mt-2"></a>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center">
          <img
            class="flex-shrink-0 object-cover w-12 h-12 rounded-full sm:mx-4"
            src=${video.authors[0].profile_picture}
            alt=""
          />
  
          <div class="mt-4 sm:mt-0">
            <p class="text-xl font-bold text-neutral-600">${video.title}</p>
            <div class="flex items-center mt-2 text-gray-700 group-hover:text-white">
              <h1>${video.authors[0].profile_name}</h1>
              ${video.authors[0].verified ? '<img src="images/verified.png" width="20px" class="verified-icon ml-2" />' : ''}
            </div>
  
            <p class="mt-2 text-gray-500 group-hover:text-gray-300">
              ${video.others.views} views
            </p>
          </div>
        </div>
  
        <div class="flex mt-4 -mx-2"></div>
      </div>
      `;
      cardContainer.appendChild(div);
    });
  } 
  else 
  {
    document.getElementById("not-found-container").style.display = "block";
  }

  // curr selected tab
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    const categoryId = parseInt(tab.getAttribute("data-category-id"));
    if (categoryId === selectedCategoryId) {
      tab.classList.add("selected");
    } else {
      tab.classList.remove("selected");
    }
  });
};

const sortVideosByViews = () => {
  const videos = Array.from(document.querySelectorAll('.card'));

  videos.sort((a, b) => {
    const viewsA = parseInt(a.querySelector('.text-gray-500').innerText.match(/\d+/)[0]);
    const viewsB = parseInt(b.querySelector('.text-gray-500').innerText.match(/\d+/)[0]);
    return viewsB - viewsA;
  });

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  videos.forEach(video => {
    cardContainer.appendChild(video);
  });
};

const handleLoader = (status) => {
  document.getElementById("loader").style.display = status;
};

loadAllCategory();
loadVideosByCategoryId(selectedCategoryId);
