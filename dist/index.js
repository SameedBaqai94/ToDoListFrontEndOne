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
    function _removeList(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: "DELETE",
            };
            const getId = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`http://localhost:8080/api/ToDoList/GetListId?title=${title}`);
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
            const id = yield getId();
            if (!id)
                return false;
            try {
                const response = yield fetch(`http://localhost:8080/api/ToDoList/DeleteList/${id.id}`, requestOptions);
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
    function _getItems(title) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(title);
            const getId = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`http://localhost:8080/api/ToDoList/GetListId?title=${title}`);
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
            const id = yield getId();
            if (!id)
                return false;
            try {
                console.log(`http://localhost:8080/api/Items/GetItemsByListId?listId=${id.id}`);
                const response = yield fetch(`http://localhost:8080/api/Items/GetItemsByListId?listId=${id.id}`);
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
    function _addItem(itemObj, title) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestOptions = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemObj)
            };
            const getId = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`http://localhost:8080/api/ToDoList/GetListId?title=${title}`);
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
            const id = yield getId();
            try {
                const response = yield fetch(`http://localhost:8080/api/Items/AddItem?todolistid=${id.id}`, requestOptions);
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
            //const item: Item[] = await _getItems();
            const listTemplate = document.getElementById("listTemplate");
            //listContainer.textContent = data.title;
            data.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                if (element.title != "") {
                    const list = document.createElement('div');
                    list.setAttribute("class", "list");
                    const h2 = document.createElement("h2");
                    h2.setAttribute("class", "list-title");
                    const deleteButton = document.createElement("button");
                    deleteButton.setAttribute("class", "deleteButton");
                    deleteButton.textContent = "Remove";
                    const ul = document.createElement("ul");
                    ul.setAttribute("class", "items");
                    const item = yield _getItems(element.title);
                    item.forEach(e => {
                        const li = document.createElement('li');
                        li.textContent = e.description;
                        ul.appendChild(li);
                    });
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
                    list.appendChild(deleteButton);
                    list.appendChild(ul);
                    list.appendChild(form);
                    listTemplate.appendChild(list);
                }
            }));
        });
    };
    this.removeList = function (title) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSuccess = yield _removeList(title);
            if (isSuccess) {
                console.log("Something wrong");
                return false;
            }
            console.log("list delete");
            return true;
        });
    };
    this.addList = function (formData) {
        const formObj = {
            title: ""
        };
        formData.forEach((val) => { formObj.title = val.toString(); });
        if (!_addList(formObj)) {
            console.log("Something went wrong");
        }
        console.log("List added");
        //window.location.reload();
    };
    this.addItem = function (itemFormData, title) {
        const itemObj = {
            description: "",
            status: ""
        };
        itemFormData.forEach((element) => {
            itemObj.description = element.toString();
            itemObj.status = "inactive";
        });
        if (!_addItem(itemObj, title)) {
            console.log("Something went wrong");
            return false;
        }
        console.log("Item added");
        return true;
    };
}
const App = new Main();
function domContentLoadedPromise() {
    return new Promise((resolve) => {
        if (document.readyState == "complete") {
            resolve();
            document.removeEventListener('DOMContentLoaded', () => resolve());
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
                console.log(target);
                resolve(target);
                document.removeEventListener('submit', eventListener); // Cleanup
            }
        };
        document.addEventListener('submit', eventListener);
    });
}
function addToListPromise(itemData, title) {
    return new Promise((resolve) => {
        if (App.addItem(itemData, title)) {
            return resolve();
        }
    });
}
domContentLoadedPromise().then(() => {
    const listForm = document.getElementById("listForm");
    App.getList();
    listForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(listForm);
        App.addList(formData);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
    document.addEventListener('click', function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            // Assuming all your buttons have a class 'deleteButton'
            const target = event.target;
            if (target.matches('.deleteButton')) {
                event.preventDefault();
                // Cast the target to an Element to access Element properties
                const clickedButton = event.target;
                // Assuming you want to get a title from a preceding element like before
                const title = clickedButton.previousElementSibling;
                if (title && title.textContent) {
                    if ((yield App.removeList(title.textContent)) == false) {
                        console.log("List Deleted");
                    }
                }
            }
        });
    });
    return dynamicLoadedPromise(".itemForm");
}).then((clickedElement) => {
    var _a, _b;
    const itemData = new FormData(clickedElement);
    const title = (_b = (_a = clickedElement.previousElementSibling) === null || _a === void 0 ? void 0 : _a.previousElementSibling) === null || _b === void 0 ? void 0 : _b.previousElementSibling;
    if (title.textContent != null) {
        addToListPromise(itemData, title.textContent).then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });
    }
});
