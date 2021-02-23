const inputElementValue = document.getElementById('urlValue');
const urlListElement = document.getElementById('url-list');
const buttonElement = document.getElementById('submit');
const currentURLElement = document.getElementById('currentURL');

let isNewlyCreated = false;
let currentUrlID = '';
let isCurrentUrlDeleted = false;
let previousCurrentUrlID = '';

buttonElement.addEventListener('click', () => {
  const inputValue = inputElementValue.value;
  createURLShortener(inputValue);
  inputElementValue.value = '';
});

const deleteURL = async (id) => {
  if (id) {
    await fetch(`/api/v1/urls/${id}`, { method: 'DELETE' });
    createURLsList([], true);
    if (id === currentUrlID) {
      isCurrentUrlDeleted = true;
      isNewlyCreated = false;
    }
  }
};

const getURLsData = async () => {
  try {
    const response = await fetch('/api/v1/urls');
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

const createURLShortener = async (long_url) => {
  if (long_url) {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ long_url }),
    };
    await fetch('/api/v1/urls', postData);
    createURLsList([], true);
    isNewlyCreated = true;
    isCurrentUrlDeleted = false;
  }
};

let urlsDataList = [];

getURLsData().then((data) => {
  urlsDataList = data;
  createURLsList(urlsDataList, false);
});

const createURLsList = (urlsDataList, isFetchRequired) => {
  deleteChildNodes();
  if (isFetchRequired) {
    let urlsDataList = [];
    getURLsData().then((data) => {
      urlsDataList = data;
      previousCurrentUrlID = currentUrlID;
      if (urlsDataList.length > 0) currentUrlID = urlsDataList[0].id;
      createURLsList(urlsDataList, false);
    });
  } else if (urlsDataList.length > 0) {
    urlsDataList.map((url, i) => {
      const divEle = document.createElement('div');
      const divOuterEle = document.createElement('div');
      const deleteDivEle = document.createElement('div');
      const previousDivEle = document.createElement('div');

      divEle.classList.add('lg:w-max');

      const anchorEle = document.createElement('a');
      const link = document.createTextNode(
        `http://tiny-ly.herokuapp.com/${url.id}`
      );

      anchorEle.appendChild(link);
      anchorEle.title = `http://tiny-ly.herokuapp.com/${url.id}`;
      anchorEle.href = `http://tiny-ly.herokuapp.com/api/v1/urls/${url.id}`;
      anchorEle.setAttribute('target', '_blank');

      divEle.appendChild(anchorEle);
      divEle.classList.add('lg:mr-10');
      divOuterEle.classList.add(
        'flex',
        'flex-col',
        'lg:flex-row',
        'items-center',
        'justify-center',
        'mb-2',
        'card'
      );
      deleteDivEle.innerText = 'Delete';
      deleteDivEle.classList.add(
        'bg-red-500',
        'text-white',
        'border',
        'rounded',
        'w-20',
        'cursor-pointer',
        'mt-2',
        'lg:mt-0'
      );
      deleteDivEle.setAttribute('id', `${url.id}`);
      deleteDivEle.onclick = function () {
        deleteURL(`${url.id}`);
      };

      divOuterEle.appendChild(divEle);
      if (!isFetchRequired) divOuterEle.appendChild(deleteDivEle);

      if (isNewlyCreated) urlListElement.appendChild(divOuterEle);

      if (i === 0 && (urlsDataList.length > 1 || !isNewlyCreated)) {
        appendPreviousElement(previousDivEle);
      }

      // if(i === 0 &&)

      if (!isNewlyCreated) urlListElement.appendChild(divOuterEle);

      urlListElement.classList.add(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      );
    });
  }
  isURLsAvailable(urlsDataList.length);
};

const deleteChildNodes = () => {
  let child = urlListElement.lastElementChild;
  while (child) {
    urlListElement.removeChild(child);
    child = urlListElement.lastElementChild;
  }
};

const isURLsAvailable = (urlList) => {
  if (urlList && isNewlyCreated && !isCurrentUrlDeleted) {
    currentURLElement.innerText = 'Current Shorten URL';
  } else {
    currentURLElement.innerText = '';
  }
};

const appendPreviousElement = (previousDivEle) => {
  urlListElement.appendChild(previousDivEle);
  previousDivEle.classList.add('text-gray-600', 'my-2');
  previousDivEle.innerText = 'Previous URL Shorteners';
};
