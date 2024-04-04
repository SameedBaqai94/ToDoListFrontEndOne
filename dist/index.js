"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Main() {
    //private functions
    //repositories
    function _getList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("http://localhost:8080/api/ToDoList/GetList");
                if (!response.ok) {
                    throw new Error;
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.log(`something went wrong with fetching GET ${error}`);
            }
        });
    }
    function _addList(formObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObj)
            };
            try {
                const response = yield fetch("http://localhost:8080/api/ToDoList/AddList", requestOptions);
                if (!response.ok) {
                    return false;
                }
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    function _addItem(itemObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemObj)
            };
            try {
                const response = yield fetch("http://localhost:8080/api/Items/AddItem?todolistid=1", requestOptions);
                if (!response.ok) {
                    return false;
                }
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    //Public Functions
    //controllers
    this.getList = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield _getList();
            const listTemplate = document.getElementById("listTemplate");
            //listContainer.textContent = data.title;
            data.forEach(element => {
                if (element.title != "") {
                    const list = document.createElement('div');
                    list.setAttribute("class", "list");
                    const h2 = document.createElement("h2");
                    h2.setAttribute("class", "list-title");
                    const ul = document.createElement("ul");
                    ul.setAttribute("class", "items");
                    const form = document.createElement("form");
                    form.setAttribute("class", "itemForm");
                    const input = document.createElement("input");
                    input.type = "text";
                    input.name = "description";
                    input.setAttribute("class", "itemInput");
                    input.placeholder = "Add new item...";
                    const button = document.createElement("button");
                    button.type = "submit";
                    button.textContent = "Submit";
                    h2.textContent = element.title;
                    form.appendChild(input);
                    form.appendChild(button);
                    list.appendChild(h2);
                    list.appendChild(ul);
                    list.appendChild(form);
                    listTemplate.appendChild(list);
                }
            });
        });
    };
    this.addList = function (formData) {
        const formObj = {
            title: ""
        };
        formData.forEach((val) => { formObj.title = val.toString(); });
        console.log(formObj);
        if (!_addList(formObj)) {
            console.log("Something went wrong");
        }
        console.log("List added");
        //window.location.reload();
    };
    this.addItem = function (itemFormData) {
        const itemObj = {
            description: "",
            status: ""
        };
        itemFormData.forEach((element) => {
            itemObj.description = element.toString();
            itemObj.status = "inactive";
        });
        console.log(itemObj);
        if (!_addItem(itemObj)) {
            console.log("Something went wrong");
        }
        console.log("Item added");
    };
}
function domContentLoadedPromise() {
    return new Promise((resolve) => {
        if (document.readyState == "complete") {
            resolve();
        }
        else {
            document.addEventListener('DOMContentLoaded', () => resolve());
        }
    });
}
function dynamicLoadedPromise(selector) {
    return new Promise((resolve) => {
        const eventListener = (event) => {
            event.preventDefault();
            const target = event.target;
            if (target.matches(selector)) {
                resolve(target);
            }
        };
        document.addEventListener('submit', eventListener);
    });
}
const App = new Main();
domContentLoadedPromise().then(() => {
    const listForm = document.getElementById("listForm");
    App.getList();
    listForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(listForm);
        console.log(formData);
        App.addList(formData);
    });
    return dynamicLoadedPromise(".itemForm");
}).then((clickedElement) => {
    console.log('Clicked element:', clickedElement);
    const itemData = new FormData(clickedElement);
    console.log(itemData);
    App.addItem(itemData);
});
