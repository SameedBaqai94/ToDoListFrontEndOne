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
    //Public Functions
    //controllers
    this.getList = function () {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield _getList();
            const listContainer = document.getElementById("listsContainer");
            //listContainer.textContent = data.title;
            data.forEach(element => {
                const h2 = document.createElement("h2");
                h2.textContent = element.title;
                listContainer.appendChild(h2);
            });
        });
    };
    this.addList = function (formData) {
        const formObj = {
            title: "",
            items: []
        };
        formData.forEach((val) => { formObj.title = val.toString(); });
        console.log(formObj);
        if (!_addList(formObj)) {
            console.log("Something went wrong");
        }
        console.log("List added");
        window.location.reload();
    };
}
document.addEventListener("DOMContentLoaded", function () {
    let App = new Main();
    const form = document.getElementById("listForm");
    App.getList();
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        App.addList(formData);
    });
});
