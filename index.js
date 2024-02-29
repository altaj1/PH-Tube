const btnContainer = document.getElementById("btn-container");
const cardContainer = document.getElementById("card-container");
const errorEle = document.getElementById("error-element");
const sortBtn = document.getElementById("sort-btn");
let selectedCategory = 1000;
let sortByView = false;
sortBtn.addEventListener("click", ()=>{
    sortByView = true;
    fetchDataByCategories(selectedCategory, sortByView)
})

const fetchCagories = () =>{
    fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then(res => res.json())
    .then(({data}) => {
        data.forEach((card) => {
            // console.log(card);
            const newBtn = document.createElement("button");
            newBtn.className = 'categori-btn btn  btn-ghost bg-slate-700 text-white text-lg'
            newBtn.innerText = card.category;
            newBtn.addEventListener("click", () => {
                fetchDataByCategories(card.category_id);
                const allBtn = document.querySelectorAll(".categori-btn");
                for(const btn of allBtn){
                    btn.classList.remove("bg-red-600")
                }
                newBtn.classList.add("bg-red-600")
            });
            btnContainer.appendChild(newBtn);
        });
    });
}
 fetchCagories();
const fetchDataByCategories = (categoryID, sortByView) =>{
    selectedCategory = categoryID;
    fetch(` https://openapi.programming-hero.com/api/videos/category/${categoryID}`)
    .then(res => res.json())
    .then(({data}) =>{
        if(sortByView){
            data.sort((a, b) => {
                const totaViewsStrfirst = a.others?.views;
                const totaViewsStrSecond = b.others?.views;
                const totalViewsFirstNumber = parseFloat(totaViewsStrfirst.replace("k", "")) || 0;
                const totaViewsSecondNumber = parseFloat(totaViewsStrSecond.replace("k", "")) || 0;
                return totaViewsSecondNumber - totalViewsFirstNumber;
            })
        }

        if(data.length === 0){
            errorEle.classList.remove("hidden")
        }
        else{
            errorEle.classList.add("hidden")
        }
        console.log(data)
        cardContainer.innerHTML = ""
        data.forEach((videos) => {
            let verifiedBadge = "";
            if(videos.authors[0].verified){
                verifiedBadge = ` <img class="w-6 h-6" src="./images/verify.png" alt="">`
            }
            // console.log(card);
            const newCard = document.createElement("div");
            newCard.innerHTML = `
            <div class="card w-full bg-base-100 shadow-xl">
            <figure class="overflow-hidden h-72">
                <img class="w-full" src="${videos.thumbnail}" alt="Shoes" />
                <h6 class="absolute bottom-[40%] right-12">0 hr</h6>
            </figure>
            <div class="card-body">
                <div class="flex space-x-4 justify-start items-start">
                    <div>
                        <img class="w-12 h-12 rounded-full" src="${videos.authors[0].
                            profile_picture}" alt="Shoes" />
                    </div>
                    <div>
                        <h2 class="card-title">${videos.title}</h2>
                        <div class="flex mt-3">
                            <p class="">${videos.authors[0].profile_name}</p>
                           ${verifiedBadge}
                        </div>
                        <p class="mt-3">${videos.
                            others.views
                            }</p>
                    </div>
                </div>
            </div>
        </div>
            `;
            cardContainer.appendChild(newCard);
        });
    })
}
fetchDataByCategories(selectedCategory, sortByView)