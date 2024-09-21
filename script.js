baseURL = "https://frcz3-8080.csb.app/jobs?";

let currentPage = 1;
let limit = 3;

const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");

const TrueToYes = (bool) => {
  if (bool === true) {
    return "Yes";
  } else {
    return "No"
  }
};

const addSpaceToEnd = (arr) => {
  return arr.map(item => ' - ' + item)
};

const initialize = async () => {
  const renderAllJob = await searchAllJob("",currentPage,limit);
  displayJob(renderAllJob);
  searchJob();
}

const displayJob = (data) => {
  const jobList = document.querySelector(".jobList")
  jobList.innerHTML = "";
  data.forEach((job) => {
    const x = document.createElement("div");
    x.classList.add("job-box");
    x.innerHTML = `
        <div class="jobDetails">
          <div class="job jobTitle"><strong>Postion:</strong> ${job.title}</div>
          <div class="job place"><strong>Place:</strong> ${job.city}</div>
          <div class="job skills"><strong>Required Skills:</strong> ${addSpaceToEnd(job.skills)}</div>
          <div class="job skills"><strong>Required Skills:</strong> ${job.skills.join(" - ")}</div>
          <div class="job remote"><strong>Remote:</strong> ${TrueToYes(job.remote)}</div>
          <div class="job remote"><strong>Remote:</strong> ${job.remote?"yes":"no"}</div>
        </div>
        <div class="button-and-date">
          <div class="date"><strong>Post Date:</strong> ${job.postedDate.slice(0,10)}</div>
          <button>Apply</button>
        </div>
      `;
      jobList.appendChild(x);
  });
}

const searchAllJob = async (keyword,page,limit) => {
  try {
    const res = await fetch(`${baseURL}q=${keyword.trim()}&_page=${page}&_limit=${limit}`);
    const data = await res.json();
    // console.log(data);
    return data;
  } catch (err) {
    console.log("error :", err);
  }
};

const searchJob = async () => {
  const inputSearch = document.querySelector("#searchForm");
  let previousSearchValue = "";
  const handleSearch = async () => {
    const searchValue = inputSearch.value;
    const displaySearch = await searchAllJob(searchValue,currentPage,limit);
    displayJob(displaySearch);
  };
  inputSearch.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const searchValue = inputSearch.value;
      currentPage = 1;
      previousSearchValue = searchValue;
      const displaySearch = await searchAllJob(searchValue,currentPage,limit);
      displayJob(displaySearch);
    };
  });
  nextPageButton.addEventListener("click", async () => {
    const searchValue = inputSearch.value;
    if (searchValue !== previousSearchValue) {
      currentPage = 1;
      previousSearchValue = searchValue;
    } else {
      currentPage++;
    };
    const displaySearch = await searchAllJob(searchValue,currentPage,limit);
    displayJob(displaySearch);
  });
  
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        handleSearch();
    }
  });
};

initialize();